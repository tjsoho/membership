/******************************************************************************
                                IMPORTS
******************************************************************************/
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PurchaseModal } from "./PurchaseModal";
import { LoadingWave } from "./ui/LoadingWave";
import { CourseCard } from "./CourseCard";

/******************************************************************************
                                TYPES
******************************************************************************/
interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  isUnlocked: boolean;
  highlights?: string[];
  whatYouWillLearn?: string[];
}

interface CoursesGridProps {
  courses: Course[];
}

/******************************************************************************
                              COMPONENT
******************************************************************************/
export function CoursesGrid({ courses }: CoursesGridProps) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCourseClick = async (course: Course) => {
    if (course.isUnlocked) {
      setIsLoading(true);
      try {
        await router.push(`/courses/${course.id}`);
      } catch (error) {
        console.error("Navigation error:", error);
        setIsLoading(false);
      }
    } else {
      setSelectedCourse({
        ...course,
        highlights: course.highlights || [],
        whatYouWillLearn: course.whatYouWillLearn || [],
      });
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingWave size="lg" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            image={course.image}
            price={course.price}
            isUnlocked={course.isUnlocked}
            onClick={() => handleCourseClick(course)}
          />
        ))}
      </div>

      {selectedCourse && (
        <PurchaseModal
          course={{
            id: selectedCourse.id,
            title: selectedCourse.title,
            description: selectedCourse.description,
            price: selectedCourse.price,
            imageUrl: selectedCourse.image,
            highlights: selectedCourse.highlights || [],
            whatYouWillLearn: selectedCourse.whatYouWillLearn || [],
            isOpen: true,
            onClose: () => setSelectedCourse(null),
          }}
        />
      )}
    </>
  );
}
