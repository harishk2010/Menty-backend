import { Request, Response } from "express";
import { IMentorshipControllers } from "./IMentorshipControllers";
import { uploadToS3Bucket } from "../../utils/s3Bucket";
import { IMentorshipService } from "../../services/mentorship/IMentorshipService";
import produce from "../../config/kafka/producer";

export class MentorshipContoller implements IMentorshipControllers {
  private mentorshipService: IMentorshipService;

  constructor(mentorshipService: IMentorshipService) {
    this.mentorshipService = mentorshipService;
  }

  
}
