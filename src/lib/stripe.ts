/******************************************************************************
                                IMPORTS
******************************************************************************/
import Stripe from 'stripe'

/******************************************************************************
                            ERROR HANDLING
******************************************************************************/
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

/******************************************************************************
                            STRIPE CLIENT
******************************************************************************/
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
}) 