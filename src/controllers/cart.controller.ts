import { updateCartItem, removeFromCart } from './../services/cart.services';
import { authenticate } from "../middleware/auth.middleware";
import * as cartService from "../services/cart.services"
import express, { Request, Response } from 'express'


interface jwtPayload {
    id: string;
    role: string;
}

interface CustomRequest extends Request {
    user?: jwtPayload;
}

export const getCart = async (req: CustomRequest, res: Response)  => {
    try {
        if (!req.user?.id) {
             res.status(400).json({message:"User not authenticated"});
             return
        }
        
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
      console.error('Error getting cart:',error)
        res.status(500).json('Server error');
    }
}

export const addToCart = async (req:Request, res:Response) =>{
      try {
            if (!req.user?.id){
                   res.status(401).json({message:"user not authenticate"})
                   return
            }

       const { productId , quantity }= req.body;
       const cartItem = await cartService.addToCart(req.user.id,productId,quantity);
       res.status(200).json(cartItem);
      } catch (error) {
            if (error instanceof Error) {
                  res.status(400).json({message:error.message});
            } else{
                  res.status(500).json({message:"Error adding to cart"});
            }
      }
}

export const updateCartItems = async (req:Request, res:Response) =>{
      try{
            if (!req.user?.id){
                   res.status(401).json({message:'User not authenticated'});
                   return
            }

            const { itemId } = req.params;
            const { quantity } = req.body;
            const updatedItem = await cartService.updateCartItem(req.user.id,itemId,quantity);
            res.status(200).json(updatedItem);
      } catch (error) {
            if (error instanceof Error) {
                  res.status(400).json({message:error.message});
            } else {
                  res.status(500).json({message:'Error updating cart item'});
            }
      }
}

export const removeFromCarts = async (req:Request, res:Response) =>{
try {
      if(!req.user?.id) {
             res.status(401).json({message:'user not authenticated'});
             return
      }
      const { itemId } = req.params;
      await cartService.removeFromCart(req.user.id, itemId);
      res.status(204).send();
} catch (error) {
      if (error instanceof Error) {
            res.status(400).json({message:'Error removing cart item'});
      }
}
};

export const clearCart = async(req:Request, res:Response) =>{
      try {
            if (!req.user?.id) {
                   res.status(401).json({ message:'user not authenticated'});
                   return
            }
            await cartService.clearCart(req.user.id);
            res.status(200).send();
      } catch (error) {
            console.error('Error clearing cart:' , error);
            res.status(500).json({message:'error clearing cart'});
      }
};


