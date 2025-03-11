import { PrismaClient } from '@prisma/client'
import { resolve } from 'path';


type  Order = PrismaClient['Order'];


export const processPayment = async (order:Order , paymentDetails: any): Promise<{success: boolean; paymentId?:string; error? :string}> => {
      try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const success = Math.random() > 0.1;

            if (success) {
                  return {
                        success:true,
                        paymentId:`pay_${Date.now()}`
                  };
            } else {
                  return {
                        success: false,
                        error:'Payment failed . Please try again' 
                  }
            }
      } catch (error) {
            console.error ('payment processing error:' , error);
            return {
                  success:false,
                  error:'An error occurred while processing payment'
            }
      }
}