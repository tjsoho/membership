import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script 
          src="https://www.youtube.com/iframe_api" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="h-full">
        <LoadingProvider>
          <AuthProvider>{children}</AuthProvider>
        </LoadingProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
