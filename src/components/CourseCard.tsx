/******************************************************************************
                                IMPORTS
******************************************************************************/
'use client'
import { PurchaseButton } from './PurchaseButton'

/******************************************************************************
                                TYPES
******************************************************************************/
interface CourseCardProps {
  id: string
  title: string
  description: string
  image: string
  price: number
  isUnlocked: boolean
  onClick: () => void
}

/******************************************************************************
                              COMPONENT
******************************************************************************/
export function CourseCard({ id, title, description, image, price, isUnlocked, onClick }: CourseCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div onClick={onClick} className="cursor-pointer">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
      </div>
      <div className="p-4 border-t">
        <PurchaseButton
          courseId={id}
          courseTitle={title}
          price={price}
          isUnlocked={isUnlocked}
        />
      </div>
    </div>
  )
}