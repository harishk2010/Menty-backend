import { updateRequestType } from "../../types/types";
import { IUser } from "../../models/userModel";

export interface IStudentRepository{
    createStudent(payload:IUser):Promise<IUser | null>
    getStudentData(email:string):Promise<IUser | null>
    updateProfile(id:string,data:object):Promise<IUser | null>
    updatePassword(email:string,password:string):Promise<IUser | null>
    getStudents():Promise<IUser[] >
}