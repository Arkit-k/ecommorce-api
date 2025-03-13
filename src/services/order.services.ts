import { createProduct } from './product.services';
import { PrismaClient, OrderStatus, Order, Prisma } from "@prisma/client";
 import * as paymentSservice from './payment.services'

// type  Order = PrismaClient['Order'];
// type OrderStatus = PrismaClient['OrderStatus']

 const prisma = new PrismaClient();

 export const CreateOrder = async ( userId : string): Promise<Order> =>{

      interface CartItem {
            product: {
                  id: string;
                  name: string;
                  price: number;
                  stock: number;
            };
            quantity: number;
      }

      interface Cart {
            id: string;
            userId: string;
            items: CartItem[];
      }

      return prisma.$transaction(async (tx: Prisma.TransactionClient): Promise<Order> => {
            const cart: Cart = await tx.cart.findUniqueOrThrow({
                  where: { userId },
                  include: {
                        items: {
                              include: {
                                    product: true,
                              },
                        },
                  },
            });

            if (cart.items.length === 0) {
                  throw new Error('cart is empty');
            }

            let total = 0;
            const orderItems = [];

            for (const item of cart.items) {
                  if (item.product.stock < item.quantity) {
                        throw new Error(`Not enough stock for product:' ${item.product.name}`);
                  }

                  await tx.product.update({
                        where:{id:item.product.id},
                        data:{ stock: item.product.stock - item.quantity}
                  });

                  const itemTotal = item.product.price * item.quantity;
                  total += itemTotal;

                  orderItems.push({
                        productId: item.product.id,
                        quantity:item.quantity,
                        price:item.product.price
                  });
            }

            const order = await tx.order.create({
                  data:{
                        userId,
                        total,
                        items:{
                              create:orderItems
                        }
                  }
            });

            await tx.cartItem.deleteMany({
                  where:{ cartId:cart.id }
            });
      
      return order;
      });
 }

 export const processOrderPayment = async (orderId: string , paymentDetails:any):Promise<Order>=>{

      const order = await prisma.order.findUniqueOrThrow({
            where: {id:orderId}
      });

      if (order.status == 'PAID') {
            throw new Error('order is already paid');
      }

      const paymentResult = await paymentSservice.processPayment(order, paymentDetails);

      if(!paymentResult.success) {
            throw new Error(paymentResult.error || 'Patyment failed');
      }
      return prisma.order.update({
            where:
            {id:orderId},
            data:{
                  status: 'PAID',
                  paymentId:paymentResult.paymentId
            }
      });
 };

 export const getOrderById = async (orderId: string, userId:string):Promise<Order | null> =>{
      return prisma.order.findFirst({
            where:{
                  id:orderId,
                  userId
            },
            include: {
                  items:{
                        include:{
                              product:{
                                    select:{
                                          id: true, 
                                          name: true,
                                          imageUrl:true
                                    }
                              }
                        }
                  }
            }
      });
 };

 export const getUserOrders = async (userId:string): Promise<Order[]> =>{
      return prisma.order.findMany({
            where: {userId},
            include:{
                  items:{
                        include:{
                              product:{
                                    select:{
                                          id:true,
                                          name:true,
                                          imageUrl:true
                                    }
                              }
                        }

                  }
            },
            orderBy:{
                  createdAt:'desc'
            }
      })
 }