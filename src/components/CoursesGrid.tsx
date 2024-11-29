'use client'

import { CourseCard } from './CourseCard'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  image: string
  price: number
  isUnlocked: boolean
}

interface CoursesGridProps {
  courses: Course[]
}

export function CoursesGrid({ courses }: CoursesGridProps) {
  const router = useRouter()

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          title={course.title}
          description={course.description}
          image={course.image}
          price={course.price}
          isUnlocked={course.isUnlocked}
          onClick={() => handleCourseClick(course.id)}
        />
      ))}
    </div>
  )
} 