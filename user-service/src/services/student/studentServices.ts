import { IUser } from "../../models/userModel";
import { IStudentService } from "./IStudentService";
import { StudentRepository } from "../../repostories/student/studentRepository";
import { IStudentRepository } from "../../repostories/student/IStudentRepository";

export class StudentServices implements IStudentService {
  private studentRepository: IStudentRepository;

  constructor(studentRepository: IStudentRepository) {
    this.studentRepository = studentRepository;
  }

  /**
   * Create a new student.
   * @param payload - Student data to create.
   * @returns The created student.
   */
  async createStudent(payload: IUser): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.create(payload);
      return response;
    } catch (error) {
      console.error("Error in createStudent:", error);
      throw error;
    }
  }

  /**
   * Get student data by email.
   * @param email - Email of the student.
   * @returns The student data.
   */
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

  /**
   * Update student profile.
   * @param id - ID of the student.
   * @param data - Data to update.
   * @returns The updated student data.
   */
  async updateProfile(id: string, data: object): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.update(id, data);
      return response;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  }

  /**
   * Update student password.
   * @param email - Email of the student.
   * @param password - New password.
   * @returns The updated student data.
   */
  async updatePassword(email: string, password: string): Promise<IUser | null> {
    try {
      const response = await this.studentRepository.updatePassword(email, password);
      return response;
    } catch (error) {
      console.error("Error in updatePassword:", error);
      throw error;
    }
  }

  /**
   * Get all students.
   * @returns A list of all students.
   */
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