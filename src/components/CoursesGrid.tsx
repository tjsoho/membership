/******************************************************************************
                                IMPORTS
******************************************************************************/
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PurchaseModal } from "./PurchaseModal";

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

  const handleCourseClick = (course: Course) => {
    if (course.isUnlocked) {
      router.push(`/courses/${course.id}`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleCourseClick(course)}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer 
                     hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-video">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-coastal-dark-teal mb-2">
                {course.title}
              </h3>
              <p className="text-coastal-dark-grey line-clamp-2 mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-coastal-dark-teal">
                  ${course.price}
                </span>
                <span className="text-sm text-coastal-dark-grey">
                  {course.isUnlocked ? "Enrolled" : "Click to learn more"}
                </span>
              </div>
            </div>
          </div>
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
