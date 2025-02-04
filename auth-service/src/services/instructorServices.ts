import IInstructorRepository from "@/repositories/interfaces/IInstructorRepository"
import { IInstructor } from "../models/instructorModel"
import { InstructorRepository } from "../repositories/instructorRepository"
import IInstructorServices from "./interfaces/IIntstuctorServices"

export class InstructorServices implements IInstructorServices{

    private instructorRepository:IInstructorRepository

    constructor(instructorRepository:IInstructorRepository){
        this.instructorRepository=instructorRepository

    }
    
    public async findByEmail(email:string): Promise<IInstructor | null>{
        try {
            const response=await this.instructorRepository.findByEmail(email)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }


    public async createUser(userData:any): Promise<IInstructor | null>{
        try {
            
            const response=await this.instructorRepository.createUser(userData)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async resetPassword(email:string,password:string): Promise<IInstructor | null>{
        try {
            const response=await this.instructorRepository.resetPassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
    public async googleLogin(name: string, email: string, password: string): Promise<IInstructor | null> {
        try {
            const response = await this.instructorRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    public async updateProfile(email:string,data:any): Promise<IInstructor | null> {
        try {
            const response = await this.instructorRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
}