import { IVerificationService } from "../services/verification/IVerificationService"
import { IVerificationControllers } from "../controllers/verification/controllers/IVerificationControllers"
import { VerificationContoller } from "../controllers/verification/controllers/verificationControllers"
import { VerificationService } from "../services/verification/verificationService"
import { IVerificationRepository } from "../repostories/verification/IVerificationRepository"
import { VerificationRepository } from "../repostories/verification/verificationRepository"
import { IVerificationBaseRepository } from "../repostories/baseRepository/verification/IVerificationBaseRepository"
import { VerificationBaseRepository } from "../repostories/baseRepository/verification/verificationBaseRepository"
import { IInstructorControllers } from "../controllers/instructor/IInstructorController"
import { InstructorController } from "../controllers/instructor/instructorController"
import { IInstructorService } from "../services/instructor/IInstructorService"
import { InstructorServices } from "../services/instructor/instructorServices"
import { IInstructorRepository } from "../repostories/instructor/IInstructorRepository"
import { InstructorRepository } from "../repostories/instructor/instructorRepository"
import { IInstructorBaseRepository } from "../repostories/baseRepository/instructor/IInstructorBaseRepository"
import { InstructorBaseRepository } from "../repostories/baseRepository/instructor/instructorBaseRepository"
import { IStudentBaseRepository } from "../repostories/baseRepository/student/IStudentBaseRepository"
import { StudentBaseRepository } from "../repostories/baseRepository/student/studentBaseRepository"
import { IStudentRepository } from "../repostories/student/IStudentRepository"
import { StudentRepository } from "../repostories/student/studentRepository"
import { IStudentService } from "../services/student/IStudentService"
import { StudentServices } from "../services/student/studentServices"
import { IStudentControllers } from "../controllers/student/IStudentController"
import { StudentController } from "../controllers/student/studentController"

const verificationBaseRepository:IVerificationBaseRepository=new VerificationBaseRepository()
const verificationRepository:IVerificationRepository=new VerificationRepository(verificationBaseRepository)
const verificationService:IVerificationService=new VerificationService(verificationRepository)
const  verificationController:IVerificationControllers=new VerificationContoller(verificationService)

const instructorBaseRepository:IInstructorBaseRepository=new InstructorBaseRepository()
const instructorRepository:IInstructorRepository=new InstructorRepository(instructorBaseRepository)
const instructorService:IInstructorService=new InstructorServices(instructorRepository)
const instructorController:IInstructorControllers=new InstructorController(instructorService)


const studentBaseRepository:IStudentBaseRepository=new StudentBaseRepository()
const studentRepository:IStudentRepository=new StudentRepository(studentBaseRepository)
const studentService:IStudentService=new StudentServices(studentRepository)
const studentController:IStudentControllers=new StudentController(studentService)

export { verificationController,instructorController,studentController}