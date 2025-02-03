import { ObjectId } from "mongoose"
import { IStudentService } from "./IStudentService"
import { IStudentRepository } from "../../repostories/student/IStudentRepository"
import { IUser } from "../../models/userModel"

export class StudentServices implements IStudentService{
    private studentRepository:IStudentRepository
    constructor(studentRepository:IStudentRepository){
        this.studentRepository=studentRepository

    }
    public async createStudent(payload:IUser):Promise<IUser | null>{
        try {
            const response=await this.studentRepository.createStudent(payload)
            return response
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    public async getStudentData(email:string):Promise<IUser | null>{
        try {
            const response=await this.studentRepository.getStudentData(email)
            return response
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    public async updateProfile(id:any,data:object):Promise<IUser | null>{
        try {
            const response=await this.studentRepository.updateProfile(id,data)
            return response
        } catch (error) {
            console.log(error)
            throw error
            
        }
    }
    public async updatePassword(email:string,password:string):Promise<IUser | null>{
        try {
            const response=await this.studentRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    public async getStudents():Promise<IUser[] | null>{
        try {
            const response=await this.studentRepository.getStudents()
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
}