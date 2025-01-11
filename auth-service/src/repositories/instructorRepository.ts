import { IInstructor } from "@/models/instructorModel";
import InstructorBaseRepository from "./baseRepositories/instructorBaseRepository";


export class InstructorRepository{
    private baseRepository:InstructorBaseRepository<IInstructor>
    constructor(){

    }
}