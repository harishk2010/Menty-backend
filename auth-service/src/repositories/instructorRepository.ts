import { NextFunction } from "express";
import InstructorModel, { IInstructor } from "../models/instructorModel";
import InstructorBaseRepository from "./baseRepositories/instructorBaseRepository";
import IInstructorRepository from "./interfaces/IInstructorRepository";
import IInstructorBaseRepository from "./baseRepositories/interfaces/IInstructorBaseRepository";


export class InstructorRepository implements IInstructorRepository{
    private baseRepository:IInstructorBaseRepository
    constructor(baseRepository:IInstructorBaseRepository){
        this.baseRepository=baseRepository

    }
    
    async findByEmail(email:string): Promise<IInstructor | null>{
       try {
           const response = await this.baseRepository.findByEmail(email)
           return response
        
       } catch (error) {
        console.log(error)
        throw error
       }
    }

    async createUser(userData:any): Promise<IInstructor | null> {
        
        try {
            const response= await this.baseRepository.createInstructor(userData)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
    async resetPassword(email:string,password:string): Promise<IInstructor | null> {
       
       try {
           
           const response= await this.baseRepository.resetPassword(email,password)
           return response
       } catch (error) {
        console.log(error)
        throw error
       }
    }
    public async googleLogin(name: string, email: string, password: string): Promise<IInstructor | null> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    public async updateProfile(email:string,data:any): Promise<IInstructor | null>{
        try {
            const response = await this.baseRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
    
}