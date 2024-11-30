'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Course {
  id: string
  title: string
  description: string
  price: number
  stripeProductId: string
}

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/admin/courses')
        if (!res.ok) throw new Error('Failed to fetch courses')
        const data = await res.json()
        setCourses(data.courses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return <div>Loading courses...</div>
  }

  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div 
          key={course.id} 
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Price: ${course.price} | ID: {course.id}
              </p>
              <p className="text-sm text-gray-500">
                Stripe Product: {course.stripeProductId}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => router.push(`/courses/${course.id}`)}
                className="text-green-500 hover:text-green-600 text-sm"
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 