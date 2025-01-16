import { IUser } from "../models/userModel"
import { StudentRepository } from "../repositories/studentRepository"

export class StudentServices{

    private studentRepository:StudentRepository

    constructor(){
        this.studentRepository=new StudentRepository()

    }
    
    public async findByEmail(email:string){
        const response=await this.studentRepository.findByEmail(email)
        return response
    }


    public async createUser(userData:any){
        const response=await this.studentRepository.createUser(userData)
        return response
    }
    public async resetPassword(email:string,password:string){
        const response=await this.studentRepository.resetPassword(email,password)
        return response
    }
    
    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.studentRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
}