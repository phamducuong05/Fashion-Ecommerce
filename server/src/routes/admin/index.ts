import express from 'express';
import { ProductController } from '../../controllers/admin/productController';
import { CustomerController } from '../../controllers/admin/customerController';
import { OrderController } from '../../controllers/admin/orderController';
import { PromotionController } from '../../controllers/admin/promotionController';
import { DashboardController } from '../../controllers/admin/dashboardController';
import { ChatController } from '../../controllers/admin/chatController';
import { ProfileController } from '../../controllers/admin/profileController';
import chatbotController from '../../controllers/user/chatbotController';

const router = express.Router();

// Products - CRUD
router.get('/products', ProductController.listProducts);
router.get('/products/:id', ProductController.getProduct);
router.post('/products', ProductController.createProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

// Customers
router.get('/customers', CustomerController.listCustomers);
router.get('/customers/:id', CustomerController.getCustomer);

// Orders
router.get('/orders', OrderController.listOrders);
router.get('/orders/:id', OrderController.getOrder);
router.put('/orders/:id', OrderController.updateOrderStatus);

// Promotions (raw vouchers)
router.get('/promotions', PromotionController.getPromotions);

// Discounts (Vouchers) - CRUD
router.get('/discounts', PromotionController.getDiscounts);
router.post('/discounts', PromotionController.createDiscount);
router.put('/discounts/:id', PromotionController.updateDiscount);
router.delete('/discounts/:id', PromotionController.deleteDiscount);

// Banners - CRUD
router.get('/banners', PromotionController.getBanners);
router.post('/banners', PromotionController.createBanner);
router.put('/banners/:id', PromotionController.updateBanner);
router.delete('/banners/:id', PromotionController.deleteBanner);

// Dashboard
router.get('/dashboard', DashboardController.getDashboard);

// Chat
router.get('/chat', ChatController.listChats);
router.get('/chat/:id', ChatController.getChat);

// Compatibility chat endpoints expected by frontend
router.get('/chatmessages', ChatController.listChatMessages);
router.get('/chatmessages/:id', ChatController.getChatMessages);

// Profile Management
router.get('/profile', ProfileController.getProfile);
router.put('/profile', ProfileController.updateProfile);
router.post('/change-password', ProfileController.changePassword);
router.delete('/account', ProfileController.deleteAccount);

// AI Chatbot - Sync products to AI service
router.post('/chatbot/sync', chatbotController.syncProductsToAI);

export default router;
