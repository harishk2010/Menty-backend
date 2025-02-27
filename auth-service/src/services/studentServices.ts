import { IUser } from "../models/userModel";
import  IStudentServices  from "./interfaces/IStudentServices";
import { StudentRepository } from "../repositories/studentRepository";
import { IStudentRepository } from "../repositories/interfaces/IStudentRepository";

export class StudentServices implements IStudentServices {
  private studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.studentRepository.findByEmail(email);
  }

  async createUser(userData: IUser): Promise<IUser | null> {
    return await this.studentRepository.createUser(userData);
  }

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    return await this.studentRepository.resetPassword(email, password);
  }

  async googleLogin(name: string, email: string, password: string): Promise<IUser | null> {
    return await this.studentRepository.googleLogin(name, email, password);
  }

  async updateProfile(email: string, data: any): Promise<IUser | null> {
    return await this.studentRepository.updateProfile(email, data);
  }
}