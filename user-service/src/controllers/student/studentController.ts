import { IUser } from "../../models/userModel";
import { Request, Response } from "express";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../../utils/jwt";
import produce from "../../config/kafka/producer";
import { IStudentControllers } from "../interfaces/IStudentController";
import { IStudentService } from "../../services/interfaces/IStudentService";
import { StatusCode } from "@/utils/enums";
import { PROFILE_PICTURE, StudentErrorMessages, StudentSuccessMessages } from "@/utils/constants";

export class StudentController implements IStudentControllers {
  private studentService: IStudentService;
  constructor(studentService: IStudentService) {
    this.studentService = studentService;
  }

  public async addStudent(payload: IUser): Promise<void> {
    try {
      let response = await this.studentService.createStudent(payload);
    } catch (error) {
      throw error;
    }
  }
  public async getStudent(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      let response = await this.studentService.getStudentData(email);
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  public async searchStudents(req: Request, res: Response): Promise<void> {
    const { q: query, role, page = 1, limit = 10 } = req.query;

    try {
      const result = await this.studentService.searchStudents(
        query as string,
        role as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: StudentSuccessMessages.STUDENTS_FETCHED,
        data: result,
      });
    } catch (error) {
      throw error
    }
  }
  public async getStudentDataById(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      let response = await this.studentService.getStudentDataById(studentId);
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { _id, username, mobile } = req.body;

      let profilePicUrl = PROFILE_PICTURE;
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
        await produce("update-profile-student", response);
        res.status(StatusCode.OK).json({
          success: true,
          message: StudentSuccessMessages.PROFILE_UPDATED,
          user: response,
        });
      } else {
        res.json({
          success: false,
          message: StudentErrorMessages.PROFILE_UPDATE_FAILED,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<any> {
    try {
      const { currentPassword, newPassword } = req.body;
      const tokenData = await verifyToken(req.cookies["accessToken"]);
      if (!tokenData) {
        throw new Error(StudentErrorMessages.TOKEN_EXPIRED);
      }
      let email = tokenData.email;
      const response = await this.studentService.getStudentData(email);
      if (!response) {
        throw new Error(StudentErrorMessages.STUDENT_NOT_FOUND);
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
          await produce("update-password-student", {
            email,
            password: hashedPassword,
          });
          res.status(StatusCode.OK).json({
            success: true,
            message: StudentSuccessMessages.PASSWORD_UPDATED,
          });
        } else {
          res.json({
            success: false,
            message: StudentErrorMessages.PASSWORD_UPDATE_FAILED,
          });
        }
      } else {
        res.json({
          success: false,
          message: StudentErrorMessages.CURRENT_PASSWORD_INCORRECT,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await this.studentService.getStudents();
      res.status(StatusCode.OK).json({
        users: students,
      });
    } catch (error) {
      throw error;
    }
  }
  public async blockStudent(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const studentData = await this.studentService.getStudentData(email);

      if (!studentData) {
        throw new Error(StudentErrorMessages.STUDENT_NOT_FOUND);
      }
      let id = studentData?._id?.toString();

      if (!id) {
        throw new Error(StudentErrorMessages.STUDENT_ID_MISSING);
      }
      const isBlocked = !studentData?.isBlocked;

      const studentStatus = await this.studentService.updateProfile(id, {
        isBlocked,
      });
      await produce("block-student", { email, isBlocked });

      if (studentStatus?.isBlocked) {
        res.status(StatusCode.OK).json({
          success: true,
          message: StudentSuccessMessages.STUDENT_BLOCKED,
        });
      } else {
        res.status(StatusCode.OK).json({
          success: true,
          message: StudentSuccessMessages.STUDENT_UNBLOCKED,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  ///kafka consume
  async passwordReset(data: {
    password: string;
    email: string;
  }): Promise<IUser | null> {
    try {
      const { password, email } = data;
      const response = await this.studentService.updatePassword(
        email,
        password
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
