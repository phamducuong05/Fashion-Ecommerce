import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- 1. DỮ LIỆU MẪU (SẢN PHẨM) ---
const REAL_PRODUCTS = [
  {
    name: "Áo Thun Cotton Compact",
    desc: "Áo thun chất liệu cotton compact cao cấp, chống nhăn, thấm hút mồ hôi tốt.",
    originalPrice: 250000,
    price: 189000,
    thumbnail:
      "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/img/23/08/11/ao-thun-nam-cotton-coolmate-basci-moi-mau-be-1.jpg",
    category: "Áo Nam",
    colors: ["Be", "Đen", "Trắng"],
    sizes: ["M", "L", "XL"],
  },
  {
    name: "Quần Jeans Slim Fit",
    desc: "Dáng ôm vừa vặn, co giãn nhẹ thoải mái vận động suốt cả ngày.",
    originalPrice: 500000,
    price: 450000,
    thumbnail:
      "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/img/23/06/23/quan-jeans-nam-slim-fit-coolmate-mau-xanh-dam-1.jpg",
    category: "Quần Nam",
    colors: ["Xanh Đậm", "Xanh Nhạt"],
    sizes: ["29", "30", "31", "32"],
  },
  {
    name: "Áo Polo Pique",
    desc: "Chất vải cá sấu mắt chim, thoáng khí, form dáng lịch sự.",
    originalPrice: 350000,
    price: 299000,
    thumbnail:
      "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/img/23/11/02/ao-polo-nam-pique-coolmate-mau-xanh-navy-1.jpg",
    category: "Áo Nam",
    colors: ["Navy", "Xám"],
    sizes: ["S", "M", "L", "XL"],
  },
];

// --- 2. CÁC HÀM TIỆN ÍCH (HELPER FUNCTIONS) ---

const createSlug = (name: string): string => {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "") +
    "-" +
    Date.now()
  );
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// --- 3. HÀM CHẠY CHÍNH (MAIN) ---

