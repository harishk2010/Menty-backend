import UserModel, { IUser } from "../models/userModel";
import { StudentBaseRepository } from "./baseRepository/studentBaseRepository";
import { Model } from "mongoose";


export class StudentRepository{
    private studentBaseRepository:StudentBaseRepository<IUser>
    constructor(){
        this.studentBaseRepository=new StudentBaseRepository(UserModel)

    }
    async createStudent(payload:any){
        try {
            const resposne=await this.studentBaseRepository.createStudent(payload)
            
        } catch (error) {
            
        }
    }
    
}