import { Document, Model } from "mongoose";
import UserModel,{ IUser } from "../../models/userModel";


export class StudentBaseRepository<T extends Document>{
    private model:Model<T>
    constructor(model:Model<T>){
        this.model=model

    }

    async createStudent(payload:IUser):Promise<IUser|null>{
        try {
            const student=await UserModel.create(payload)
            await student.save()
            return student
            
        } catch (error) {
            throw error
            
        }
    }
}