import { getUserOrders } from './order.controller';
import { Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as ProductService from "../services/product.services";
import { console } from 'inspector';

interface jwtPayload {
      id: string;
      role: string;
  }
  
  interface CustomRequest extends Request {
      user?: jwtPayload;
  }

const prisma = new PrismaClient();


export const createProduct = async (req: Request, res: Response) => {
      try {
            const Product = await ProductService.createProduct(req.body);
            res.status(201).json(Product);
      } catch (error) {
            console.error('Error creating product', error);
            res.status(500).json({msg: 'Internal server error'});
      }
}

export const updateProduct = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const product = await ProductService.updateProduct(id, req.body);
            res.status(200).json(product);

        } catch (error) {
            console.error('Error updating product', error);
            res.status(500).json({msg: 'Internal server error'});
        }

}

export const deleteProduct = async (req:Request , res:Response) =>{
      try {
            const { id } = req.params;
            await ProductService.deleteProduct(id);
            res.status(204).send(); 
      } catch (error) {

            console.log('Error deleting product:',error);
            res.status(500).json({message: 'Error deleting product'});
      }
};

export const getAllOrders = async (req: Request, res: Response) => {
      try {
        const orders = await prisma.order.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        res.status(200).json(orders);
      } catch (error) {
        console.error('Error getting all orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
      }
    };

export const updateOrderStatus = async (req:Request , res:Response) =>{
  try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await prisma.order.update({
            where: { id },
            data:{ status }
      });

      res.status(200).json(updatedOrder);
  } catch (error) {
      console.error('Error updating order status:',error);
      res.status(500).json({ message: ' Error updating order status'});
  }
};

export const getInventoryStats = async (req: Request, res:Response) =>{
      try {
            const lowStockProducts = await prisma.product.findMany({
                  where:{
                        stock:{
                              lt:10
                        }
                  },
                  orderBy:{
                        stock:'asc'
                  }
            });
            
            const products = await prisma.product.findMany();
            interface Product {
                  id: string;
                  name: string;
                  price: number;
                  stock: number;
            }

            const totalInventoryValue: number = products.reduce((sum: number, product: Product) => {
                  return sum + (product.price * product.stock);
            }, 0);
            const totalProducts = products.length;

            interface Product {
                  id: string;
                  name: string;
                  price: number;
                  stock: number;
            }

            const outOfStockCount: number = products.filter((p: Product) => p.stock === 0).length;

            res.status(200).json({
                  totalProducts,
                  totalInventoryValue,
                  lowStockProducts
            });
      } catch (error) {
            console.error ( 'Error getting inventory stats', error);
            res.status(500).json({message:'Error fetching inventort statistics'})
      }
};

export const getSalesStats = async (req: Request, res: Response) => {
      try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        // Get orders from the last 30 days
        const recentOrders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: thirtyDaysAgo
            },
            status: 'PAID'
          }
        });
        
        // Calculate total sales
      interface Order {
            id: string;
            total: number;
            createdAt: Date;
            status: string;
      }

      const totalSales: number = recentOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
        
        // Count orders
        const orderCount = recentOrders.length;
        
        // Calculate average order value
        const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
        
        res.status(200).json({
          period: '30 days',
          totalSales,
          orderCount,
          averageOrderValue
        });
      } catch (error) {
        console.error('Error getting sales stats:', error);
        res.status(500).json({ message: 'Error fetching sales statistics' });
      }
    };
    




