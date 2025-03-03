import { IVerificationService } from "../interfaces/IVerificationService"
import { IVerificationControllers } from "../interfaces/IVerificationControllers"
import { VerificationContoller } from "../controllers/verification/controllers/verificationControllers"
import { VerificationService } from "../services/verification/verificationService"
import { IVerificationRepository } from "../interfaces/IVerificationRepository"
import { VerificationRepository } from "../repostories/verification/verificationRepository"

import { IInstructorControllers } from "../interfaces/IInstructorController"
import { InstructorController } from "../controllers/instructor/instructorController"
import { IInstructorService } from "../interfaces/IInstructorService"
import { InstructorServices } from "../services/instructor/instructorServices"
import { IInstructorRepository } from "../interfaces/IInstructorRepository"
import { InstructorRepository } from "../repostories/instructor/instructorRepository"

import { IStudentRepository } from "../interfaces/IStudentRepository"
import { StudentRepository } from "../repostories/student/studentRepository"
import { IStudentService } from "../interfaces/IStudentService"
import { StudentServices } from "../services/student/studentServices"
import { IStudentControllers } from "../interfaces/IStudentController"
import { StudentController } from "../controllers/student/studentController"
import { GenericRepository } from "../repostories/GenericRepository"

const verificationRepository:IVerificationRepository=new VerificationRepository()
const verificationService:IVerificationService=new VerificationService(verificationRepository)
const  verificationController:IVerificationControllers=new VerificationContoller(verificationService)

const instructorRepository:IInstructorRepository=new InstructorRepository()
const instructorService:IInstructorService=new InstructorServices(instructorRepository)
const instructorController:IInstructorControllers=new InstructorController(instructorService)

// const genericRepository=new GenericRepository()
const studentRepository:IStudentRepository = new StudentRepository();
const studentService:IStudentService = new StudentServices(studentRepository);
const studentController:IStudentControllers = new StudentController(studentService);
export { verificationController,instructorController,studentController}