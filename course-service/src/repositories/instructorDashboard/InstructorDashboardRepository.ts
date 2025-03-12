import { Types } from "mongoose";
import { IInstructorDashboardRepository } from "../interfaces/IInstructorDashboardRepository";
import { InstructorDashboardData } from "../../Types/updateRequestType";
import { CourseModel } from "../../models/courseModel";
import { PurchasedCourseModel } from "../../models/purchasedModel";
import { ReviewModel } from "../../models/reviewModel";
import UserModel from "../../models/userModel";
import { ChapterModel } from "../../models/chapterModel";
import { CourseErrorMessages } from "@/utils/constants";

export class InstructorDashboardRepository
  implements IInstructorDashboardRepository
{
  async getInstructorDashboardData(
    instructorId: string
  ): Promise<InstructorDashboardData> {
    try {
      // Collect all data in parallel
      const [
        courseAnalytics,
        revenueStats,
        studentGrowth,
        coursePerformance,
        upcomingAppointments,
      ] = await Promise.all([
        this.getCourseAnalytics(instructorId),
        this.getRevenueStats(instructorId),
        this.getStudentGrowth(instructorId),
        this.getCoursePerformance(instructorId),
        this.getUpcomingAppointments(instructorId),
      ]);

      // Structure the dashboard data
      const dashboardData: InstructorDashboardData = {
        statistics: {
          totalStudents: courseAnalytics.totalStudents,
          totalCourses: courseAnalytics.totalCourses,
          totalRevenue: revenueStats.totalRevenue,
          totalAppointments: 12, // Mock data - replace with real data
          appointmentRevenue: revenueStats.appointmentRevenue || 840, // Mock data - replace with real data
          totalCertificatesIssued: courseAnalytics.totalCompletions || 178, // Mock data - replace with real data
        },
        revenueData: revenueStats.monthlyRevenue,
        studentGrowthData: studentGrowth.monthlyGrowth,
        revenueBreakdownData: [
          { name: "Course Sales", value: revenueStats.courseRevenue || 3410 },
          {
            name: "Appointments",
            value: revenueStats.appointmentRevenue || 840,
          },
        ],
        coursePerformance: coursePerformance,
        upcomingAppointments: upcomingAppointments,
      };

      return dashboardData;
    } catch (error) {
     
      throw error;
    }
  }

  async getCourseAnalytics(instructorId: string): Promise<any> {
    try {
      // Get all courses by instructor
      const courses = await CourseModel.find({
        mentorId: new Types.ObjectId(instructorId),
      });

      // Get total students count (unique users who purchased any course)
      const purchasedCourses = await PurchasedCourseModel.find({
        instructorId: new Types.ObjectId(instructorId),
      });

      // Get unique student IDs
      const uniqueStudentIds = [
        ...new Set(purchasedCourses.map((course) => course.userId.toString())),
      ];

      // Get course completion count (total completed courses)
      const completedCourses = purchasedCourses.filter(
        (course) => course.isCourseCompleted
      ).length;

      return {
        totalCourses: courses.length,
        totalStudents: uniqueStudentIds.length,
        totalCompletions: completedCourses,
      };
    } catch (error) {
      
      throw error;
    }
  }

  async getRevenueStats(instructorId: string): Promise<any> {
    try {
      const purchasedCourses = await PurchasedCourseModel.find({
        instructorId: new Types.ObjectId(instructorId),
      });
      const totalRevenue = purchasedCourses.reduce(
        (sum, course) => sum + (course.price || 0),
        0
      );
      const courseRevenue = totalRevenue;

      const today = new Date();
      const monthlyRevenue = [];

      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthEnd = new Date(
          today.getFullYear(),
          today.getMonth() - i + 1,
          0
        );

        const monthPurchases = purchasedCourses.filter((course) => {
          const purchaseDate = new Date(course.purchasedAt);
          return purchaseDate >= month && purchaseDate <= monthEnd;
        });

        const monthRevenue = monthPurchases.reduce(
          (sum, course) => sum + (course.price || 0),
          0
        );

        monthlyRevenue.push({
          name: month.toLocaleString("default", { month: "short" }),
          value: monthRevenue,
        });
      }

      return {
        totalRevenue,
        courseRevenue,
        appointmentRevenue: 840,
        monthlyRevenue,
      };
    } catch (error) {
      console.error("Error in getRevenueStats:", error);
      throw error;
    }
  }

  async getStudentGrowth(instructorId: string): Promise<any> {
    try {
      const purchasedCourses = await PurchasedCourseModel.find({
        instructorId: new Types.ObjectId(instructorId),
      });

      // Generate monthly student growth data for the last 6 months
      const today = new Date();
      const monthlyGrowth = [];
      let runningTotal = 0;

      for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthEnd = new Date(
          today.getFullYear(),
          today.getMonth() - i + 1,
          0
        );

        const monthPurchases = purchasedCourses.filter((course) => {
          const purchaseDate = new Date(course.purchasedAt);
          return purchaseDate >= month && purchaseDate <= monthEnd;
        });

        // Get unique student IDs for this month
        const uniqueStudentIds = [
          ...new Set(monthPurchases.map((course) => course.userId.toString())),
        ];

        // Add to monthly data (cumulative growth)
        runningTotal += uniqueStudentIds.length;

        monthlyGrowth.push({
          name: month.toLocaleString("default", { month: "short" }),
          value: runningTotal,
        });
      }

      return {
        monthlyGrowth,
      };
    } catch (error) {
      
      throw error;
    }
  }

  async getCoursePerformance(instructorId: string): Promise<any> {
    try {
      const courses = await CourseModel.find({
        mentorId: new Types.ObjectId(instructorId),
      });

      const coursePerformance = [];

      for (const course of courses) {
        if (!course._id) {
          throw new Error(CourseErrorMessages.COURSE_NOT_FOUND);
        }
        const purchasedEntries = await PurchasedCourseModel.find({
          courseId: course._id,
        });

        // Get course reviews
        const reviews = await ReviewModel.find({
          courseId: course._id,
        });

        // Calculate average rating
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        const totalRevenue = purchasedEntries.reduce(
          (sum, entry) => sum + (entry.price || 0),
          0
        );

        coursePerformance.push({
          id: course?._id.toString(),
          title: course.courseName,
          price: course.price,
          students: purchasedEntries.length,
          rating: parseFloat(avgRating.toFixed(1)),
          totalRevenue: totalRevenue,
          publishedDate: course.createdAt.toISOString().split("T")[0],
        });
      }

      return coursePerformance.sort((a, b) => b.students - a.students);
    } catch (error) {
      
      throw error;
    }
  }

  async getUpcomingAppointments(instructorId: string): Promise<any> {
    try {
      const upcomingAppointments = [
        {
          id: "1",
          date: "2025-03-05",
          startTime: "10:00",
          endTime: "11:00",
          price: 60,
          isBooked: true,
          studentName: "John Doe",
          studentId: "std123",
        },
        {
          id: "3",
          date: "2025-03-06",
          startTime: "11:00",
          endTime: "12:00",
          price: 70,
          isBooked: true,
          studentName: "Jane Smith",
          studentId: "std456",
        },
      ];

      return upcomingAppointments;
    } catch (error) {
      
      throw error;
    }
  }
}
