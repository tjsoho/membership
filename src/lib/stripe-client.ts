import { loadStripe } from '@stripe/stripe-js'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
console.log('Stripe Key:', publishableKey)

if (!publishableKey) {
  console.error('Stripe publishable key is missing')
  throw new Error('Missing Stripe publishable key')
}

export const stripePromise = loadStripe(publishableKey) 