import { ICourse } from "../models/courseModel";

export type updateRequestType = {
  username: string;
  degreeCertificateUrl: string;
  resumeUrl: string;
  status: string;
};

export interface InstructorDashboardData {
  statistics: {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    totalAppointments: number;
    appointmentRevenue: number;
    totalCertificatesIssued: number;
  };
  revenueData: {
    name: string;
    value: number;
  }[];
  studentGrowthData: {
    name: string;
    value: number;
  }[];
  revenueBreakdownData: {
    name: string;
    value: number;
  }[];
  coursePerformance: {
    id: string;
    title: string;
    price: number;
    students: number;
    rating: number;
    totalRevenue: number;
    publishedDate: string;
  }[];
  upcomingAppointments: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    isBooked: boolean;
    studentName: string;
    studentId: string;
  }[];
}
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

export type Paginatedcourses = {
  courses: ICourse[];
  currentPage: number;
  totalPages: number;
  totalCourses: number;
};
