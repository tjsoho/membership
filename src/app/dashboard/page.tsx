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
    type: "consultation" as const,
  },
  {
    id: "prod_sloane",
    title: "Sloane",
    description: `Revolutionize your business with Sloane - your AI-powered business assistant:

    • Automate repetitive tasks
    • Streamline operations
    • Enhance customer interactions
    • Scale your business efficiently

    Discover more about Sloane at <a href="https://www.sloane.biz" target="_blank" rel="noopener noreferrer" class="text-coastal-dark-teal hover:text-coastal-teal">www.sloane.biz</a>
    `,
    image: "/images/banner.png",
    type: "external" as const,
    externalUrl: "https://app.sloane.biz/userform",
  },
  {
    id: "prod_consultation_website",
    title: "Website Consultation",
    description: `Let's optimize your website for maximum impact and conversions. In this focused session, we'll:

    • Review your current website architecture
    • Identify UX/UI improvement opportunities
    • Analyze conversion optimization points
    • Provide actionable recommendations
    
    Book your session to transform your website into a powerful business tool.`,
    image: "/images/toby2.jpg",
    successImage: "/images/toby2.jpg",
    price: 149,
    calendlyUrl: "https://calendly.com/sloane-bookings/website-consultation",
    type: "consultation" as const,
  },
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
          <h2 className="text-4xl font-bold text-coastal-dark-teal mb-4 text-center">
            Work With Me
          </h2>
          {/* add a thin line under the title */}
          <div className="w-16 h-[2px] bg-coastal-dark-teal mx-auto mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {consultationProducts.map((product) => (
              <ConsultationCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
