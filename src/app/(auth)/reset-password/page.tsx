import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-coastal-shell to-coastal-sand">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-coastal-ocean">Reset Your Password</h2>
            <p className="mt-2 text-coastal-teal">
              Enter your new password below
            </p>
          </div>
          <ResetPasswordForm token={searchParams.token} />
        </div>
      </div>
    </div>
  )
} 