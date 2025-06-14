/******************************************************************************
                                IMPORTS
******************************************************************************/
"use client";
import React from "react";
import { useState } from "react";
import { PurchaseButton } from "./PurchaseButton";
import Image from "next/image";
import { LoadingWave } from "./ui/LoadingWave";
import { useRouter } from "next/navigation";

/******************************************************************************
                                TYPES
******************************************************************************/
interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  isUnlocked: boolean;
  onClick: () => void;
  showEditContent?: boolean;
}

/******************************************************************************
                              COMPONENT
******************************************************************************/
export function CourseCard({
  id,
  title,
  description,
  image,
  price,
  isUnlocked,
  onClick,
  showEditContent = false,
}: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("Failed to load course:", error);
      setIsLoading(false);
    }
  };

  /******************************************************************************
   *                            RENDER
   ******************************************************************************/
  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div onClick={handleClick} className="cursor-pointer">
          <div className="relative h-48 w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
              priority
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600 mt-2">{description}</p>
          </div>
        </div>
        <div className="p-4 border-t flex items-center justify-between w-full">
          <span className="text-lg font-bold text-coastal-dark-teal">
            ${price} AUD
          </span>
          {isUnlocked && (
            <span className="flex items-center  text-green-600 text-sm ml-2">
             
              ✅ Enrolled
            </span>
          )}
          <PurchaseButton
            courseId={id}
            courseTitle={title}
            price={price}
            isUnlocked={isUnlocked}
          />
          {showEditContent && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
              onClick={() => router.push(`/admin/courses/${id}/content`)}
              type="button"
            >
              Edit Content
            </button>
          )}
        </div>
      </div>
      {isLoading && <LoadingWave />}
    </>
  );
}
