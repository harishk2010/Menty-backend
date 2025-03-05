export interface InstructorProfile {
  username: string;
  profilePicUrl: string;
}
export interface InstructorStatus {
  isBlocked: string;
}
export interface StudentProfile {
    username: string;
    profilePicUrl: string;
}
export interface StudentStatus {
  isBlocked: string;
}
export interface mentorSignup{
  email:string;
  password:string
}
export interface otpGenerateI {
  createOtpDigit(length?: number): Promise<string>;
}
export interface IEmail {
  sentEmailVerification(name: string, email: string, verification: string) : Promise <boolean>
}