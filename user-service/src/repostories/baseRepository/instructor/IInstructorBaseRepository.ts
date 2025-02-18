import { updateRequestType } from "../../../types/types";
import { IInstructor, ITransaction } from "../../../models/instructorModel";

export interface IInstructorBaseRepository{
    createInstructor(payload:IInstructor):Promise<IInstructor | null>
    getInstructorData(email:string):Promise<IInstructor | null>
    getTransactionsList(email:string,currentPage:number,itemsPerPage:number):Promise<ITransaction[] | null>

    getInstructorDataById(instructorId:string):Promise<IInstructor | null>
    updateProfile(id:string,data:object):Promise<IInstructor | null>
    updatePassword(email:string,password:string):Promise<IInstructor | null>
    findAllInstructors():Promise<IInstructor[] >
}