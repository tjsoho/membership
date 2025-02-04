"use client";
import { useState } from "react";
import Image from "next/image";
import { ConsultationModal } from "./ConsultationModal";
import { LoadingWave } from "@/components/ui/LoadingWave";
import { Modal } from "@/components/ui/Modal";

interface ConsultationCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  successImage?: string;
  price?: number;
  calendlyUrl?: string;
  type?: "consultation" | "external";
  externalUrl?: string;
}

export function ConsultationCard({
  id,
  title,
  description,
  image,
  successImage,
  price,
  calendlyUrl,
  type,
  externalUrl,
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
        className="relative rounded-xl border border-white overflow-hidden shadow-xl hover:shadow-md transition-all cursor-pointer bg-white hover:scale-[1.02]"
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

      {type === "external" ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6 max-w-2xl mx-auto">
            <div className="relative h-48 w-full mb-6">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-coastal-dark-teal mb-4">
              {title}
            </h2>
            <div
              className="text-gray-600 whitespace-pre-line mb-6"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block px-6 py-3 bg-coastal-dark-teal text-white rounded-lg hover:bg-coastal-teal transition-colors w-full text-center"
            >
              Join Sloane
            </a>
          </div>
        </Modal>
      ) : (
        <ConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          description={description}
          image={image}
          successImage={successImage || image}
          price={price || 0}
          calendlyUrl={calendlyUrl || ""}
          productId={id}
        />
      )}
    </>
  );
}
