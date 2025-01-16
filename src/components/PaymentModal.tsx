"use client";
import { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Dialog } from "@headlessui/react";
import { stripePromise } from "@/lib/stripe-client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/******************************************************************************
                                TYPES
******************************************************************************/
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  price: number;
  onSuccess: () => void;
}

/******************************************************************************
                              COMPONENTS
******************************************************************************/
export function PaymentModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  price,
  onSuccess,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, price }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [isOpen, courseId, price]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0070f3",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white w-full max-h-[90vh] flex flex-col">
          <Dialog.Title className="text-xl font-semibold mb-4 p-6 border-b">
            Purchase {courseTitle}
          </Dialog.Title>

          <div className="overflow-y-auto flex-1 px-6">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm onSuccess={onSuccess} courseId={courseId} />
              </Elements>
            ) : (
              <div className="text-center py-4">
                <LoadingSpinner size="md" />
                <p className="mt-2 text-coastal-dark-grey">
                  Loading payment form...
                </p>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

/******************************************************************************
                            CHECKOUT FORM
******************************************************************************/
function CheckoutForm({
  onSuccess,
  courseId,
}: {
  onSuccess: () => void;
  courseId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Payment failed");
        setProcessing(false);
        return;
      }

      // Instead of replacing document.body, show loading overlay
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/courses/${courseId}`,
        },
      });

      if (paymentError) {
        setError(paymentError.message ?? "Payment failed");
        setProcessing(false);
      }
    } catch (e) {
      setError("An unexpected error occurred");
      setProcessing(false);
    }
  };

  return (
    <>
      {processing && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[100]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg font-medium text-coastal-dark-teal">
              Processing your purchase...
            </p>
            <p className="mt-2 text-coastal-dark-grey">
              Please don&apos;t close this window
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <PaymentElement />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-coastal-dark-teal text-white px-6 py-3 rounded-lg 
                   hover:bg-coastal-light-teal transition-colors duration-200
                   font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </>
  );
}
