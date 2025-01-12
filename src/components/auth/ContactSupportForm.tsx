"use client";

import { useState } from "react";
import { showToast } from "@/utils/toast";

interface ContactSupportFormProps {
  onClose: () => void;
}

export function ContactSupportForm({ onClose }: ContactSupportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      showToast.success(
        "Message Sent",
        "We've received your message and will get back to you soon."
      );
      setIsSubmitted(true);
    } catch (error) {
      showToast.error(
        "Error",
        "Failed to send message. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed bg-white inset-0 flex items-center justify-center z-50 rounded-xl">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
          <h2 className="text-2xl font-semibold text-coastal-dark-teal mb-4">
            Thank You!
          </h2>
          <p className="text-coastal-dark-grey mb-6">
            Your message has been received and we&apos;ll get back to you as soon as possible.
          </p>
          <button
            onClick={onClose}
            className="bg-coastal-dark-teal text-white px-6 py-2 rounded-lg
                     hover:bg-coastal-light-teal transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bg-white inset-0 flex items-center justify-center z-50 rounded-xl">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold text-coastal-dark-teal mb-4">
          Contact Support
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-coastal-dark-grey">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                       focus:border-coastal-dark-teal focus:ring-coastal-dark-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-coastal-dark-grey">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                       focus:border-coastal-dark-teal focus:ring-coastal-dark-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-coastal-dark-grey">
              Message
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                       focus:border-coastal-dark-teal focus:ring-coastal-dark-teal"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-coastal-dark-teal text-white px-4 py-2 rounded-lg
                       hover:bg-coastal-light-teal transition-colors"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-coastal-dark-teal text-coastal-dark-teal px-4 py-2 
                       rounded-lg hover:bg-coastal-light-grey transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
