import { Request, Response } from "express";
import { IVerificationControllers } from "./IVerificationControllers";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import { IVerificationService } from "../services/IVerificationService";
import produce from "../config/kafka/producer";
// import { VerificationService } from "@/services/verificationService";

export class VerificationContoller implements IVerificationControllers {

  private verificationService: IVerificationService;

  constructor(verificationService: IVerificationService) {
    this.verificationService = verificationService;
  }

  async submitRequest(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
      if (!req.files || typeof req.files !== "object") {
        throw new Error("No documents received");
      }

      // Cast `req.files` to the expected shape
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[]; // Type assertion
      };

      // Safely access the files
      const degreeCertificate = files.degreeCertificate?.[0] || null;
      const resume = files.resume?.[0] || null;
      //   console.log(degreeCertificate,resume)
      let degreeCertificateUrl;
      let resumeUrl;
      if (degreeCertificate && resume) {
        degreeCertificateUrl = await uploadToS3Bucket(
          degreeCertificate,
          "degreeCertificate"
        );
        resumeUrl = await uploadToS3Bucket(resume, "resume");

        let response = await this.verificationService.sendVerifyRequest(
          username,
          email,
          degreeCertificateUrl,
          resumeUrl
        );
        const emailID=response.email
        const status=response.status
  

          produce("verification-request",{emailID,status})
        
        res.status(200).send({
          success: true,
          message: "Verification Request Sent",
          data: response,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "No Documents",
        });
      }
    } catch (error) {
      console.log(error)
      throw new Error("Verify Request Document failed Creation at controller");
    }
  }

  async getRequestData(req:Request,res:Response):Promise<void>{
    try {
      const {email}=req.params
      const requestData=await this.verificationService.getRequestData(email)
     console.log(requestData,"getRequestData")
      if(requestData){
        res.status(200).json({
          data:requestData
        })
      }else{
        res.json(requestData)
      }
    } catch (error) {
      throw new Error("Error ")
      
    }
  }
  async getAllRequests(req:Request,res:Response):Promise<void>{
    try {
 
      const requestData=await this.verificationService.getAllRequests()
     console.log(requestData,"getAllRequests")
      if(requestData){
        res.status(200).json(
          requestData
        )
      }else{
        res.json(requestData)
      }
    } catch (error) {
      throw new Error("Error ")
      
    }
  }
}
