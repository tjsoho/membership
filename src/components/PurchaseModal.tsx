'use client'
import { PurchaseButton } from './PurchaseButton'

interface PurchaseModalProps {
  course: {
    id: string
    title: string
    description: string
    price: number
  }
}

export function PurchaseModal({ course }: PurchaseModalProps) {
  return (
    <div className="max-w-2xl mx-auto text-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Access Required</h2>
        
        <p className="text-gray-600 mb-6">
          To access {course.title}, you need to purchase this course.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">What you'll get:</h3>
          <ul className="text-left list-disc pl-6 mb-4">
            <li>Full access to all course materials</li>
            <li>Lifetime updates</li>
            <li>Practical exercises and examples</li>
            <li>Comprehensive marketing strategies</li>
          </ul>
        </div>

        <PurchaseButton
          courseId={course.id}
          courseTitle={course.title}
          price={course.price}
          isUnlocked={false}
        />
      </div>
    </div>
  )
} 