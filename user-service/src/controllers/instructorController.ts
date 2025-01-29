import { IUser } from "../models/userModel";
import { Request, Response } from "express";
import { instructorServices } from "../services/instructorServices";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../utils/jwt";
import produce from "../config/kafka/producer";
import mongoose from "mongoose";

export class InstructorController {
  private instructorService: instructorServices;
  constructor() {
    this.instructorService = new instructorServices();
  }

  public async addInstructor(payload: IUser): Promise<any> {
    try {
      let response = await this.instructorService.createInstructor(payload);
    } catch (error) {
      console.log(error);
    }
  }
  public async getInstructor(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.params;
      // console.log(email,"get Instructor Data")
      let response = await this.instructorService.getInstructorData(email);
      // console.log(response)
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { _id, username, mobile ,expertise,skills} = req.body;
      console.log(req.body, "update Instructor Data");
      console.log(req.file, "update Instructor Data");

      let profilePicUrl = "No Picture";
      let response;
      
      if (req.file) {
        console.log("with profile pic")
        profilePicUrl = await uploadToS3Bucket(req.file, "Instructors");
        
        response = await this.instructorService.updateProfile(_id, {
          username,
          mobile,
          profilePicUrl,
        });
      } else {
        console.log("without profile pic")
        response = await this.instructorService.updateProfile(_id, {
          username,
          mobile,
          expertise,
          skills
        });
      }

      if (response) {
        await produce("update-profile-instructor",response)
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
      const response = await this.instructorService.getInstructorData(email);
      if (!response) {
        throw new Error("No user Found");
      }

      const oldPassword = response?.password;

      const result = await bcrypt.compare(currentPassword, oldPassword);
      if (result) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await this.instructorService.updatePassword(
          email,
          hashedPassword
        );
        if (response) {
          await produce("update-password-instructor",{email,password:hashedPassword})
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
    }
  }

  public async getInstructors(req:Request,res:Response){
    try {
    
      const Instructors=await this.instructorService.getInstructors()
      console.log(Instructors,"Instructors allll")
       res.status(200).json({
        users:Instructors
      })
    } catch (error) {
      console.log(error);
      
    }
  }
  public async blockInstructor(req:Request,res:Response){
    try {
      const { email }=req.params
      console.log(email,"instructorrrrrr")

      const InstructorData=await this.instructorService.getInstructorData(email)

      if(!InstructorData){
        throw new Error("No user found")
      }
      const id=InstructorData._id
      const isBlocked=!InstructorData?.isBlocked

      const InstructorStatus=await this.instructorService.updateProfile(id,{isBlocked})
      await produce("block-instructor",{email,isBlocked})

      if(InstructorStatus?.isBlocked){
        res.status(200).json({
          success:true,
          message:"Instructor Blocked"
        })
      }else{
        res.status(200).json({
          success:true,
          message:"Instructor UnBlocked"
        })

      }
      
    } catch (error) {
      console.log(error)
      
    }
  }


  ///kafka consume
  async passwordReset(data:any){
    try {
      const {password,email}=data
      const response = await this.instructorService.updatePassword(
        email,
        password
      );
      return response
    } catch (error) {
      console.log(error)
    }
  }
  async updateVerifyStatus(data:any){
    try {
      let email=data.emailID
      let status=data.status
      
      console.log(email,status)
      const instructorData= await this.instructorService.getInstructorData(email)
      let response
      if(status==="approved"){
        const isVerified=true
         response = await this.instructorService.updateProfile(instructorData?._id,{verificationStatus:status,isVerified});
      }else{

         response = await this.instructorService.updateProfile(instructorData?._id,{verificationStatus:status});
      }
      return response
    } catch (error) {
      console.log(error)
    }
  }
  async approveRequest(data:any){
    try {
      let email=data.emailID
      let status=data.status
      
      console.log(email,status)
      const instructorData= await this.instructorService.getInstructorData(email)
      let response
      if(status==="approved"){
        const isVerified=true
         response = await this.instructorService.updateProfile(instructorData?._id,{verificationStatus:status,isVerified});
      }else if(status==="rejected"){
        const isVerified=false

         response = await this.instructorService.updateProfile(instructorData?._id,{verificationStatus:status,isVerified});
        }else{
        response = await this.instructorService.updateProfile(instructorData?._id,{verificationStatus:status});

      }
      return response
    } catch (error) {
      console.log(error)
    }
  }
}
