import InstructorModel, { IInstructor } from "../models/instructorModel";
import InstructorBaseRepository from "./baseRepositories/instructorBaseRepository";


export class InstructorRepository{
    private baseRepository:InstructorBaseRepository<IInstructor>
    constructor(){
        this.baseRepository=new InstructorBaseRepository(InstructorModel)

    }
    
    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }
}