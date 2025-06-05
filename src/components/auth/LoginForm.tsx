"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../../utils/toast";
import { ContactSupportForm } from "./ContactSupportForm";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      console.log("🔑 Attempting login with email:", email);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("📡 Login response:", response);

      if (!response?.error) {
        console.log("✅ Login successful, redirecting...");
        showToast.success("Welcome Back!", "Successfully logged in");
        await Promise.all([router.push("/dashboard"), router.refresh()]);
      } else {
        console.log("❌ Login failed:", response.error);
        showToast.error("Login Failed", "Invalid email or password");
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("🚨 Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-coastal-dark-grey"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border border-coastal-sand px-3 py-2 
                     shadow-sm focus:border-coastal-dark-teal focus:outline-none 
                     focus:ring-coastal-dark-teal sm:text-sm"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-coastal-dark-grey"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="mt-1 block w-full rounded-md border border-coastal-sand px-3 py-2 
                     shadow-sm focus:border-coastal-dark-teal focus:outline-none 
                     focus:ring-coastal-dark-teal sm:text-sm"
          />
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-coastal-dark-teal hover:text-coastal-light-teal 
                       transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent 
                   rounded-md shadow-sm text-sm font-medium text-white 
                   bg-coastal-dark-teal hover:bg-coastal-light-teal 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-coastal-dark-teal disabled:opacity-50 
                   disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="text-center text-sm mt-4">
        <p className="text-coastal-dark-grey">
          Having Trouble Logging in?{" "}
          <button
            type="button"
            onClick={() => setShowContactForm(true)}
            className="text-coastal-dark-teal hover:text-coastal-light-teal transition-colors"
          >
            Click Here
          </button>
        </p>
      </div>

      {showContactForm && (
        <ContactSupportForm onClose={() => setShowContactForm(false)} />
      )}
    </>
  );
}
