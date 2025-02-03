import { ObjectId } from "mongoose"
import { InstructorRepository } from "../../repostories/instructor/instructorRepository"
import { IInstructorService } from "./IInstructorService"
import { IInstructorRepository } from "../../repostories/instructor/IInstructorRepository"
import { IInstructor } from "../../models/instructorModel"

export class InstructorServices implements IInstructorService{
    private instructorRepository:IInstructorRepository
    constructor(instructorRepository:IInstructorRepository){
        this.instructorRepository= instructorRepository

    }
    public async createInstructor(payload:object):Promise<IInstructor | null>{
        try {
            const response=await this.instructorRepository.createInstructor(payload)
            return response
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    public async getInstructorData(email:string):Promise<IInstructor | null>{
        try {
            const response=await this.instructorRepository.getInstructorData(email)
            return response
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    public async updateProfile(id:string,data:object):Promise<IInstructor | null>{
        try {
            const response=await this.instructorRepository.updateProfile(id,data)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async updatePassword(email:string,password:string):Promise<IInstructor | null>{
        try {
            const response=await this.instructorRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async getInstructors():Promise<IInstructor[] | null>{
        try {
            const response=await this.instructorRepository.getInstructors()
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
}