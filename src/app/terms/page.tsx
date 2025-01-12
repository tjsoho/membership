"use client";

import Image from "next/image";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Scrollable Terms */}
      <div className="w-full lg:w-1/2 bg-coastal-light-grey overflow-y-auto h-screen">
        <div className="max-w-2xl mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-coastal-dark-teal text-center mb-4">
              Terms of Service
            </h1>
            <p className="text-coastal-dark-grey text-center text-lg">
              Please read these terms carefully before using our platform
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
                  Acceptance of Terms
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                By accessing and using The Savvy Business Hub, you accept and
                agree to these Terms of Service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Description of Service
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                The Savvy Business Hub provides online educational content and
                business resources through its platform.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  User Accounts
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                You must provide accurate information when creating an account
                and are responsible for maintaining its security.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Payment and Refunds
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                Due to the digital nature of our content, including videos,
                tutorials, and downloadable materials, all purchases are final
                and non-refundable. Once access is granted to any course or
                digital content, we are unable to provide refunds as the content
                cannot be returned or revoked. Please carefully review course
                details before making a purchase.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  5
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Intellectual Property
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                All content provided through our platform is protected by
                copyright and other intellectual property laws.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  6
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  User Conduct
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                Users agree not to share account credentials or course content
                with unauthorized users.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  7
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Termination
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We reserve the right to terminate accounts for violations of
                these terms.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  8
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Changes to Terms
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                We may modify these terms at any time. Continued use constitutes
                acceptance of changes.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-coastal-dark-teal text-white flex items-center justify-center font-semibold">
                  9
                </div>
                <h2 className="text-2xl font-semibold text-coastal-dark-teal">
                  Contact Information
                </h2>
              </div>
              <p className="text-coastal-dark-grey ml-11">
                For questions about these terms, contact us at toby@ai-guy.co
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
          src="/images/pool.jpg" // You can change this to any image you prefer
          alt="Business Success"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-coastal-dark-teal/10" />{" "}
        {/* Optional overlay */}
      </div>
    </div>
  );
}
