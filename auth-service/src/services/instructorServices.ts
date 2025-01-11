export class InstructorServices{
    constructor(){

    }
    public async findByEmail(email:string){
        const response=await this.mentorRepository.findByEmail(email)
        return response
    }
}