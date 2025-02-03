import UserModel, { IUser } from "../../models/userModel";

import { Model } from "mongoose";
import {  IStudentRepository } from "./IStudentRepository";
import { IStudentBaseRepository } from "../baseRepository/student/IStudentBaseRepository";


export class StudentRepository implements IStudentRepository{
    private studentBaseRepository:IStudentBaseRepository
    constructor(studentBaseRepository:IStudentBaseRepository){
        this.studentBaseRepository=studentBaseRepository

    }
    async createStudent(payload:any):Promise<IUser | null>{
        try {
            const response=await this.studentBaseRepository.createStudent(payload)
            return response
            
            
        } catch (error) {
            console.log(error);
            throw error;
            
        }
    }
    async getStudentData(email:string):Promise<IUser | null>{
        try {
            const response=await this.studentBaseRepository.getStudentData(email)
            return response
            
        } catch (error) {
            console.log(error);
            throw error;
            
        }
    }
    async updateProfile(id:any,data:object):Promise<IUser | null>{
        try {
            const response=await this.studentBaseRepository.updateProfile(id,data)
            return response
            
        } catch (error) {
            console.log(error);
        throw error;
        
            
        }
    }
    
    async updatePassword(email:string,password:string):Promise<IUser | null>{
        try {
            const response=await this.studentBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error);
            throw error;
            
            
        }
    }
    async getStudents():Promise<IUser[]>{
        try {
            const response=await this.studentBaseRepository.findAllStudents()
            return response
            
        } catch (error) {
            console.log(error);
            throw error;
            
            
        }
    }
    
    
    
}