
import { IUser } from "../../models/userModel"

export interface IStudentService{
    createStudent(payload:object):Promise<IUser | null>
    getStudentData(email:string):Promise<IUser | null>
    updateProfile(id:string,data:object):Promise<IUser | null>
    updatePassword(email:string,password:string):Promise<IUser | null>
    getStudents():Promise<IUser[] | null>
}