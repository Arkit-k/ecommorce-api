
import { NextFunction, Request , Response , RequestHandler} from 'express';
import * as ProductService from "../services/product.services";
      

export const getAllProducts = async (req:Request, res:Response) =>{
      try {
            const products = await ProductService.getAllProducts();
            res.status(200).json(products);
      } catch (error) {
            console.error('Error getting Products',error);
      }
};


export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await ProductService.getProductById(id);

    if (!product) {
       res.status(404).json({ msg: 'Product not found' }); // 404 is more appropriate
    }

     res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product', error);
    // 🔥 Add "return" here to prevent double responses
     res.status(500).json({ msg: 'Internal server error' });
  }
};
