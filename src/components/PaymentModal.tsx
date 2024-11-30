'use client'
import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Dialog } from '@headlessui/react'
import { stripePromise } from '@/lib/stripe-client'

/******************************************************************************
                                TYPES
******************************************************************************/
interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
  price: number
}

/******************************************************************************
                              COMPONENTS
******************************************************************************/
export function PaymentModal({ isOpen, onClose, courseId, courseTitle, price }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, price }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
    }
  }, [isOpen, courseId, price])

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0070f3',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Purchase {courseTitle}
          </Dialog.Title>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm onSuccess={onClose} courseId={courseId} />
            </Elements>
          ) : (
            <div className="text-center py-4">Loading payment form...</div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

/******************************************************************************
                            CHECKOUT FORM
******************************************************************************/
function CheckoutForm({ onSuccess, courseId }: { onSuccess: () => void, courseId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message ?? 'Payment failed')
        setProcessing(false)
        return
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/courses/${courseId}`,
        },
      })

      if (paymentError) {
        setError(paymentError.message ?? 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (e) {
      setError('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <PaymentElement />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
} 