import { IAdmin } from "../models/adminModel";
import IAdminService from "./interfaces/IAdminService";
import IAdminRepository from "../repositories/interfaces/IAdminRepository";

export class AdminService implements IAdminService {
  private adminRepository: IAdminRepository;
  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getAdminData(email: string): Promise<IAdmin | null> {
    return this.adminRepository.findOne({ email });
  }
  async createAdmin(email: string, password: string): Promise<IAdmin | null> {
    return this.adminRepository.create({ email, password });
  }
}
