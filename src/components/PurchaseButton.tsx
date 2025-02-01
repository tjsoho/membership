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
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-coastal-light-teal">
          ${price} AUD
        </span>
        <button
          className="px-4 py-2 rounded-lg bg-coastal-light-teal text-white opacity-50 cursor-not-allowed font-medium"
          disabled
        >
          Enrolled
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold">${price} AUD</span>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded-lg transition-colors bg-coastal-ocean text-white hover:bg-coastal-oceanLight"
      >
        Purchase Course
      </button>
    </div>
  );
}
