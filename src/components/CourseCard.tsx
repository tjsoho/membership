/******************************************************************************
                                IMPORTS
******************************************************************************/
"use client";
import { useState } from "react";
import { PurchaseButton } from "./PurchaseButton";
import Image from "next/image";
import { LoadingSpinner } from "./ui/LoadingSpinner";

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
}: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="p-4 border-t">
          <PurchaseButton
            courseId={id}
            courseTitle={title}
            price={price}
            isUnlocked={isUnlocked}
          />
        </div>
      </div>
      {isLoading && <LoadingSpinner message="Loading course..." />}
    </>
  );
}
