import { AdminDashboardData } from "../../types/types";
import { IAdminDashboardRepository } from "../interfaces/IAdminDashboardRepository";
import UserModel from "../../models/userModel";
import InstructorModel from "../../models/instructorModel";
import VerificationModel from "../../models/verificationModel";

export class AdminDashboardRepository implements IAdminDashboardRepository {
  async getDashboardData(): Promise<AdminDashboardData | null> {
    try {
      const studentStats = await this.getStudentCount();
      const instructorStats = await this.getInstructorCount();
      const totalRevenue = await this.getTotalRevenue();
      const pendingApplications = await this.getPendingInstructorApplications();
      const monthlyRevenueData = await this.getMonthlyRevenue();
      const topInstructors = await this.getTopInstructors(10);
      const recentStudents = await this.getRecentStudents(10);

      const dashboardData: AdminDashboardData = {
        statistics: {
          totalStudents: {
            count: studentStats.total,
            newThisMonth: studentStats.newThisMonth,
          },
          totalInstructors: {
            count: instructorStats.total,
            newThisMonth: instructorStats.newThisMonth,
            topEarners: instructorStats.topEarners,
          },
          totalRevenue: totalRevenue,
          pendingInstructorApplications: pendingApplications,
        },
        monthlyRevenueData,
        topInstructors,
        recentStudents,
      };

      return dashboardData;
    } catch (error) {
      throw error;
    }
  }

  async getStudentCount(): Promise<{ total: number; newThisMonth: number }> {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const total = await UserModel.countDocuments({ role: "student" });
      const newThisMonth = await UserModel.countDocuments({
        role: "student",
        createdAt: { $gte: firstDayOfMonth },
      });

      return { total, newThisMonth };
    } catch (error) {
      throw error;
    }
  }

  async getInstructorCount(): Promise<{
    total: number;
    newThisMonth: number;
    topEarners: number;
  }> {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const total = await InstructorModel.countDocuments();
      const newThisMonth = await InstructorModel.countDocuments({
        createdAt: { $gte: firstDayOfMonth },
      });

      // Calculate top earners based on wallet balance
      const topEarners = await InstructorModel.countDocuments({
        "wallet.balance": { $gt: 1000 }, // Example threshold for top earners
      });

      return { total, newThisMonth, topEarners };
    } catch (error) {
      throw error;
    }
  }

  async getTotalRevenue(): Promise<number> {
    try {
      const result = await InstructorModel.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.balance" } } },
      ]);

      return result.length > 0 ? result[0].total : 0;
    } catch (error) {
      throw error;
    }
  }

  async getPendingInstructorApplications(): Promise<number> {
    try {
      return await VerificationModel.countDocuments({ status: "pending" });
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyRevenue(): Promise<{ name: string; value: number }[]> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const result = await InstructorModel.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$wallet.balance" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      // Format the result
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return result.map((item) => ({
        name: monthNames[item._id.month - 1],
        value: item.total,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getTopInstructors(limit: number = 5): Promise<any[]> {
    try {
      const topInstructors = await InstructorModel.aggregate([
        {
          $project: {
            username: 1,
            email: 1,
            expertise: 1,
            rating: 1,
            walletBalance: "$wallet.balance",
            totalStudents: { $size: "$wallet.transactions" }, // Example metric for students
          },
        },
        { $sort: { walletBalance: -1 } },
        { $limit: limit },
      ]);

      return topInstructors;
    } catch (error) {
      throw error;
    }
  }

  async getRecentStudents(limit: number = 5): Promise<any[]> {
    try {
      const recentStudents = await UserModel.find({ role: "student" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("username email createdAt studiedHours");

      return recentStudents;
    } catch (error) {
      throw error;
    }
  }
}