async function main() {
  console.log("🔥 Bắt đầu Reset và Seeding dữ liệu (TypeScript)...");

  // --- BƯỚC 1: XÓA DỮ LIỆU CŨ (IDEMPOTENCY) ---
  // Xóa theo thứ tự ngược lại của quan hệ để tránh lỗi khóa ngoại
  await prisma.userVoucher.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Đã dọn dẹp database cũ.");

  // --- BƯỚC 2: TẠO USER (NGƯỜI DÙNG) ---
  console.log("👤 Đang tạo Users...");

  // Admin
  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: "123", // Demo pass
      fullName: "Quản Trị Viên",
      role: "ADMIN",
      phone: "0999999999",
      avatar: "https://i.pravatar.cc/150?u=admin",
    },
  });

  // Customer (Có sẵn Address Book)
  const customer = await prisma.user.create({
    data: {
      email: "khachhang@gmail.com",
      password: "123",
      fullName: "Nguyễn Văn Test",
      role: "USER",
      phone: "0123456789",
      avatar: "https://i.pravatar.cc/150?u=khach",
      addresses: {
        create: {
          recipientName: "Nguyễn Văn Test",
          phone: "0123456789",
          city: "Hà Nội",
          district: "Hai Bà Trưng",
          detail: "Số 1 Đại Cồ Việt",
          isDefault: true,
        },
      },
    },
  });

  // --- BƯỚC 3: TẠO DANH MỤC & SẢN PHẨM ---
  console.log("👕 Đang tạo Danh mục & Sản phẩm...");

  // Tạo danh mục Cha
  const cateNam = await prisma.category.create({
    data: { name: "Thời trang Nam", slug: "thoi-trang-nam" },
  });

  // Tạo danh mục Con và lưu vào Map để dùng lại
  const mapCategories: Record<string, number> = {};
  const subCategories = ["Áo Nam", "Quần Nam", "Phụ Kiện"];

  for (const catName of subCategories) {
    const cat = await prisma.category.create({
      data: {
        name: catName,
        slug: createSlug(catName),
        parentId: cateNam.id,
      },
    });
    mapCategories[catName] = cat.id;
  }

  // Mảng lưu tạm ID và Giá của các biến thể để dùng tạo đơn hàng giả
  let allVariantsForOrder: { id: number; price: number }[] = [];

  for (const item of REAL_PRODUCTS) {
    // Tính % giảm giá
    const discount = Math.round(
      ((item.originalPrice - item.price) / item.originalPrice) * 100
    );

    // Tìm ID danh mục (nếu không thấy thì lấy Áo Nam làm mặc định)
    const categoryId = mapCategories[item.category] || mapCategories["Áo Nam"];

    // 1. Tạo Product
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: createSlug(item.name),
        description: item.desc,
        thumbnail: item.thumbnail,
        originalPrice: item.originalPrice,
        price: item.price,
        discount: discount,
        isActive: true,
        // Một sản phẩm thuộc 2 danh mục: Danh mục con (Áo Nam) và Danh mục cha (Thời trang Nam)
        categories: {
          connect: [{ id: categoryId }, { id: cateNam.id }],
        },
      },
    });

    // 2. Tạo Variants (Màu x Size)
    for (const color of item.colors) {
      for (const size of item.sizes) {
        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: color,
            size: size,
            stock: randomInt(10, 100),
            sku: `${createSlug(item.name)
              .toUpperCase()
              .slice(0, 5)}-${color.charAt(0)}-${size}`,
            image: item.thumbnail, // Dùng tạm ảnh chính
          },
        });

        // Lưu lại thông tin để tí nữa tạo Fake Order
        allVariantsForOrder.push({
          id: variant.id,
          price: Number(item.price), // Lưu ý: Giá lấy từ Product cha
        });
      }
    }

    // 3. Tạo Review giả
    await prisma.review.create({
      data: {
        rating: randomInt(4, 5),
        comment: randomElement([
          "Sản phẩm tốt!",
          "Giao hàng nhanh",
          "Chất vải đẹp",
          "Đáng tiền",
        ]),
        userId: customer.id,
        productId: product.id,
      },
    });

    console.log(`✅ Đã thêm: ${item.name}`);
  }

  // --- BƯỚC 4: TẠO VOUCHER ---
  console.log("🎫 Đang tạo Voucher...");
  await prisma.voucher.createMany({
    data: [
      {
        code: "SALE50",
        value: 50000,
        stock: 100,
        startDate: new Date(),
        endDate: new Date("2025-12-31"),
      },
      {
        code: "FREESHIP",
        value: 30000,
        stock: 50,
        startDate: new Date(),
        endDate: new Date("2025-12-31"),
      },
    ],
  });

  // --- BƯỚC 5: TẠO ĐƠN HÀNG GIẢ (ORDERS) ---
  console.log("📦 Đang tạo Đơn hàng giả lập...");

  // Tạo 5 đơn hàng ngẫu nhiên
  for (let i = 0; i < 5; i++) {
    // Random mua 1-3 món
    const numItems = randomInt(1, 3);
    let orderTotal = 0;
    const orderItemsData = [];

    for (let j = 0; j < numItems; j++) {
      const randomVariant = randomElement(allVariantsForOrder);
      const quantity = randomInt(1, 2);
      const itemTotal = randomVariant.price * quantity;

      orderTotal += itemTotal;

      orderItemsData.push({
        variantId: randomVariant.id,
        quantity: quantity,
        price: randomVariant.price, // Snapshot giá tại thời điểm mua
      });
    }

    const shippingFee = 30000;
    const finalAmount = orderTotal + shippingFee;

    await prisma.order.create({
      data: {
        userId: customer.id,
        status: randomElement(["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]),
        totalAmount: orderTotal,
        shipping: shippingFee,
        discountAmount: 0,
        finalAmount: finalAmount,
        payment: randomElement(["COD", "BANKING"]),
        address: "Số 1 Đại Cồ Việt, Hà Nội",
        phone: "0123456789",
        items: {
          create: orderItemsData,
        },
      },
    });
  }

  console.log("🏁 XONG! Database đã được nạp dữ liệu mẫu thành công.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
