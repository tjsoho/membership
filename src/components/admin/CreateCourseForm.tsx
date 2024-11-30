'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CreateCourseFormProps {
  course?: {
    id: string
    title: string
    description: string
    image: string
    price: number
    stripeProductId: string
  }
  onCancel?: () => void
}

export function CreateCourseForm({ course, onCancel }: CreateCourseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    id: course?.id || '',
    title: course?.title || '',
    description: course?.description || '',
    image: course?.image || '',
    price: course?.price?.toString() || '',
    stripeProductId: course?.stripeProductId || ''
  })

  const isEditing = !!course

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const courseId = formData.get('id') as string
    
    try {
      const endpoint = isEditing 
        ? `/api/admin/courses/${course.id}`
        : '/api/admin/courses'

      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          id: courseId,
          title: formData.get('title'),
          description: formData.get('description'),
          image: formData.get('image'),
          price: Number(formData.get('price')),
          stripeProductId: formData.get('stripeProductId'),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error('Failed to create course')

      if (!isEditing) {
        // Show guidance only for new courses
        const componentName = courseId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('')
        
        const guidance = `
          Next steps:
          1. Create a new file: src/app/courses/${courseId}/page.tsx
          2. Create the component: export default function ${componentName}() { ... }
          3. Add your course content
        `
        alert(`Course ${isEditing ? 'updated' : 'created'} successfully!\n\n${!isEditing ? guidance : ''}`)
      }
      
      router.refresh()
      if (!isEditing) {
        e.currentTarget.reset()
      }
      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      console.error('Error saving course:', error)
      setError(`Failed to ${isEditing ? 'update' : 'create'} course. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-coastal-ocean mb-1">
            URL Path
          </label>
          <input
            type="text"
            name="id"
            id="id"
            required
            value={formData.id}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20 
              placeholder:text-coastal-ocean/40"
            placeholder="perfect-home-page"
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens are allowed"
          />
          <p className="mt-1 text-sm text-coastal-ocean/60">
            This will create a route at /courses/your-path
          </p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-coastal-ocean mb-1">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-coastal-ocean mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20 resize-none"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-coastal-ocean mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            id="image"
            required
            value={formData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
            placeholder="/courses/perfect-homepage.jpg"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-coastal-ocean mb-1">
            Price (USD)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
          />
        </div>

        <div>
          <label htmlFor="stripeProductId" className="block text-sm font-medium text-coastal-ocean mb-1">
            Stripe Product ID
          </label>
          <input
            type="text"
            name="stripeProductId"
            id="stripeProductId"
            required
            value={formData.stripeProductId}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
            placeholder="prod_..."
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coastal-ocean text-white px-6 py-3 rounded-lg 
            hover:bg-coastal-oceanLight disabled:opacity-50 transition-colors
            font-medium shadow-sm"
        >
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Course' : 'Create Course')}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-2 w-full bg-coastal-sand/20 text-coastal-ocean px-6 py-3 rounded-lg 
              hover:bg-coastal-sand/30 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Preview Card */}
      <div className="lg:sticky lg:top-6">
        <h3 className="text-lg font-medium text-coastal-ocean mb-4">Preview</h3>
        <div className="bg-white rounded-2xl shadow-lg border-2 border-coastal-sand overflow-hidden">
          {formData.image ? (
            <div className="relative aspect-video">
              <Image
                src={formData.image}
                alt={formData.title || 'Course preview'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-coastal-sand/20 flex items-center justify-center">
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
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-coastal-ocean mb-2">
              {formData.title || 'Course Title'}
            </h3>
            <p className="text-coastal-ocean/70 mb-4">
              {formData.description || 'Course description will appear here...'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-coastal-teal">
                {formData.price ? `$${formData.price}` : '$0'}
              </span>
              <button 
                className="bg-coastal-ocean text-white px-4 py-2 rounded-lg 
                  hover:bg-coastal-oceanLight transition-colors text-sm font-medium"
                disabled
              >
                Preview Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 