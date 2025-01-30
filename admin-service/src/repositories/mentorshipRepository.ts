import { updateRequestType } from "../Types/updateRequestType";
import { IMentorshipBaseRepository } from "./baseRepository/IMentorshipBaseRepository";
import { MentorshipBaseRepository } from "./baseRepository/mentorshipBaseRepository";
import { IMentorshipRepository } from "./IMentorshipRepository";

export class MentorshipRepository implements IMentorshipRepository {
    private mentorshipBaseRepository:IMentorshipBaseRepository
    constructor(mentorshipBaseRepository:IMentorshipBaseRepository){
        this.mentorshipBaseRepository=mentorshipBaseRepository
    }

}