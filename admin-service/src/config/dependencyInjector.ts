import { IMentorshipService } from "../services/mentorship/IMentorshipService"
import { IMentorshipControllers } from "../controllers/mentorship/IMentorshipControllers"
import { MentorshipContoller } from "../controllers/mentorship/mentorshipControllers"
import { MentorshipService } from "../services/mentorship/mentorshipService"
import { IMentorshipRepository } from ".././repositories/IMentorshipRepository"
import { MentorshipRepository } from ".././repositories/mentorshipRepository"
import { IMentorshipBaseRepository } from ".././repositories/baseRepository/IMentorshipBaseRepository"
import { MentorshipBaseRepository } from ".././repositories/baseRepository/mentorshipBaseRepository"


const mentorshipBaseRepository:IMentorshipBaseRepository=new MentorshipBaseRepository()
const mentorshipRepository:IMentorshipRepository=new MentorshipRepository(mentorshipBaseRepository)
const mentorshipService:IMentorshipService=new MentorshipService(mentorshipRepository)
const  mentorshipController:IMentorshipControllers=new MentorshipContoller(mentorshipService)

export { mentorshipController}