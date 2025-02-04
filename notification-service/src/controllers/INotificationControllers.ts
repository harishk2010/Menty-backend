export default interface INotificationControllers{
    sendOtpEmail(data:{
        email:string,
        name:string,
        otp:string
    }):Promise<void>
    sendForgotEmail(data:{
        email:string,
        otp:string
    }):Promise<void>
    sendVerifiedInstructorEmail(data:{
        email:string,
        username:string,        
    }):Promise<void>
}