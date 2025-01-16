import { IInstructor } from "@/models/instructorModel"
import { InstructorRepository } from "../repositories/instructorRepository"

export class InstructorServices{

    private instructorRepository:InstructorRepository

    constructor(){
        this.instructorRepository=new InstructorRepository()

    }
    
    public async findByEmail(email:string){
        const response=await this.instructorRepository.findByEmail(email)
        return response
    }


    public async createUser(userData:any){
        const response=await this.instructorRepository.createUser(userData)
        return response
    }
    public async resetPassword(email:string,password:string){
        const response=await this.instructorRepository.resetPassword(email,password)
        return response
    }
    
    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.instructorRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
}