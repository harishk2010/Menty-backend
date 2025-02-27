import { ICourse } from "../models/courseModel";

export type updateRequestType = {
  username: string;
  degreeCertificateUrl: string;
  resumeUrl: string;
  status:string
};


export type IBoughtCourses = {
  _id: string;
  courseId: {
    courseName: string;
    level: string;
    thumbnailUrl: string;
    quizId: string;
  };
  completedChapters: string[];
  isCourseCompleted: boolean;
  purchasedAt: string;
};
export interface CoursesResult {
  courses: ICourse[];
  total: number;
}

export type Paginatedcourses={ courses: ICourse[]; currentPage: number; totalPages: number; totalCourses: number }