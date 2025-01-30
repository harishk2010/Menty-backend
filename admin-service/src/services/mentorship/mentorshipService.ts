import { IMentorshipRepository } from '../../repositories/IMentorshipRepository'
import {IMentorshipService} from './IMentorshipService'

export class MentorshipService implements IMentorshipService{
    
    private ventorshipRepository:IMentorshipRepository
    constructor(ventorshipRepository:IMentorshipRepository){
        this.ventorshipRepository=ventorshipRepository
    }

}