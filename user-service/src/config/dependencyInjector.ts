import { IVerificationService } from "../services/interfaces/IVerificationService"
import { IVerificationControllers } from "../controllers/interfaces/IVerificationControllers"
import { VerificationContoller } from "../controllers/verification/controllers/verificationControllers"
import { VerificationService } from "../services/verification/verificationService"
import { IVerificationRepository } from "../repostories/interfaces/IVerificationRepository"
import { VerificationRepository } from "../repostories/verification/verificationRepository"

import { IInstructorControllers } from "../controllers/interfaces/IInstructorController"
import { InstructorController } from "../controllers/instructor/instructorController"
import { IInstructorService } from "../services/interfaces/IInstructorService"
import { InstructorServices } from "../services/instructor/instructorServices"
import { IInstructorRepository } from "../repostories/interfaces/IInstructorRepository"
import { InstructorRepository } from "../repostories/instructor/instructorRepository"

import { IStudentRepository } from "../repostories/interfaces/IStudentRepository"
import { StudentRepository } from "../repostories/student/studentRepository"
import { IStudentService } from "../services/interfaces/IStudentService"
import { StudentServices } from "../services/student/studentServices"
import { IStudentControllers } from "../controllers/interfaces/IStudentController"
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