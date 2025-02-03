import { IUser } from "../../models/userModel";
import { Request, Response } from "express";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../../utils/jwt";
import produce from "../../config/kafka/producer";
import { IStudentControllers } from "./IStudentController";
import { IStudentService } from "../../services/student/IStudentService";

export class StudentController implements IStudentControllers {
  private studentService: IStudentService;
  constructor(studentService:IStudentService) {
    this.studentService = studentService;
  }

  public async addStudent(payload: IUser):  Promise<void> {
    try {
      let response = await this.studentService.createStudent(payload);

    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }
  public async getStudent(req: Request, res: Response):  Promise<void> {
    try {
      const { email } = req.params;
      // console.log(email,"get Student Data")
      let response = await this.studentService.getStudentData(email);
      // console.log(response)
      res.json(response);
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { _id, username, mobile } = req.body;
      console.log(req.body, "update Student Data");
      console.log(req.file, "update Student Data");

      let profilePicUrl = "No Picture";
      let response;
      
      if (req.file) {
        console.log("with profile pic")
        profilePicUrl = await uploadToS3Bucket(req.file, "students");
        
        response = await this.studentService.updateProfile(_id, {
          username,
          mobile,
          profilePicUrl,
        });
      } else {
        console.log("without profile pic")
        response = await this.studentService.updateProfile(_id, {
          username,
          mobile,
        });
      }

      if (response) {
        await produce("update-profile-student",response)
        res.status(200).json({
          success: true,
          message: "Profile Updated!",
          user: response,
        });
      } else {
        res.json({
          success: false,
          message: "Not Updated!",
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<any> {
    try {
      const { currentPassword, newPassword } = req.body;
      const tokenData = await verifyToken(req.cookies["accessToken"]);
      if (!tokenData) {
        throw new Error("Token expiered!");
      }
      let email = tokenData.email;
      const response = await this.studentService.getStudentData(email);
      if (!response) {
        throw new Error("No user Found");
      }

      const oldPassword = response?.password;

      const result = await bcrypt.compare(currentPassword, oldPassword);
      if (result) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await this.studentService.updatePassword(
          email,
          hashedPassword
        );
        if (response) {
          await produce("update-password-student",{email,password:hashedPassword})
          res.status(200).json({
            success: true,
            message: "Password Updated",
          });
        } else {
          res.json({
            success: false,
            message: "Password Not Updated",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Current Password is Wrong",
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }

  public async getStudents(req:Request,res:Response):Promise<void>{
    try {
    
      const students=await this.studentService.getStudents()
      console.log(students,"students allll")
       res.status(200).json({
        users:students
      })
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }
  public async blockStudent(req:Request,res:Response):Promise<void>{
    try {
      const { email }=req.params

      const studentData=await this.studentService.getStudentData(email)

      if(!studentData){
        throw new Error("No user found")
      }
      let id = studentData?._id?.toString(); // Ensure id is a string or null

      if (!id) {
          throw new Error("Instructor ID is missing"); // Handle the undefined case
      }
      const isBlocked=!studentData?.isBlocked
 
      const studentStatus=await this.studentService.updateProfile(id,{isBlocked})
      await produce("block-student",{email,isBlocked})

      if(studentStatus?.isBlocked){
        res.status(200).json({
          success:true,
          message:"Student Blocked"
        })
      }else{
        res.status(200).json({
          success:true,
          message:"Student UnBlocked"
        })

      }
      
    } catch (error) {
      console.log(error);
      throw error;
      
      
    }
  }


  ///kafka consume
  async passwordReset(data:any):Promise<IUser | null>{
    try {
      const {password,email}=data
      const response = await this.studentService.updatePassword(
        email,
        password
      );
      return response
    } catch (error) {
      console.log(error);
      throw error;
      
    }
  }
}
