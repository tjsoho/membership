/******************************************************************************
                                IMPORTS
******************************************************************************/
import { prisma } from "@/lib/db/prisma";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CoursesGrid } from "@/components/CoursesGrid";
import { Navbar } from "@/components/Navbar";

/******************************************************************************
                              INTERFACES
******************************************************************************/
// Define the type for the course from Prisma query
interface CourseWithPurchases {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  purchases: {
    userId: string;
  }[];
}

// Define the type for the transformed course
interface CourseWithUnlockStatus {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  isUnlocked: boolean;
}

/******************************************************************************
                              COMPONENT
******************************************************************************/
export default async function DashboardPage() {
  const session = await getAuthSession();

  // Protect the route - redirect to login if no session
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch user's courses (now we know we have a session)
  const courses = (await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      price: true,
      purchases: {
        where: {
          userId: session.user.id,
        },
      },
    },
  })) as CourseWithPurchases[];

  const coursesWithPurchaseStatus: CourseWithUnlockStatus[] = courses.map(
    (course) => ({
      ...course,
      isUnlocked: course.purchases.length > 0,
    })
  );

/******************************************************************************
   *                            RENDER
******************************************************************************/
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Hello, {session.user.name || "Guest"}
        </h1>
        <CoursesGrid courses={coursesWithPurchaseStatus} />
      </div>
    </>
  );
}
