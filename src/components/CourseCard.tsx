'use client'

interface CourseCardProps {
  title: string
  description: string
  image: string
  price: number
  isUnlocked: boolean
  onClick: () => void
}

export function CourseCard({ 
  title, 
  description, 
  image, 
  price, 
  isUnlocked, 
  onClick 
}: CourseCardProps) {
  return (
    <div 
      onClick={onClick}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">
            ${price.toFixed(2)}
          </span>
          <span className={`px-2 py-1 rounded ${
            isUnlocked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isUnlocked ? 'Unlocked' : 'Locked'}
          </span>
        </div>
      </div>
    </div>
  )
} 