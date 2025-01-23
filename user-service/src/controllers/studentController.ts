import { IUser } from "../models/userModel";
import { Request, Response } from "express";
import { studentServices } from "../services/studentServices";
import { uploadToS3Bucket } from "../utils/s3Bucket";

export class StudentController {
  private studentService: studentServices;
  constructor() {
    this.studentService = new studentServices();
  }

  public async addStudent(payload: IUser): Promise<any> {
    try {
      let response = await this.studentService.createStudent(payload);
    } catch (error) {
      console.log(error);
    }
  }
  public async getStudent(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.params;
      // console.log(email,"get Student Data")
      let response = await this.studentService.getStudentData(email);
      // console.log(response)
      res.json(response);
    } catch (error) {
      console.log(error);
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
        profilePicUrl = await uploadToS3Bucket(req.file, "students");

        response = await this.studentService.updateProfile(_id, {
          username,
          mobile,
          profilePicUrl,
        });
      } else {
        response = await this.studentService.updateProfile(_id, {
          username,
          mobile,
        });
      }

      if (response) {
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
}
