import UserModel, { IUser } from "../models/userModel";
import { InstructorBaseRepository } from "./baseRepository/instructorBaseRepository";
import { Model } from "mongoose";


export class InstructorRepository{
    private instructorBaseRepository:InstructorBaseRepository<IUser>
    constructor(){
        this.instructorBaseRepository=new InstructorBaseRepository(UserModel)

    }
    async createInstructor(payload:any){
        try {
            const response=await this.instructorBaseRepository.createInstructor(payload)
            
            
        } catch (error) {
            
        }
    }
    async getInstructorData(email:string){
        try {
            const response=await this.instructorBaseRepository.getInstructorData(email)
            return response
            
        } catch (error) {
            
        }
    }
    async updateProfile(id:any,data:object){
        try {
            const response=await this.instructorBaseRepository.updateProfile(id,data)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async updatePassword(email:string,password:string){
        try {
            const response=await this.instructorBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async getInstructors(){
        try {
            const response=await this.instructorBaseRepository.findAllInstructors()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    
    
}