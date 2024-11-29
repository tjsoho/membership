import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-coastal-shell to-coastal-sand w-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold tracking-tight text-coastal-ocean sm:text-5xl">
            Welcome to Your Course Platform
          </h1>
          
          <p className="text-lg leading-8 text-coastal-teal">
            Access your purchased courses and start learning today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-lg bg-coastal-ocean px-6 py-3 text-base font-semibold 
                       text-white shadow-sm hover:bg-coastal-oceanLight transition-all duration-200 
                       hover:shadow-md"
            >
              Sign in to your account
            </Link>
            
            <Link
              href="/help"
              className="text-base font-semibold text-coastal-teal hover:text-coastal-tealLight 
                       transition-colors duration-200 flex items-center gap-1"
            >
              Need help? <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          <div className="text-sm text-coastal-teal pt-4">
            <p>Just purchased a course? Check your email for login credentials.</p>
          </div>
        </div>
      </div>
    </div>
  )
}