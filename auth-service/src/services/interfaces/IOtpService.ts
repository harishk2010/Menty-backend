
import { Iotp } from "../../interface/otp";

export default interface IOtpServices {
    findOtp(email:string): Promise<Iotp | null> ;
    deleteOtp(email:string): Promise<Iotp | null> ;
    createOtp(email:string,otp:string): Promise<Iotp | null> ;  
}
