import { Request , Response, NextFunction } from 'express';


export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
      if (req.user?.role !== 'admin') {
            return res.status(403).json({message: 'admin access required'});
      }
      next();
};
