'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateCourseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          id: formData.get('id'),
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

      router.refresh()
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error creating course:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
          URL ID
        </label>
        <input
          type="text"
          name="id"
          id="id"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="perfect-homepage"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          name="image"
          id="image"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="/courses/perfect-homepage.jpg"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price (USD)
        </label>
        <input
          type="number"
          name="price"
          id="price"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="stripeProductId" className="block text-sm font-medium text-gray-700">
          Stripe Product ID
        </label>
        <input
          type="text"
          name="stripeProductId"
          id="stripeProductId"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="prod_..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  )
} 