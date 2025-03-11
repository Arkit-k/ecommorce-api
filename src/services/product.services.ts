import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type Product = PrismaClient['product'];

export const getAllProducts = async (): Promise<Product[]> => {
	return  prisma.product.findMany();
};

export const getProductById = async (id: string): Promise<Product | null> => {
      return prisma.product.findUnique({ where:{ id} });
};
export const createProduct = async (data: Omit<Product, 'id'| 'createdAt'| 'update'>): Promise<Product> => {
      return prisma.product.create({ data });
};
export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> =>{
      return prisma.product.update({ where :{ id } ,
            data
});
};


export const deleteProduct = async (id:string): Promise<Product> => {
      return prisma.product.delete({ where: { id } });
};
