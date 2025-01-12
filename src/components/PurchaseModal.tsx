'use client'

import { PurchaseButton } from './PurchaseButton'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PurchaseModalProps {
  course: {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string
    highlights: string[]
    whatYouWillLearn: string[]
    isOpen: boolean
    onClose: () => void
  }
}

export function PurchaseModal({ course }: PurchaseModalProps) {
  if (!course.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={course.onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-coastal-dark-teal mb-4">
              {course.title}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {course.description}
            </p>

            {/* What You'll Learn Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-coastal-dark-teal mb-3">
                What you&apos;ll learn:
              </h3>
              <ul className="space-y-2">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-coastal-dark-teal mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-coastal-dark-teal mb-3">
                Course Highlights:
              </h3>
              <ul className="space-y-2">
                {course.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-coastal-dark-teal mr-2">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase Button */}
            <div className="mt-8">
              <PurchaseButton
                courseId={course.id}
                courseTitle={course.title}
                price={course.price}
                isUnlocked={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 