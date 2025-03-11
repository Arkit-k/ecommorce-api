// import { PrismaClient  } from "@prisma/client";
// import * as paymentSservice from './payment.services'

// type  Order = PrismaClient['Order'];
// type OrderStatus = PrismaClient['OrderStatus']

// const prisma = new PrismaClient();

// export const CreateOrder = async ( userId : string): Promise<Order> =>{

//       return prisma.$transacton(async (tx) =>{

//             const cart = await tx.cart.findUniqueorThrow({
//                   where:{ userId },
//                   include:{
//                         item:{
//                               include:{
//                                     product:true
//                               }
//                         }
//                   }
//             });

//             if (cart.items.length === 0 ) {
//                   throw new Error('cart is empty');
//             }
//       })
// }