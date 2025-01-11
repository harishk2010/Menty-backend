import { Request, Response } from "express"
import bcrypt from "bcrypt"
export class InstructorController{
    constructor(){
        
    }

    public async instructorSignUp(req:Request,res:Response){
        try {
            let {
                email,
                password
            }=req.body

            const saltRound= 10
            const hashedPassword=await bcrypt.hash(password,saltRound)
            password=hashedPassword

            const ExistingInstructor= await this.instructorService.findByEmail(email)
        } catch (error) {
            
        }
    }
}