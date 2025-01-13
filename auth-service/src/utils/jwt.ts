import { IInstructor } from "@/models/instructorModel";

export interface IToken{
    access_token:string
}
export interface IJwt{
    create_verification_jwt(payload: IInstructor): Promise<string>;
}