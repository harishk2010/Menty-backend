import { IInstructor } from "../../models/instructorModel"
import { Document , Model } from "mongoose"
export default class InstructorBaseRepository<T extends Document>{
    private model:Model<T>

    constructor(model:Model<T>){
        this.model=model

    }
    
    async findByEmail(email:string):Promise<IInstructor|null >{
        return await this.model.findOne({email:email})
    }
    async createInstructor(email:string,password:string):Promise<null>{
        return null

    }
}