import { IVerificationService } from "../services/IVerificationService"
import { IVerificationControllers } from "../controllers/IVerificationControllers"
import { VerificationContoller } from "../controllers/verificationControllers"
import { VerificationService } from "../services/verificationService"
import { IVerificationRepository } from "../repositories/IVerificationRepository"
import { VerificationRepository } from "../repositories/verificationRepository"
import { IVerificationBaseRepository } from "../repositories/baseRepository/IVerificationBaseRepository"
import { VerificationBaseRepository } from "../repositories/baseRepository/verificationBaseRepository"


const verificationBaseRepository:IVerificationBaseRepository=new VerificationBaseRepository()
const verificationRepository:IVerificationRepository=new VerificationRepository(verificationBaseRepository)
const verificationService:IVerificationService=new VerificationService(verificationRepository)
const  verificationController:IVerificationControllers=new VerificationContoller(verificationService)

export { verificationController}