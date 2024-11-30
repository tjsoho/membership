import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
