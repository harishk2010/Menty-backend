import { JwtService } from "../utils/jwt";
import { Request, Response } from "express";
import { IAdminControllers } from "./interfaces/IAdminControllers";

export class AdminController implements IAdminControllers{
     private JWT: JwtService;
    constructor(){
         this.JWT=new JwtService();

    }

    public async login(req:Request,res:Response):Promise<void>{
        const AdminEmail="admin@gmail.com"
        const AdminPassword="admin@123"
        try {
            const {email,password}=req.body
            if(email!==AdminEmail){
                 res.send({
                    success:false,
                    message:"Email Wrong"
                })
                return
            }
            if(password!==AdminPassword){
                 res.send({
                    success:false,
                    message:"Password Wrong"
                })
                return
            }
            console.log(email,password,"admin")
            const accesstoken = await this.JWT.accessToken({ email, role:"admin" });
             res
            .cookie("accessToken", accesstoken,{ httpOnly: true })
            .send({
                success:true,
                message:"Welcome Admin",
                data:{email,role:"admin"}
            })
            
        } catch (error) {
            throw error
        }
    }

    async logout(req: Request, res: Response):Promise<void> {
        try {
          console.log("admin logged out");
          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");
    
          res.status(200).send({ success: true, message: "logout success" });
        } catch (error: any) {
          throw error;
        }
      }
}