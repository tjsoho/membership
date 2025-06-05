"use client";

import Image from "next/image";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Scrollable Privacy Policy */}
      <div className="w-full lg:w-1/2 bg-coastal-light-grey overflow-y-auto h-screen">
        <div className="max-w-2xl mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-coastal-dark-teal text-center mb-4">
              Privacy Policy
            </h1>
            <p className="text-coastal-dark-grey text-center text-lg">
              How we collect, use, and protect your information
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Information We Collect
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We collect information you provide directly, including name,
                email, and payment information. This information is necessary to
                provide you with access to our services and process your
                transactions.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We use your information to provide our services, process
                payments, and communicate with you about your account. We may
                also use your information to improve our services and send you
                updates about new courses or features.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Information Sharing
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We do not sell your personal information. We share information
                only with service providers necessary for our operations, such
                as payment processors and email service providers.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Data Security
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  5
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Cookies
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We use cookies to improve your experience and analyze website
                traffic. These cookies help us understand how you interact with
                our platform and enable certain functionality.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  6
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Your Rights
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                You have the right to access, correct, or delete your personal
                information. You may also request a copy of your data or ask us
                to restrict its processing.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  7
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Third-Party Services
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We use trusted third-party services for payment processing and
                email communications. These services have their own privacy
                policies and handling of personal data.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  8
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Changes to Policy
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We may update this policy periodically. Continued use of our
                services after changes constitutes acceptance of the updated
                policy.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  9
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Contact Us
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                For privacy-related inquiries, contact us at toby@ai-guy.co
              </p>
            </section>

            {/* Footer */}
            <div className="border-t border-coastal-sand mt-8 pt-8 space-y-4">
              <p className="text-sm text-coastal-dark-grey text-center">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full py-2 px-4 bg-coastal-dark-teal text-white rounded-lg
                         hover:bg-coastal-light-teal transition-colors duration-200"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Full-bleed Image */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/images/pool.jpg"
          alt="Privacy and Security"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-coastal-dark-teal/10" />
      </div>
    </div>
  );
}
