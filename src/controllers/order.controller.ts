import { json, Request, Response } from "express";
import * as orderService from "../services/order.services"

interface jwtPayload {
      id: string;
      role: string;
  }
  
  interface CustomRequest extends Request {
      user?: jwtPayload;
  }

export const CreateOrder = async (req:Request, res:Response) =>{
     try{
      if(!req.user?.id){
             res.status(401).json({message:'user not authenticated'});
             return
      }
      const order = await orderService.CreateOrder(req.user.id);
      res.status(200).json(order)
     } catch (error) {
      if (error instanceof Error) {
            res.status(400).json({message : error.message})
      } else {
            res.status(500).json({message: 'Error creating order'});
      }
     }
};

export  const processPayment = async (req:Request , res:Response) =>{
      try {
            if (!req.user?.id) {
                   res.status(401).json({message: 'User not authenticated'});
                   return
            }
            const { orderId } = req.params;
            const paymentDetails = req.body;

            const order = await orderService.getOrderById(orderId, req.user.id);

            if (!order) {
                   res.status(404).json({message:'order not found' });
                   return
            }

            const updateOrder = await orderService.processOrderPayment(orderId, paymentDetails);
            res.status(200).json(updateOrder);
      } catch (error) {
            if (error instanceof Error) {
                  res.status(400).json({message: error.message});
            } else {
                  res.status(500).json({message:'Error processing payment'})
            }
      }
};

export const getUserOrders = async (req: Request, res: Response) => {
      try {
        if (!req.user?.id) {
           res.status(401).json({ message: 'User not authenticated' });
           return
        }
    
        const orders = await orderService.getUserOrders(req.user.id);
        res.status(200).json(orders);
      } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
      }
};