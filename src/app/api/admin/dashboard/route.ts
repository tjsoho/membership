import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Basic counts
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalPurchases = await prisma.purchase.count();

    // Get all purchases with course prices for revenue calculations
    const purchases = await prisma.purchase.findMany({
      include: {
        course: {
          select: {
            price: true,
          },
        },
      },
    });

    // Calculate revenue stats
    const totalRevenue = purchases.reduce(
      (sum, purchase) => sum + purchase.course.price,
      0
    );

    const now = new Date();
    const dayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const yearlyRevenue = purchases
      .filter(p => new Date(p.createdAt) >= yearStart)
      .reduce((sum, purchase) => sum + purchase.course.price, 0);

    const monthlyRevenue = purchases
      .filter(p => new Date(p.createdAt) >= monthStart)
      .reduce((sum, purchase) => sum + purchase.course.price, 0);

    const weeklyRevenue = purchases
      .filter(p => new Date(p.createdAt) >= weekStart)
      .reduce((sum, purchase) => sum + purchase.course.price, 0);

    const dailyRevenue = purchases
      .filter(p => new Date(p.createdAt) >= dayStart)
      .reduce((sum, purchase) => sum + purchase.course.price, 0);

    // Course statistics
    const courseStats = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        courseAccess: true,
        purchases: true,
      },
    });

    // Recent purchases
    const recentPurchases = await prisma.purchase.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        course: {
          select: {
            title: true,
            price: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Format and return the data
    const formattedStats = {
      totalUsers,
      totalCourses,
      totalPurchases,
      revenueStats: {
        totalRevenue,
        yearlyRevenue,
        monthlyRevenue,
        weeklyRevenue,
        dailyRevenue,
      },
      userStats: {
        totalActive: totalUsers, // For now, counting all users as active
        newThisMonth: await prisma.user.count({
          where: {
            createdAt: {
              gte: monthStart,
            },
          },
        }),
        averageCoursesPerUser: totalUsers > 0 ? totalPurchases / totalUsers : 0,
      },
      courseStats: courseStats.map((course) => ({
        id: course.id,
        title: course.title,
        enrolledUsers: course.courseAccess.length,
        revenue: course.price * course.purchases.length,
      })),
      popularCourses: courseStats.map((course) => ({
        id: course.id,
        title: course.title,
        purchaseRate: totalUsers > 0 ? course.purchases.length / totalUsers : 0,
        completionRate: course.purchases.length > 0 
          ? course.courseAccess.length / course.purchases.length 
          : 0,
      })),
      recentPurchases: recentPurchases.map((purchase) => ({
        id: purchase.id,
        courseTitle: purchase.course.title,
        userEmail: purchase.user.email,
        purchaseDate: purchase.createdAt.toISOString(),
        amount: purchase.course.price,
      })),
    };

    return NextResponse.json(formattedStats);
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
} 