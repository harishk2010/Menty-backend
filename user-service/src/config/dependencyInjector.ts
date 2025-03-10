import { IVerificationService } from "../services/interfaces/IVerificationService";
import { IVerificationControllers } from "../controllers/interfaces/IVerificationControllers";
import { VerificationContoller } from "../controllers/verification/controllers/verificationControllers";
import { VerificationService } from "../services/verification/verificationService";
import { IVerificationRepository } from "../repostories/interfaces/IVerificationRepository";
import { VerificationRepository } from "../repostories/verification/verificationRepository";

import { IInstructorControllers } from "../controllers/interfaces/IInstructorController";
import { InstructorController } from "../controllers/instructor/instructorController";
import { IInstructorService } from "../services/interfaces/IInstructorService";
import { InstructorServices } from "../services/instructor/instructorServices";
import { IInstructorRepository } from "../repostories/interfaces/IInstructorRepository";
import { InstructorRepository } from "../repostories/instructor/instructorRepository";

import { IStudentRepository } from "../repostories/interfaces/IStudentRepository";
import { StudentRepository } from "../repostories/student/studentRepository";
import { IStudentService } from "../services/interfaces/IStudentService";
import { StudentServices } from "../services/student/studentServices";
import { IStudentControllers } from "../controllers/interfaces/IStudentController";
import { StudentController } from "../controllers/student/studentController";
import { MentorReviewRepository } from "../repostories/mentorReview/MentorReviewRepository";
import { MentorReviewService } from "../services/mentorReview/MentorReviewService";
import { MentorReviewController } from "../controllers/mentorReview/MentorReviewController";
import { IMentorReviewRepository } from "../repostories/interfaces/IMentorReviewRepository";
import { IMentorReviewService } from "../services/interfaces/IMentorReviewService";
import { IMentorReviewController } from "../controllers/interfaces/IMentorReviewController";
import { IAdminDashboardRepository } from "../repostories/interfaces/IAdminDashboardRepository";
import { AdminDashboardRepository } from "../repostories/adminDashboard/AdminDashboardRepository";
import { IAdminDashboardService } from "../services/interfaces/IAdminDashboardService";
import { AdminDashboardService } from "../services/adminDashboard/AdminDashboardService";
import { IAdminDashboardController } from "../controllers/interfaces/IAdminDashboardController";
import { AdminDashboardController } from "../controllers/adminDashboard/AdminDashboardController";

const verificationRepository: IVerificationRepository =
  new VerificationRepository();
const verificationService: IVerificationService = new VerificationService(
  verificationRepository
);
const verificationController: IVerificationControllers =
  new VerificationContoller(verificationService);

const instructorRepository: IInstructorRepository = new InstructorRepository();
const instructorService: IInstructorService = new InstructorServices(
  instructorRepository
);
const instructorController: IInstructorControllers = new InstructorController(
  instructorService
);

const studentRepository: IStudentRepository = new StudentRepository();
const studentService: IStudentService = new StudentServices(studentRepository);
const studentController: IStudentControllers = new StudentController(
  studentService
);

const mentorReviewRepository: IMentorReviewRepository =
  new MentorReviewRepository();
const mentorReviewService: IMentorReviewService = new MentorReviewService(
  mentorReviewRepository
);
const mentorReviewController: IMentorReviewController =
  new MentorReviewController(mentorReviewService);

const adminDashboardRepository: IAdminDashboardRepository =
  new AdminDashboardRepository();
const adminDashboardService: IAdminDashboardService = new AdminDashboardService(
  adminDashboardRepository
);
const adminDashboardController: IAdminDashboardController =
  new AdminDashboardController(adminDashboardService);

export {
  verificationController,
  instructorController,
  studentController,
  mentorReviewController,
  adminDashboardController,
};
