// import { updateRequestType } from "../Types/updateRequestType";
import { ICourseBaseRepository } from "../baseRepository/ICourseBaseRepository";
import { CourseBaseRepository } from "../baseRepository/courseBaseRepository";
import { ICourseRepository } from "./ICourseRepository";

export class CourseRepository implements ICourseRepository {
    private courseBaseRepository:ICourseBaseRepository
    constructor(courseBaseRepository:ICourseBaseRepository){
        this.courseBaseRepository=courseBaseRepository
    }

}