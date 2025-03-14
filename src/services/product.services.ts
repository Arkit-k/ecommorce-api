import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

import { Product } from '@prisma/client';

export const getAllProducts = async (): Promise<Product[]> => {
           const products = await prisma.product.findMany();
           return products;
};

export const getProductById = async (id: string): Promise<Product | null> => {
       return await prisma.product.findUnique({ where:{ id} });
};
export const createProduct = async (data: Omit<Product, 'id'| 'createdAt'| 'update'>): Promise<Product> => {
       return await prisma.product.create({ data });
};
export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> =>{
return await prisma.product.update({ where :{ id } ,
     data
});
};


export const deleteProduct = async (id:string): Promise<Product> => {
       return await prisma.product.delete({ where: { id } });
};
