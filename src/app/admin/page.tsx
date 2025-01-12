"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalPurchases: number;
  courseStats: {
    id: string;
    title: string;
    enrolledUsers: number;
    revenue: number;
  }[];
  recentPurchases: {
    id: string;
    courseTitle: string;
    userEmail: string;
    purchaseDate: string;
    amount: number;
  }[];
  revenueStats: {
    totalRevenue: number;
    yearlyRevenue: number;
    monthlyRevenue: number;
    weeklyRevenue: number;
    dailyRevenue: number;
  };
  userStats: {
    totalActive: number;
    newThisMonth: number;
    averageCoursesPerUser: number;
  };
  popularCourses: {
    id: string;
    title: string;
    purchaseRate: number;
    completionRate: number;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard");
        console.log("API Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch stats");
        }

        const data = await res.json();
        console.log("Fetched dashboard data:", data);
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-coastal-light-grey p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-coastal-light-grey p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-coastal-dark-teal">
          Admin Dashboard
        </h1>
        {/* Revenue Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-coastal-dark-teal mb-4">
            Revenue Overview
          </h2>
          <div className="flex w-full justify-between pr-4">
            <div>
              <h3 className="text-sm text-coastal-dark-grey">Total Revenue</h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                ${stats?.revenueStats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-coastal-dark-grey">Yearly Revenue</h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                ${stats?.revenueStats.yearlyRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-coastal-dark-grey">
                Monthly Revenue
              </h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                ${stats?.revenueStats.monthlyRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-coastal-dark-grey">Weekly Revenue</h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                ${stats?.revenueStats.weeklyRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-coastal-dark-grey">Daily Revenue</h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                ${stats?.revenueStats.dailyRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-coastal-dark-grey mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-coastal-dark-teal">
              {stats?.totalUsers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-coastal-dark-grey mb-2">
              Total Courses
            </h3>
            <p className="text-3xl font-bold text-coastal-dark-teal">
              {stats?.totalCourses || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-coastal-dark-grey mb-2">
              Total Purchases
            </h3>
            <p className="text-3xl font-bold text-coastal-dark-teal">
              {stats?.totalPurchases || 0}
            </p>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-coastal-dark-teal mb-4">
            Course Statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-coastal-sand">
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-right py-3 px-4">Enrolled Users</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats?.courseStats.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-coastal-sand/50 hover:bg-coastal-light-grey/10"
                  >
                    <td className="py-3 px-4">{course.title}</td>
                    <td className="text-right py-3 px-4">
                      {course.enrolledUsers}
                    </td>
                    <td className="text-right py-3 px-4">
                      ${course.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-coastal-dark-teal mb-4">
            Recent Purchases
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-coastal-sand">
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-coastal-sand/50 hover:bg-coastal-light-grey/10"
                  >
                    <td className="py-3 px-4">{purchase.courseTitle}</td>
                    <td className="py-3 px-4">{purchase.userEmail}</td>
                    <td className="text-right py-3 px-4">
                      ${purchase.amount.toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-coastal-dark-teal mb-4">
            User Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-coastal-dark-grey">Active Users</h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                {stats?.userStats.totalActive}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-coastal-dark-grey">
                New Users This Month
              </h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                {stats?.userStats.newThisMonth}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-coastal-dark-grey">
                Avg. Courses per User
              </h3>
              <p className="text-2xl font-bold text-coastal-dark-teal">
                {stats?.userStats.averageCoursesPerUser.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-coastal-dark-teal mb-4">
            Course Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-coastal-sand">
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-right py-3 px-4">Purchase Rate</th>
                  <th className="text-right py-3 px-4">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats?.popularCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-coastal-sand/50"
                  >
                    <td className="py-3 px-4">{course.title}</td>
                    <td className="text-right py-3 px-4">
                      {(course.purchaseRate * 100).toFixed(1)}%
                    </td>
                    <td className="text-right py-3 px-4">
                      {(course.completionRate * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push("/admin/courses")}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow
                     border-l-4 border-coastal-dark-teal flex items-center justify-between"
          >
            <span className="font-medium">Manage Courses</span>
            <span className="text-coastal-dark-teal">→</span>
          </button>

          <button
            onClick={() => router.push("/admin/users")}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow
                     border-l-4 border-coastal-ocean flex items-center justify-between"
          >
            <span className="font-medium">Manage Users</span>
            <span className="text-coastal-ocean">→</span>
          </button>

          <button
            onClick={() => router.push("/admin/reports")}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow
                     border-l-4 border-coastal-teal flex items-center justify-between"
          >
            <span className="font-medium">View Reports</span>
            <span className="text-coastal-teal">→</span>
          </button>

          <button
            onClick={() => router.push("/admin/settings")}
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow
                     border-l-4 border-coastal-light-teal flex items-center justify-between"
          >
            <span className="font-medium">Settings</span>
            <span className="text-coastal-light-teal">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
