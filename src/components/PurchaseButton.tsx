"use client";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";

interface PurchaseButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  isUnlocked: boolean;
}

export function PurchaseButton({
  courseId,
  courseTitle,
  price,
  isUnlocked,
}: PurchaseButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isUnlocked) {
    return (
      <button
        className="w-full bg-coastal-light-teal text-white px-6 py-3 rounded-lg 
                 opacity-50 cursor-not-allowed font-medium"
        disabled
      >
        Purchased
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-coastal-dark-teal text-white px-6 py-3 rounded-lg 
                 hover:bg-coastal-light-teal transition-colors duration-200
                 font-medium shadow-sm"
      >
        Purchase for ${price}
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
        price={price}
      />
    </>
  );
}
