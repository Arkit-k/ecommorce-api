import { PrismaClient  } from '@prisma/client'

type Cart = PrismaClient['Cart'];
type CartItem = PrismaClient['CartItem'];

const prisma = new PrismaClient();

export const getCart = async(userId:string):Promise<Cart & {items:(CartItem & {product: {id:string; name:string; price:number; imageUrl:string | null}})[]}> =>{
 return prisma.cart.findUniqueorThrow({
      where: { userId },
      include:{
        items:{
         include:{
            product:{
                  select:{
                        id:true,
                        name:true,
                        price:true,
                        imageUrl:true
                  }
            }
         }
        }
      }
 });
};

export const addToCart = async (userId:string, productId:string,quantity:number): Promise<CartItem> =>{

      const product = await prisma.product.findUnique({where:{id:productId}});

      if(!product) {
            throw new Error('Product not found');
      }
      if(product.stock < quantity) {
            throw new Error ('not enough stock available')
      }

      const cart = await prisma.cart.findUnique({where:{ userId}});

      if(!cart) {
            throw new Error('Cart not found');
      }
      const existingItem = await prisma.cartItem.findUnique({
            where:{
                  cartId_product:{
                        cartId:cart.id,
                        productId
                  }
            }
      });

      if (existingItem) {
            return prisma.cartItem.update({
                  where: {id: existingItem.id},
                  data:{quantity:existingItem.quantity + quantity}
            });
      } else {
            return prisma.cartItem.create({
                  data:{
                        cartId:cart.id,
                        productId,
                        quantity
                  }
            });
      }
}

export const updateCartItem = async (userId: string , cartItemId:string, quantity:number):Promise<CartItem> =>{
      const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {item: true}
      });

      if (!cart) {
            throw new Error('cart not found');
      }

      

      const cartItem = cart.items.find((item: CartItem) => item.id === cartItemId);

      if(!cartItem) {
            throw new Error('cart item not found');
      }

      if (quantity <= 0) {
            await prisma.cartItem.delete({where:{id:cartItemId}});
            return {...cartItem, quantity:0} as CartItem;
      } else {
            const product = await prisma.product.findUnique({where:{id:cartItem.productId}})
        if (!product || product.stock < quantity) {
            throw new Error('Not enough stock available');
        }
        return prisma.cartItem.update({
            where:{ id:cartItemId},
            data:{ quantity }
        });
      }
}

export const removeFromCart = async (userId:string , cartItemId:string):Promise<void> =>{
      const cart = await prisma.cart.findUnique({
            where:{ userId},
            include:{ items:true}
      });

      if (!cart) {
            throw new Error('cart not found');
      }

      const cartItem: CartItem | undefined = cart.items.find((item: CartItem) => item.id === cartItemId);
      if (!cartItem) {
            throw new Error('cart item not found');
      }

      await prisma.cartItem.delete({ where:{id:cartItemId}});
};


export const clearCart = async (userId:string):Promise<void> =>{
      const cart = await prisma.cart.findUnique({where:{userId}});

      if (!cart) {
            throw new Error("cart not found");
      }

      await prisma.cartItem.deleteMany({ where:{ cartId:cart.id}})
};