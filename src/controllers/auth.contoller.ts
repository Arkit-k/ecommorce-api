import { Request , Response  } from "express";
import * as authServices from '../services/auth.services';

export const register = async (req: Request, res: Response) => {
    try {
            const user = await authServices.registerUser(req.body);
            res.status(201).json(user);
      } catch(error) {
            if (error instanceof Error) {
            res.status(400).json({message:  error.message});
      } else {
            res.status(500).json({message: 'Something went wrong'});
      }

}
}

export const login = async (req: Request, res: Response) => {
      try {
            const result = await authServices.loginUser(req.body);
            res.status(200).json(result);
      } catch (error) {
            if (error instanceof Error) {
            res.status(400).json({message:  error.message});
      } else {
            res.status(500).json({message: 'Something went wrong'});
      }
      }
}