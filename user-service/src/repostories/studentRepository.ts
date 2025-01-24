import UserModel, { IUser } from "../models/userModel";
import { StudentBaseRepository } from "./baseRepository/studentBaseRepository";
import { Model } from "mongoose";


export class StudentRepository{
    private studentBaseRepository:StudentBaseRepository<IUser>
    constructor(){
        this.studentBaseRepository=new StudentBaseRepository(UserModel)

    }
    async createStudent(payload:any){
        try {
            const response=await this.studentBaseRepository.createStudent(payload)
            
            
        } catch (error) {
            
        }
    }
    async getStudentData(email:string){
        try {
            const response=await this.studentBaseRepository.getStudentData(email)
            return response
            
        } catch (error) {
            
        }
    }
    async updateProfile(id:string,data:object){
        try {
            const response=await this.studentBaseRepository.updateProfile(id,data)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async updatePassword(email:string,password:string){
        try {
            const response=await this.studentBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async getStudents(){
        try {
            const response=await this.studentBaseRepository.findAllStudents()
            console.log(response,"repo students allll")
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    
    
}