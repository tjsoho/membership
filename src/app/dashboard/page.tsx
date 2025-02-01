/******************************************************************************
                                IMPORTS
******************************************************************************/
import { prisma } from "@/lib/db/prisma";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CoursesGrid } from "@/components/CoursesGrid";
import { Navbar } from "@/components/Navbar";
import { ConsultationCard } from "@/components/ConsultationCard";

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
  highlights: string[];
  whatYouWillLearn: string[];
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
const consultationProducts = [
  {
    id: "prod_consultation_strategy",
    title: "1:1 Business Strategy Session",
    description: `Get personalized guidance to accelerate your business growth. In this 60-minute strategy session, we'll:

    • Analyze your current business challenges
    • Develop actionable AI implementation strategies
    • Create a roadmap for scaling your operations
    • Identify key opportunities for automation
    
    Book your session now to transform your business with AI-powered solutions.`,
    image: "/images/stratSesh2.jpg",
    successImage: "/images/stratSesh.png",
    price: 299,
    calendlyUrl:
      "https://calendly.com/sloane-bookings/business-strategy-session-savvy-business-hub",
  },
  // Add your second product here
];

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
      highlights: true,
      whatYouWillLearn: true,
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

        {/* Consultation section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-coastal-dark-teal mb-6">
            1:1 Strategy Sessions
          </h2>
          <div className="flex justify-start">
            <div className="max-w-md w-full">
              {consultationProducts.map((product) => (
                <ConsultationCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
