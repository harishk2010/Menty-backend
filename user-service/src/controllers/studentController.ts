import { IUser } from "../models/userModel";
import { Request, Response } from "express";
import { studentServices } from "../services/studentServices";

export class StudentController{
    private studentService:studentServices
    constructor(){
        this.studentService=new studentServices()

    }

    public async addStudent(payload:IUser):Promise<any>{
        try {
            let response=await this.studentService.createStudent(payload)
        } catch (error) {  
            console.log(error) 
            
        }
    }
    public async getStudent(req:Request,res:Response):Promise<any>{
        try {
            const {email}=req.params
            console.log(email,"get Student Data")
            let response=await this.studentService.getStudentData(email)
            // console.log(response)
            res.json(response)
        } catch (error) {  
            console.log(error) 
            
        }
    } 
    
    public async updateProfile(req:Request,res:Response):Promise<any>{
        try {
            const {id,data}=req.body
            console.log(id,data,"update Student Data")
            let response=await this.studentService.updateProfile(id,data)
            if(response){
                res.status(200).json({
                    success:true,
                    message:"Profile Updated!",
                    user:response
                })
            }else{
                res.json({
                    success:false,
                    message:"Not Updated!",                    
                })

            }
        } catch (error) {  
            console.log(error) 
            
        }
    } 
}