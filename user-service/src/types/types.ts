import { IInstructor, ITransaction } from "../models/instructorModel";

export interface IMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export type updateRequestType = {
  username: string;
  degreeCertificateUrl: string;
  resumeUrl: string;
  status: string;
};

export interface TransactionsResult {
  transactions: ITransaction[];
  total: number;
}

export interface SearchOptions {
  q?: string;
  role?: string;
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PaginatedMentors {
  mentors: IInstructor[];
  currentPage: number;
  totalPages: number;
  totalMentors: number;
}

export interface ResetPassword {
  password: string;
  email: string;
}

export interface InstructorUpdateStatus {
  status: string;
  emailID: string;
}

export interface InstructorWallet {
  txnid: string;
  amount: string;
  description: string;
  type: string;
  instructorId: string;
}

// Dashboard Types
export interface AdminStatistics {
  totalStudents: {
    count: number;
    newThisMonth: number;
  };
  totalInstructors: {
    count: number;
    newThisMonth: number;
    topEarners: number;
  };
  totalRevenue: number;
  pendingInstructorApplications: number;
}

export interface InstructorDetail {
  id: string;
  username: string;
  email: string;
  expertise: string;
  walletBalance: number;
  totalStudents: number;
}

export interface StudentDetail {
  id: string;
  username: string;
  email: string;
  studiedHours: number;
  createdAt: string;
}

export interface RevenueDataPoint {
  name: string;
  value: number;
}

export interface AdminDashboardData {
  statistics: AdminStatistics;
  monthlyRevenueData: RevenueDataPoint[];
  topInstructors: InstructorDetail[];
  recentStudents: StudentDetail[];
}
