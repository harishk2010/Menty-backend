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
}