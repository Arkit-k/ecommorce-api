import { Request , Response } from "express";
import * as ProductService from "../services/product.services";

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
