import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { InstructorServices } from "../services/instructorServices";

export class InstructorController {
  private instructorService: InstructorServices;

  constructor() {
    this.instructorService = new InstructorServices();
  }

  public async instructorSignUp(req: Request, res: Response): Promise<any> {
    try {
      let { email, password } = req.body;
      console.log(email, password);

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      password = hashedPassword;

      const ExistingInstructor = await this.instructorService.findByEmail(
        email
      );

      console.log(ExistingInstructor, "ExistingInstructor");

      if (ExistingInstructor) {
        return res.status(201).send({
          success: true,
          message: "Existing user",
          user: ExistingInstructor,
        });
      }

      return res.status(404).send({
        success: false,
        message: "No Existing user",
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}
