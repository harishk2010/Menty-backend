import { StudentRepository } from "../repostories/studentRepository"

export class studentServices{
    private studentRepository:StudentRepository
    constructor(){
        this.studentRepository=new StudentRepository()

    }
    public async createStudent(payload:object){
        try {
            const response=await this.studentRepository.createStudent(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
}