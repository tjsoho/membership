"use client";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";
import { stripe } from "@/lib/stripe";

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

  if (isUnlocked) {
    return (
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
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
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
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
