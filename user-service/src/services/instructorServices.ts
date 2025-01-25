import { ObjectId } from "mongoose"
import { InstructorRepository } from "../repostories/instructorRepository"

export class instructorServices{
    private instructorRepository:InstructorRepository
    constructor(){
        this.instructorRepository=new InstructorRepository()

    }
    public async createInstructor(payload:object){
        try {
            const response=await this.instructorRepository.createInstructor(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async getInstructorData(email:string){
        try {
            const response=await this.instructorRepository.getInstructorData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updateProfile(id:any,data:object){
        try {
            const response=await this.instructorRepository.updateProfile(id,data)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updatePassword(email:string,password:string){
        try {
            const response=await this.instructorRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async getInstructors(){
        try {
            const response=await this.instructorRepository.getInstructors()
            return response
        } catch (error) {
            console.log(error)
        }
    }
    
}