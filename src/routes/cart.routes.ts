import express from "express";
import * as cartController from "../controllers/cart.controller"
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:itemsId' , cartController.updateCartItems);
router.delete('/item/:itemId', cartController.removeFromCarts);
router.delete('/', cartController.clearCart);

export default router; 