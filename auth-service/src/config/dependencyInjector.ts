import  IInstructorControllers  from "../services/interfaces/IInstructorController"
import { InstructorController } from "../controllers/instructorController"
import  IInstructorServices  from "../services/interfaces/IIntstuctorServices"
import { InstructorServices } from "../services/instructorServices"
import  {IInstructorRepository} from "../repositories/interfaces/IInstructorRepository"
import { InstructorRepository } from "../repositories/instructorRepository"

import { IStudentRepository } from "../repositories/interfaces/IStudentRepository"
import  {StudentRepository}  from "../repositories/studentRepository"
import  IStudentServices  from "../services/interfaces/IStudentServices"
import { StudentServices } from "../services/studentServices"
import  IStudentControllers  from "../controllers/interfaces/IStudentControllers"
import { StudentController } from "../controllers/studentController"

import { OtpRespository } from "../repositories/otpRespository"
import IOtpRepository from "../repositories/interfaces/IOtpRespoitory"

import {  OtpService } from "../services/otpService"
import IOtpServices from "../services/interfaces/IOtpService"
import { IAdminControllers } from "../controllers/interfaces/IAdminControllers"
import { AdminController } from "../controllers/adminController"


// const baseOtpRepository:IOtpBaseRepository=new BaseOtpRepository()
const otpRespository:IOtpRepository=new OtpRespository()
const otpService:IOtpServices=new OtpService(otpRespository)

// const instructorBaseRepository:IInstructorBaseRepository=new InstructorBaseRepository()
const instructorRepository:IInstructorRepository=new InstructorRepository()
const instructorService:IInstructorServices=new InstructorServices(instructorRepository)
const instructorController:IInstructorControllers=new InstructorController(instructorService,otpService)


// const studentBaseRepository:IStudentBaseRepository=new StudentBaseRepository()
const studentRepository:IStudentRepository=new StudentRepository()
const studentService:IStudentServices=new StudentServices(studentRepository)
const studentController:IStudentControllers=new StudentController(studentService,otpService)


const adminController:IAdminControllers=new AdminController()
export { instructorController,studentController ,adminController}