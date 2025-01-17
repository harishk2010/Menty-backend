import { JwtService } from "../utils/jwt";
import { Request, Response } from "express";

export class AdminController{
     private JWT: JwtService;
    constructor(){
         this.JWT=new JwtService();

    }

    public async login(req:Request,res:Response):Promise<any>{
        const AdminEmail="admin@gmail.com"
        const AdminPassword="admin@123"
        try {
            const {email,password}=req.body
            if(email!==AdminEmail){
                return res.send({
                    success:false,
                    message:"Email Wrong"
                })
            }
            if(password!==AdminPassword){
                return res.send({
                    success:false,
                    message:"Password Wrong"
                })
            }
            console.log(email,password,"admin")
            const accesstoken = await this.JWT.accessToken({ email, role:"admin" });
            return res
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

    async logout(req: Request, res: Response) {
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