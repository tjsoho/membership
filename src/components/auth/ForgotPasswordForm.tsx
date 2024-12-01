"use client";

import { useState } from "react";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      setSuccess(true);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-coastal-dark-grey">
          If an account exists with that email, you will receive reset
          instructions shortly.
        </p>
        <button
          onClick={onBackToLogin}
          className="text-coastal-dark-teal hover:text-coastal-light-teal 
                   transition-colors"
        >
          Return to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-coastal-dark-grey"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-coastal-sand px-3 py-2
                   focus:border-coastal-dark-teal focus:ring-coastal-dark-teal
                   bg-white/90"
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-coastal-dark-teal px-6 py-3 text-white 
                   hover:bg-coastal-light-teal transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Reset Instructions"
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-sm text-coastal-dark-teal hover:text-coastal-light-teal 
                   transition-colors font-semibold"
        >
          Back to login
        </button>
      </div>
    </form>
  );
}
