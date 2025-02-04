
import { Request, Response } from "express";

export interface ICategoryControllers {
    addCategory(req:Request,res:Response):Promise<void>
    editCategory(req:Request,res:Response):Promise<void>
    unListCategory(req:Request,res:Response):Promise<void>
    listCategory(req:Request,res:Response):Promise<void>
    getAllCategory(req:Request,res:Response):Promise<void>
  
}
