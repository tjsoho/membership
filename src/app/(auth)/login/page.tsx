import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-coastal-shell to-coastal-sand w-full">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-coastal-ocean">Sign in to your account</h2>
            <p className="mt-2 text-coastal-teal">
              Access your course content
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
} 