
import { Iotp } from "../../../interface/otp";

export default interface IOtpBaseRepository {
    findOtp(email:string): Promise<Iotp | null> ;
    deleteOtp(email:string): Promise<Iotp | null> ;
    saveOtp(email:string,otp:string): Promise<Iotp | null> ;  
}
