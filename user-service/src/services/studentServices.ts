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
    public async getStudentData(email:string){
        try {
            const response=await this.studentRepository.getStudentData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updateProfile(id:string,data:object){
        try {
            const response=await this.studentRepository.updateProfile(id,data)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updatePassword(email:string,password:string){
        try {
            const response=await this.studentRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async getStudents(){
        try {
            const response=await this.studentRepository.getStudents()
            console.log(response,"service students allll")
            return response
        } catch (error) {
            console.log(error)
        }
    }
    
}