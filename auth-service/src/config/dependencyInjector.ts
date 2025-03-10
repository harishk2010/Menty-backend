import IInstructorControllers from "../services/interfaces/IInstructorController";
import { InstructorController } from "../controllers/instructorController";
import IInstructorServices from "../services/interfaces/IIntstuctorServices";
import { InstructorServices } from "../services/instructorServices";
import { IInstructorRepository } from "../repositories/interfaces/IInstructorRepository";
import { InstructorRepository } from "../repositories/instructorRepository";

import { IStudentRepository } from "../repositories/interfaces/IStudentRepository";
import { StudentRepository } from "../repositories/studentRepository";
import IStudentServices from "../services/interfaces/IStudentServices";
import { StudentServices } from "../services/studentServices";
import IStudentControllers from "../controllers/interfaces/IStudentControllers";
import { StudentController } from "../controllers/studentController";

import { OtpRespository } from "../repositories/otpRespository";
import IOtpRepository from "../repositories/interfaces/IOtpRespoitory";

import { OtpService } from "../services/otpService";
import IOtpServices from "../services/interfaces/IOtpService";
import { IAdminControllers } from "../controllers/interfaces/IAdminControllers";
import { AdminController } from "../controllers/adminController";
import IAdminService from "../services/interfaces/IAdminService";
import { AdminService } from "../services/adminService";
import IAdminRepository from "../repositories/interfaces/IAdminRepository";
import { AdminRepository } from "../repositories/adminRepository";

const otpRespository: IOtpRepository = new OtpRespository();
const otpService: IOtpServices = new OtpService(otpRespository);

const instructorRepository: IInstructorRepository = new InstructorRepository();
const instructorService: IInstructorServices = new InstructorServices(
  instructorRepository
);
const instructorController: IInstructorControllers = new InstructorController(
  instructorService,
  otpService
);

const studentRepository: IStudentRepository = new StudentRepository();
const studentService: IStudentServices = new StudentServices(studentRepository);
const studentController: IStudentControllers = new StudentController(
  studentService,
  otpService
);

//admin
const adminRepository: IAdminRepository = new AdminRepository();
const adminService: IAdminService = new AdminService(adminRepository);
const adminController: IAdminControllers = new AdminController(adminService);

export { instructorController, studentController, adminController };
