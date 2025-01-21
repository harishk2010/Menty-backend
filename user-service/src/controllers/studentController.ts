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
}