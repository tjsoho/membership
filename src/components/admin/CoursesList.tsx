'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CreateCourseForm } from './CreateCourseForm'

// Update the Course type to match your schema
interface Course {
  id: string
  title: string
  description: string
  image: string
  price: number
  stripeProductId: string
  createdAt: Date
  updatedAt: Date
}

export function CoursesList({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<Course | null>(null)

  async function handleDelete(courseId: string) {
    if (!confirm('Are you sure you want to delete this course?')) return

    setDeleting(courseId)
    
    try {
      console.log('Attempting to delete course:', courseId)
      
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      console.log('Delete response:', { status: res.status, data })

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to delete course')
      }
      
      console.log('Course deleted successfully')
      router.refresh()
    } catch (error: any) {
      console.error('Detailed delete error:', error)
      alert(`Failed to delete course: ${error.message}`)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>*:has(form)]:sm:col-span-2 [&>*:has(form)]:lg:col-span-3">
      {courses.map((course) => (
        <div key={course.id}>
          {editing?.id === course.id ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-coastal-sand p-6">
              <CreateCourseForm 
                course={course} 
                onCancel={() => setEditing(null)} 
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-coastal-sand overflow-hidden group">
              <div className="relative aspect-video">
                {course.image.startsWith('http') || course.image.startsWith('/') ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-coastal-sand/20 flex items-center justify-center">
                    <svg 
                      className="h-12 w-12 text-coastal-sand" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-coastal-ocean mb-2">
                  {course.title}
                </h3>
                <p className="text-coastal-ocean/70 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-coastal-teal">
                    ${course.price}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing(course)}
                      className="bg-coastal-teal text-white px-4 py-2 rounded-lg 
                        hover:bg-coastal-teal/90 transition-colors text-sm font-medium
                        flex items-center space-x-1"
                    >
                      <svg 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button 
                      onClick={() => handleDelete(course.id)}
                      disabled={deleting === course.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg 
                        hover:bg-red-600 transition-colors text-sm font-medium
                        disabled:opacity-50 flex items-center space-x-1"
                    >
                      {deleting === course.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                            <circle 
                              className="opacity-25" 
                              cx="12" 
                              cy="12" 
                              r="10" 
                              stroke="currentColor" 
                              strokeWidth="4"
                            />
                            <path 
                              className="opacity-75" 
                              fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <svg 
                            className="h-4 w-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                            />
                          </svg>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}