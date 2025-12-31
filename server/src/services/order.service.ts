import { prisma } from "../config/database";
import { AppError } from "../utils/AppError";
import * as emailService from "./email.service";
import * as paymentService from "./payment.service";

interface CreateOrderData {
    userId: number;
    paymentMethod: "COD" | "VNPAY";
    addressData: { recipientName: string; phone: string; address: string };
    items?: any[]; // If creating directly, else take from Cart
}

export const createOrder = async (data: CreateOrderData, req: any) => {
    const { userId, paymentMethod, addressData } = data;

    // 1. Get Cart
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { 
            items: { 
                include: { 
                    variant: { include: { product: true } } 
                } 
            } 
        }
    });

    if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
    }

    // 2. Calculate Total & Verify Stock
    let totalAmount = 0;
    for (const item of cart.items) {
        if (item.variant.stock < item.quantity) {
             throw new AppError(`Not enough stock for ${item.variant.product.name} (${item.variant.color}, ${item.variant.size})`, 400);
        }
        totalAmount += Number(item.variant.product.price) * item.quantity;
    }

    // Shipping fee (Example: flat rate or free > X)
    const shippingFee = totalAmount > 500000 ? 0 : 30000;
    const finalAmount = totalAmount + shippingFee;

    // 3. Transaction: Create Order, Items, Deduct Stock, Clear Cart
    const result = await prisma.$transaction(async (tx) => {
        // Create Order
        const newOrder = await tx.order.create({
            data: {
                userId,
                status: "PENDING",
                totalAmount: totalAmount,
                shipping: shippingFee,
                finalAmount: finalAmount,
                payment: paymentMethod,
                address: addressData.address,
                phone: addressData.phone,
                items: {
                    create: cart.items.map(item => ({
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.variant.product.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: true }
                        }
                    }
                }
            }
        });

        // Deduct Stock
        for (const item of cart.items) {
            await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } }
            });
            
            // Should also increment 'sold' count on Product? Optional optimisation.
        }

        // Clear Cart
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return newOrder;
    });

    // 4. Post-Creation Logic
    if (paymentMethod === "COD") {
        // Send Email immediately
        await emailService.sendOrderConfirmation(req.user.email, result);
        return { order: result };
    } else if (paymentMethod === "VNPAY") {
        // Generate VNPay URL
        try {
            const vnpUrl = paymentService.createPaymentUrl(req, result.id, finalAmount);
            return { order: result, vnpUrl };
        } catch (error) {
            console.error("VNPay URL Generation Error:", error);
            throw new AppError("Failed to generate payment URL", 500);
        }
    }

    return { order: result };
};

export const handleVNPayReturn = async (query: any) => {
    const verify = paymentService.verifyReturnUrl(query);
    
    if (!verify.isSuccess || !verify.orderId) {
        throw new AppError("Invalid Payment Signature or Failed Transaction", 400);
    }

    const orderId = Number(verify.orderId);

    // Update Order Status
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" }, // Paid
        include: {
             items: {
                    include: {
                        variant: {
                            include: { product: true }
                        }
                    }
                },
             user: true
        }
    });

    // Send Email
    if (updatedOrder.user && updatedOrder.user.email) {
        await emailService.sendOrderConfirmation(updatedOrder.user.email, updatedOrder);
    }

    return updatedOrder;
};
