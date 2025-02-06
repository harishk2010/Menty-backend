import { ICourseRepository } from '../../repositories/course/ICourseRepository'
import {ICourseService} from './ICourseService'

export class CourseService implements ICourseService{
    
    private courseRepository:ICourseRepository
    constructor(courseRepository:ICourseRepository){
        this.courseRepository=courseRepository
    }

}