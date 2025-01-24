import { NextFunction } from "express";

import StudentBaseRepository from "./baseRepositories/studentBaseRepository";
import UserModel,{ IUser } from "../models/userModel";


export class StudentRepository{
    private baseRepository:StudentBaseRepository<IUser>
    constructor(){
        this.baseRepository=new StudentBaseRepository(UserModel)

    }
    
    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    async createUser(userData:any) {
        const response= await this.baseRepository.createStudent(userData)
        return response
    }
    
    async resetPassword(email:string,password:string) {
        const response= await this.baseRepository.resetPassword(email,password)
        return response
    }
    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    public async updateProfile(data:any): Promise<any> {
        try {
            const response = await this.baseRepository.updateProfile(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
    
}