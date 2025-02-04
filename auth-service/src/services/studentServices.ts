import IStudentRepository from "@/repositories/interfaces/IStudentRepository"
import { IUser } from "../models/userModel"
import { StudentRepository } from "../repositories/studentRepository"
import IStudentServices from "./interfaces/IStudentServices"

export class StudentServices implements IStudentServices{

    private studentRepository:IStudentRepository

    constructor(studentRepository:IStudentRepository){
        this.studentRepository=studentRepository

    }
    
    public async findByEmail(email:string){
        try {
            const response=await this.studentRepository.findByEmail(email)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
     
    }


    public async createUser(userData:any){
        try {
            const response=await this.studentRepository.createUser(userData)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async resetPassword(email:string,password:string){
        try {
            const response=await this.studentRepository.resetPassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
    public async googleLogin(name: string, email: string, password: string): Promise<IUser | null> {
        try {
            const response = await this.studentRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    public async updateProfile(email:string,data:any): Promise<IUser | null> {
        try {
            const response = await this.studentRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
}