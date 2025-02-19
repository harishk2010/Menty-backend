import { IInstructor } from "../models/instructorModel";
import { GenericRepository } from "./GenericRepository";
import InstructorModel from "../models/instructorModel";
import  {IInstructorRepository}  from "../repositories/interfaces/IInstructorRepository";

export class InstructorRepository extends GenericRepository<IInstructor> implements IInstructorRepository {
  constructor() {
    super(InstructorModel);
  }

  async findByEmail(email: string): Promise<IInstructor | null> {
    return await this.findOne({ email });
  }

  async createUser(userData: any): Promise<IInstructor | null> {
    return await this.create(userData);
  }

  async resetPassword(email: string, password: string): Promise<IInstructor | null> {
    try {
        const instructor=await this.findOne({email})
        if(!instructor){
            throw new Error("No InstructorData found")
        }
        const userId=(instructor._id as unknown as string)
        
        return await this.update(userId, { password });
    } catch (error) {
        throw error
    }
  }

  async googleLogin(name: string, email: string, password: string): Promise<IInstructor | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      // Create a new user
      const newUser = await this.createUser({ name, email, password });
      return newUser;
    }

    return user;
  }

  async updateProfile(email: string, data: any): Promise<IInstructor | null> {

    try {
        const instructor=await this.findOne({email})
        if(!instructor){
            throw new Error("No InstructorData found")
        }
        const userId=(instructor._id as unknown as string)
        return await this.update(userId, data);
    } catch (error) {
        throw error
    }
  }
}