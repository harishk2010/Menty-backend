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
}