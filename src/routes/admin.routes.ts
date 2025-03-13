import express from 'express';
import * as adminController from '../controllers/admin.controller'
import { requireAdmin } from '../middleware/role.middleware';
import { authenticate } from '../middleware/auth.middleware';


const router = express.Router();

router.use( authenticate, requireAdmin);

router.post('/products',adminController.createProduct);
router.put('/products/:id',adminController.updateProduct)
router.delete('/products/:id',adminController.deleteProduct)

router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Dashboard statistics
router.get('/stats/inventory', adminController.getInventoryStats);
router.get('/stats/sales', adminController.getSalesStats);

export default router;