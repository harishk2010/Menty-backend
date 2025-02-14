import UserModel, { IUser } from "../../models/userModel";
import { Model } from "mongoose";
import { IInstructorRepository } from "./IInstructorRepository";
import { IInstructorBaseRepository } from "../baseRepository/instructor/IInstructorBaseRepository";
import { IInstructor } from "../../models/instructorModel";


export class InstructorRepository implements IInstructorRepository{
    private instructorBaseRepository:IInstructorBaseRepository
    constructor(instructorBaseRepository:IInstructorBaseRepository){
        this.instructorBaseRepository=instructorBaseRepository

    }
    async createInstructor(payload:any):Promise<IInstructor | null>{
        try {
            const response=await this.instructorBaseRepository.createInstructor(payload)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    async getInstructorData(email:string):Promise<IInstructor | null>{
        try {
            const response=await this.instructorBaseRepository.getInstructorData(email)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    async getInstructorDataById(instructorId:string):Promise<IInstructor | null>{
        try {
            const response=await this.instructorBaseRepository.getInstructorDataById(instructorId)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    async updateProfile(id:any,data:object):Promise<IInstructor | null>{
        try {
            const response=await this.instructorBaseRepository.updateProfile(id,data)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    
    async updatePassword(email:string,password:string):Promise<IInstructor | null>{
        try {
            const response=await this.instructorBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async getInstructors():Promise<IInstructor[] | null>{
        try {
            const response=await this.instructorBaseRepository.findAllInstructors()
            return response
            
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    
    
    
}