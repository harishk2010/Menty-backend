import { IUser } from "../../models/userModel";
import { IStudentService } from "../../interfaces/IStudentService";
import { StudentRepository } from "../../repostories/student/studentRepository";
import { IStudentRepository } from "../../interfaces/IStudentRepository";
import { FilterQuery } from "mongoose";
import { PaginationResult, SearchOptions } from "@/types/types";

export class StudentServices implements IStudentService {
  private studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  
  async createStudent(payload: IUser): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.create(payload);
      return response;
    } catch (error) {
      console.error("Error in createStudent:", error);
      throw error;
    }
  }


  async getStudentData(email: string): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.findOne({ email });
      return response;
    } catch (error) {
      console.error("Error in getStudentData:", error);
      throw error;
    }
  }
  async getStudentDataById(studentId: string): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.findById(studentId);
      return response;
    } catch (error) {
      console.error("Error in getStudentData:", error);
      throw error;
    }
  }


  async updateProfile(id: string, data: object): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.update(id, data);
      return response;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  }
  async searchStudents(
    query: string,
    role: string,
    page: number,
    limit: number
  ): Promise<{ success: boolean; data: IUser[]; pagination: PaginationResult<IUser>["pagination"] }> {
    const result = await this.studentRepository.searchUsers(query, role, page, limit);

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  }

  async updatePassword(email: string, password: string): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.updatePassword(email, password);
      return response;
    } catch (error) {
      console.error("Error in updatePassword:", error);
      throw error;
    }
  }

  async getStudents(): Promise<IUser[]> {
    try {
      const response = await this.studentRepository.findAll();
      return response;
    } catch (error) {
      console.error("Error in getStudents:", error);
      throw error;
    }
  }
}