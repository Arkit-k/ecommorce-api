import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

type Product = PrismaClient['product'];