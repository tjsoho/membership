"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { InlineWidget } from "react-calendly";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { LoadingWave } from "@/components/ui/LoadingWave";

// Initialize Stripe outside component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Separate payment form component
function PaymentForm({
  onSuccess,
  price,
  title,
  description,
  discountCode,
  setDiscountCode,
  discountError,
  appliedDiscount,
  onApplyDiscount,
  isLoading,
  setIsLoading,
}: {
  onSuccess: () => void;
  price: number;
  title: string;
  description: string;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountError: string;
  appliedDiscount: { code: string; amount: number } | null;
  onApplyDiscount: (code: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Payment failed:", error);
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Left Column - Product Details */}
      <div>
        <div className="mb-6 p-4 bg-coastal-sand/10 rounded-lg">
          <h3 className="font-semibold text-coastal-dark-teal mb-3 text-lg">
            Order Summary
          </h3>
          <div className="space-y-2">
            <div className="flex flex-col text-sm">
              <span className="text-coastal-dark-grey mb-1">Service</span>
              <span className="font-medium">{title}</span>
            </div>
            <div className="mt-4">
              <span className="text-coastal-dark-grey text-sm">
                Description
              </span>
              <p className="mt-1 text-sm">{description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-coastal-sand/20">
              <div className="flex justify-between text-sm">
                <span className="text-coastal-dark-grey">Original Price</span>
                <span>${price} AUD</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-coastal-teal mt-2">
                  <span>Discount</span>
                  <span>-${appliedDiscount.amount} AUD</span>
                </div>
              )}
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>
                  ${appliedDiscount ? price - appliedDiscount.amount : price}{" "}
                  AUD
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount code"
              className="flex-1 px-4 py-2 border-2 border-coastal-sand rounded-lg focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20 outline-none"
            />
            <button
              type="button"
              onClick={() => onApplyDiscount(discountCode)}
              disabled={!discountCode || isLoading}
              className="px-4 py-2 bg-coastal-dark-teal text-white rounded-lg hover:bg-coastal-teal transition-colors disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          {discountError && (
            <p className="text-red-500 text-sm">{discountError}</p>
          )}
          {appliedDiscount && (
            <p className="text-coastal-teal text-sm">
              Discount applied: ${appliedDiscount.amount} off
            </p>
          )}
        </div>
      </div>

      {/* Right Column - Payment Details */}
      <div>
        <h3 className="font-semibold text-coastal-dark-teal mb-3 text-lg">
          Payment Details
        </h3>
        <PaymentElement className="mb-6" />
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full px-6 py-3 bg-coastal-dark-teal text-white rounded-lg 
                   hover:bg-coastal-teal transition-colors disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image: string;
  successImage: string;
  price: number;
  calendlyUrl: string;
  productId: string;
}

// Main modal component
export function ConsultationModal({
  isOpen,
  onClose,
  title,
  description,
  image,
  successImage,
  price,
  calendlyUrl,
  productId,
}: ConsultationModalProps) {
  const [clientSecret, setClientSecret] = useState<string>();
  const [showCalendly, setShowCalendly] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    promotionCode: string;
    couponId: string;
  } | null>(null);

  // Add Calendly event listener
  useEffect(() => {
    const handleCalendlyEvent = (e: any) => {
      if (e.data.event === "calendly.event_scheduled") {
        setShowSuccess(true);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, []);

  const handleApplyDiscount = async (code: string) => {
    setDiscountError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/validate-discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.error) {
        setDiscountError(data.error);
      } else {
        setAppliedDiscount({
          code,
          amount: data.amount,
          promotionCode: data.promotionCode,
          couponId: data.couponId,
        });
      }
    } catch (error) {
      setDiscountError("Failed to apply discount code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-consultation-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          promotionCode: appliedDiscount?.couponId,
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel
          className={`relative mx-auto w-full bg-white rounded-2xl shadow-xl ${
            showCalendly
              ? "max-w-4xl h-[800px]"
              : clientSecret
              ? "max-w-4xl" // Increased width for payment view
              : "max-w-2xl"
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <LoadingWave />
            </div>
          )}

          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="relative h-96 w-full mb-6">
                <Image
                  src={successImage}
                  alt={title}
                  fill
                  className="object-cover object-top rounded-lg"
                />
              </div>
              <div className="mb-6 flex justify-center">
                <IoCheckmarkCircle className="w-12 h-12 text-coastal-dark-teal" />
              </div>
              <h2 className="text-3xl font-bold text-coastal-dark-teal mb-4">
                Success! You&apos;re All Set
              </h2>
              <div className="prose prose-coastal max-w-none mb-8">
                <p className="text-lg text-coastal-dark-grey">
                  I&apos;m super excited to learn more about what you have going
                  on and help supercharge your business! You&apos;ll receive a
                  confirmation email shortly with all the details.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-coastal-dark-teal text-white rounded-lg 
                         hover:bg-coastal-teal transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : showCalendly ? (
            <div className="h-full">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-coastal-dark-teal">
                    Schedule Your Session
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-coastal-dark-grey hover:text-coastal-dark-teal"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="h-[calc(100%-70px)]">
                <InlineWidget
                  url={calendlyUrl}
                  styles={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          ) : clientSecret ? (
            <div className="p-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  onSuccess={() => setShowCalendly(true)}
                  price={price}
                  title={title}
                  description={description}
                  discountCode={discountCode}
                  setDiscountCode={setDiscountCode}
                  discountError={discountError}
                  appliedDiscount={appliedDiscount}
                  onApplyDiscount={handleApplyDiscount}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </Elements>
            </div>
          ) : (
            <div className="p-6">
              <div className="relative h-64 w-full mb-6">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <Dialog.Title className="text-2xl font-bold text-coastal-dark-teal mb-4">
                {title}
              </Dialog.Title>

              <div className="prose prose-coastal max-w-none mb-6">
                <p>{description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-coastal-dark-teal">
                  ${price} AUD
                </span>
                <button
                  onClick={handleInitiatePayment}
                  className="px-6 py-3 bg-coastal-dark-teal text-white rounded-lg 
                           hover:bg-coastal-teal transition-colors"
                >
                  Book Session
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
