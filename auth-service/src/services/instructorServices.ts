import { IInstructor } from "../models/instructorModel";
import IInstructorServices from "./interfaces/IIntstuctorServices";
import { InstructorRepository } from "../repositories/instructorRepository";
import { IInstructorRepository } from "../repositories/interfaces/IInstructorRepository";

export class InstructorServices implements IInstructorServices {
  private instructorRepository: IInstructorRepository;

  constructor(instructorRepository: IInstructorRepository) {
    this.instructorRepository = instructorRepository;
  }

  async findByEmail(email: string): Promise<IInstructor | null> {
    return await this.instructorRepository.findByEmail(email);
  }

  async createUser(userData: IInstructor): Promise<IInstructor | null> {
    return await this.instructorRepository.createUser(userData);
  }

  async resetPassword(
    email: string,
    password: string
  ): Promise<IInstructor | null> {
    return await this.instructorRepository.resetPassword(email, password);
  }

  async googleLogin(
    name: string,
    email: string,
    password: string
  ): Promise<IInstructor | null> {
    return await this.instructorRepository.googleLogin(name, email, password);
  }

  async updateProfile(email: string, data: any): Promise<IInstructor | null> {
    return await this.instructorRepository.updateProfile(email, data);
  }
}
