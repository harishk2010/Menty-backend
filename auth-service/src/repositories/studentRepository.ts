import { IUser } from "../models/userModel";
import IStudentRepository from "./interfaces/IStudentRepository";
import IStudentBaseRepository from "./baseRepositories/interfaces/IStudentBaseRepository";


export class StudentRepository implements IStudentRepository{
    private baseRepository:IStudentBaseRepository
    constructor(baseRepository:IStudentBaseRepository){
        this.baseRepository=baseRepository

    }
    
    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    async createUser(userData:any) {
        const response= await this.baseRepository.createStudent(userData)
        return response
    }
    
    async resetPassword(email:string,password:string) {
        const response= await this.baseRepository.resetPassword(email,password)
        return response
    }
    public async googleLogin(name: string, email: string, password: string): Promise<IUser | null> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }
    public async updateProfile(email:string,data:any): Promise<IUser | null> {
        try {
            const response = await this.baseRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    
    
}