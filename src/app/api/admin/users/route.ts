import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        purchases: {
          include: {
            course: {
              select: {
                price: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      lastPurchaseDate: user.purchases[0]?.createdAt.toISOString() || null,
      totalPurchaseAmount: user.purchases.reduce(
        (sum, purchase) => sum + purchase.course.price,
        0
      ),
      coursesCount: user.purchases.length,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 