import AdminModel, { IAdmin } from "../../models/adminModel";
import { GenericRepository } from "../GenericRepository";
import IAdminRepository from "../interfaces/IAdminRepository";


export class AdminRepository extends GenericRepository<IAdmin> implements IAdminRepository{
    constructor(){
        super(AdminModel)
    }

}