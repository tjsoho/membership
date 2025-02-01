"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CreateCourseFormProps {
  course?: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    stripeProductId: string | null;
    highlights: string[];
    whatYouWillLearn: string[];
  };
  onCancel?: () => void;
}

export function CreateCourseForm({ course, onCancel }: CreateCourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: course?.id || "",
    title: course?.title || "",
    description: course?.description || "",
    image: course?.image || "",
    price: course?.price?.toString() || "",
    stripeProductId: course?.stripeProductId || "",
    highlights: course?.highlights || [""],
    whatYouWillLearn: course?.whatYouWillLearn || [""],
  });

  const isEditing = !!course;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(course?.image || "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleArrayInputChange = (
    field: "highlights" | "whatYouWillLearn",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayItem = (field: "highlights" | "whatYouWillLearn") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveArrayItem = (
    field: "highlights" | "whatYouWillLearn",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size too large. Please upload an image smaller than 5MB.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);

      // Add detailed error logging
      console.log("Starting image upload...");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", res.status);
      const data = await res.json();
      console.log("Upload response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
      setPreviewImage(data.url);
    } catch (error) {
      console.error("Detailed upload error:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image. Please try again."
      );
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const courseId = formData.id;

    try {
      const endpoint = isEditing
        ? `/api/admin/courses/${course.id}`
        : "/api/admin/courses";

      const method = isEditing ? "PUT" : "POST";

      // Log the data being sent
      console.log("Sending course data:", {
        id: courseId,
        title: formData.title,
        description: formData.description,
        image: formData.image,
        price: Number(formData.price),
        stripeProductId: formData.stripeProductId,
        highlights: formData.highlights.filter((h) => h.trim() !== ""),
        whatYouWillLearn: formData.whatYouWillLearn.filter(
          (w) => w.trim() !== ""
        ),
      });

      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          id: courseId,
          title: formData.title,
          description: formData.description,
          image: formData.image,
          price: Number(formData.price),
          stripeProductId: formData.stripeProductId,
          highlights: formData.highlights.filter((h) => h.trim() !== ""),
          whatYouWillLearn: formData.whatYouWillLearn.filter(
            (w) => w.trim() !== ""
          ),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Log the response
      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) throw new Error("Failed to save course");

      if (!isEditing) {
        // Show guidance only for new courses
        const componentName = courseId
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");

        const guidance = `
          Next steps:
          1. Create a new file: src/app/courses/${courseId}/page.tsx
          2. Create the component: export default function ${componentName}() { ... }
          3. Add your course content
        `;
        alert(
          `Course ${isEditing ? "updated" : "created"} successfully!\n\n${
            !isEditing ? guidance : ""
          }`
        );
      }

      router.refresh();
      if (!isEditing) {
        e.currentTarget.reset();
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Error saving course:", error);
      setError(
        `Failed to ${isEditing ? "update" : "create"} course. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-coastal-ocean mb-1"
          >
            URL Path
          </label>
          <input
            type="text"
            name="id"
            id="id"
            required
            value={formData.id}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20 
              placeholder:text-coastal-ocean/40"
            placeholder="perfect-home-page"
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens are allowed"
          />
          <p className="mt-1 text-sm text-coastal-ocean/60">
            This will create a route at /courses/your-path
          </p>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-coastal-ocean mb-1"
          >
            Course Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-coastal-ocean mb-1"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-coastal-ocean mb-1">
            Course Image
          </label>
          <div className="space-y-2">
            {previewImage && (
              <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden">
                <Image
                  src={previewImage}
                  alt="Course preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="inline-flex items-center px-4 py-2 border border-coastal-sand
                       rounded-md shadow-sm text-sm font-medium text-coastal-dark-grey
                       bg-white hover:bg-coastal-light-grey focus:outline-none
                       focus:ring-2 focus:ring-offset-2 focus:ring-coastal-dark-teal
                       disabled:opacity-50"
            >
              {uploadingImage ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-coastal-dark-teal"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Image"
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-coastal-ocean mb-1"
          >
            Price (AUD)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
          />
        </div>

        <div>
          <label
            htmlFor="stripeProductId"
            className="block text-sm font-medium text-coastal-ocean mb-1"
          >
            Stripe Product ID
          </label>
          <input
            type="text"
            name="stripeProductId"
            id="stripeProductId"
            required
            value={formData.stripeProductId}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
              shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
            placeholder="prod_..."
          />
        </div>

        {/* Highlights Section */}
        <div>
          <label className="block text-sm font-medium text-coastal-ocean mb-1">
            Course Highlights
          </label>
          <div className="space-y-2">
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) =>
                    handleArrayInputChange("highlights", index, e.target.value)
                  }
                  className="flex-1 rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
                    shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
                  placeholder="Enter a course highlight"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("highlights", index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem("highlights")}
              className="text-coastal-teal hover:text-coastal-dark-teal"
            >
              Add Highlight
            </button>
          </div>
        </div>

        {/* What You'll Learn Section */}
        <div>
          <label className="block text-sm font-medium text-coastal-ocean mb-1">
            What You&apos;ll Learn
          </label>
          <div className="space-y-2">
            {formData.whatYouWillLearn.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "whatYouWillLearn",
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1 rounded-lg border-2 border-coastal-sand bg-white px-4 py-2
                    shadow-sm focus:border-coastal-teal focus:ring-2 focus:ring-coastal-teal/20"
                  placeholder="Enter a learning point"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveArrayItem("whatYouWillLearn", index)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem("whatYouWillLearn")}
              className="text-coastal-teal hover:text-coastal-dark-teal"
            >
              Add Learning Point
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coastal-dark-teal text-white px-6 py-3 rounded-full 
            hover:bg-coastal-oceanLight disabled:opacity-50 transition-colors
            font-medium shadow-sm"
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Course"
            : "Create Course"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="mt-2 w-full bg-coastal-sand/20 text-coastal-ocean px-6 py-3 rounded-lg 
              hover:bg-coastal-sand/30 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Preview Card */}
      <div className="lg:sticky lg:top-6">
        <h3 className="text-lg font-medium text-coastal-ocean mb-4">Preview</h3>
        <div className="bg-white rounded-2xl shadow-lg border-2 border-coastal-sand overflow-hidden">
          {formData.image ? (
            <div className="relative aspect-video">
              <Image
                src={formData.image}
                alt={formData.title || "Course preview"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-coastal-sand/20 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-coastal-sand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div className="p-6">
            <h3 className="text-xl font-bold text-coastal-ocean mb-2">
              {formData.title || "Course Title"}
            </h3>
            <p className="text-coastal-ocean/70 mb-4">
              {formData.description || "Course description will appear here..."}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-coastal-teal">
                {formData.price ? `$${formData.price} AUD` : "$0 AUD"}
              </span>
              <button
                className="bg-coastal-ocean text-white px-4 py-2 rounded-lg 
                  hover:bg-coastal-oceanLight transition-colors text-sm font-medium"
                disabled
              >
                Preview Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
