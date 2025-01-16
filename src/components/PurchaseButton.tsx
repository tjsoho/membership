"use client";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/******************************************************************************
                                TYPES
******************************************************************************/
interface PurchaseButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isUnlocked: boolean;
}

/******************************************************************************
                              COMPONENT
******************************************************************************/
export function PurchaseButton({
  courseId,
  courseTitle,
  price,
  isUnlocked,
}: PurchaseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isUnlocked) {
    return (
      <button
        className="w-full bg-coastal-light-teal text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed font-medium"
        disabled
      >
        Purchased
      </button>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-coastal-dark-teal font-medium">
              Loading course...
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-coastal-dark-teal text-white px-6 py-3 rounded-lg hover:bg-coastal-light-teal transition-colors duration-200 font-medium shadow-sm"
      >
        Purchase for ${price}
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
        price={price}
        onSuccess={() => {
          setIsLoading(true);
          // The loading state will be cleared when the redirect happens
        }}
      />
    </>
  );
}
