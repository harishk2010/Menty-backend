import { IAdmin } from "../../models/adminModel";

export default interface IAdminService {
  getAdminData(email: string): Promise<IAdmin | null>;
  createAdmin(email: string, password: string): Promise<IAdmin | null>;
}
