import { IInstructor, ITransaction } from "../../models/instructorModel";
import { IInstructorService } from "./IInstructorService";
import { InstructorRepository } from "../../repostories/instructor/instructorRepository";
import { IInstructorRepository } from "../../repostories/instructor/IInstructorRepository";
import { TransactionsResult } from "../../types/types";

export class InstructorServices implements IInstructorService {
  private instructorRepository: IInstructorRepository;

  constructor(instructorRepository: IInstructorRepository) {
    this.instructorRepository = instructorRepository;
  }

  /**
   * Create a new instructor.
   * @param payload - Instructor data to create.
   * @returns The created instructor.
   */
  async createInstructor(payload: object): Promise<IInstructor | null> {
    try {
      const response = await this.instructorRepository.create(payload);
      return response;
    } catch (error) {
      console.error("Error in createInstructor:", error);
      throw error;
    }
  }

  /**
   * Get instructor data by email.
   * @param email - Email of the instructor.
   * @returns The instructor data.
   */
  async getInstructorData(email: string): Promise<IInstructor | null> {
    try {
      const response = await this.instructorRepository.findOne({ email });
      return response;
    } catch (error) {
      console.error("Error in getInstructorData:", error);
      throw error;
    }
  }
  async updatePlanPrice(instructorId:string,planPrice: number): Promise<IInstructor | null> {
    try {
      const response = await this.instructorRepository.update(instructorId,{planPrice});
      return response;
    } catch (error) {
      console.error("Error in updatePlanPrice:", error);
      throw error;
    }
  }

  /**
   * Get instructor data by ID.
   * @param instructorId - ID of the instructor.
   * @returns The instructor data.
   */
  async getInstructorDataById(instructorId: string): Promise<IInstructor | null> {
    try {
      const response = await this.instructorRepository.findById(instructorId);
      return response;
    } catch (error) {
      console.error("Error in getInstructorDataById:", error);
      throw error;
    }
  }

  /**
   * Update instructor profile.
   * @param id - ID of the instructor.
   * @param data - Data to update.
   * @returns The updated instructor data.
   */
  async updateProfile(id: string, data: object): Promise<IInstructor | null> {
    try {
      const response = await this.instructorRepository.update(id, data);
      return response;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  }

  /**
   * Get a list of transactions for an instructor.
   * @param email - Email of the instructor.
   * @param currentPage - Current page number for pagination.
   * @param itemsPerPage - Number of items per page.
   * @returns A list of transactions.
   */
  async getTransactionsList(
    email: string,
    page: number,
    limit: number,
    search: string = ''
  ): Promise<TransactionsResult | null> {
    try {
      const result = await this.instructorRepository.getTransactionsList(
        email,
        page,
        limit,
        search
      );
      
      return result;
    } catch (error) {
      console.error("Error in getTransactionsList service:", error);
      throw error;
    }
  }

  /**
   * Update an instructor's password.
   * @param email - Email of the instructor.
   * @param password - New password.
   * @returns The updated instructor data.
   */
  async updatePassword(email: string, password: string): Promise<IInstructor | null> {
    try {
      const response = await this.instructorRepository.updatePassword(email, password);
      return response;
    } catch (error) {
      console.error("Error in updatePassword:", error);
      throw error;
    }
  }

  /**
   * Get all instructors.
   * @returns A list of all instructors.
   */
  async getInstructors(): Promise<IInstructor[] | null> {
    try {
      const response = await this.instructorRepository.findAll();
      return response;
    } catch (error) {
      console.error("Error in getInstructors:", error);
      throw error;
    }
  }
}