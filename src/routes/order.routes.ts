import express from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.post('/' , orderController.CreateOrder);
router.post('/:orderId/payment', orderController.processPayment)
router.get('/:orderId',orderController.getUserOrders);
router.get('/',orderController.getUserOrders);

export default router;
