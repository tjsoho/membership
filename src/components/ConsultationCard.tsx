"use client";
import { useState } from "react";
import Image from "next/image";
import { ConsultationModal } from "./ConsultationModal";
import { LoadingWave } from "@/components/ui/LoadingWave";

interface ConsultationCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  successImage: string;
  price: number;
  calendlyUrl: string;
}

export function ConsultationCard({
  id,
  title,
  description,
  image,
  successImage,
  price,
  calendlyUrl,
}: ConsultationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setIsModalOpen(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="relative border-2 border-coastal-teal rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white hover:scale-[1.02]"
      >
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-coastal-dark-teal mb-2">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-4">
            <button className="px-4 py-2 bg-coastal-dark-teal text-white rounded-lg hover:bg-coastal-teal transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <LoadingWave />
          </div>
        )}
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        image={image}
        successImage={successImage}
        price={price}
        calendlyUrl={calendlyUrl}
        productId={id}
      />
    </>
  );
}
