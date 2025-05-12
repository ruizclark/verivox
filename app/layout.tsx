// app/layout.tsx

// Import the necessary modules and components
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// Import the ThemeProvider and other components
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
// Import our top-level Supabase context provider
import SupabaseProvider from "./providers/SupabaseProvider"
// Import TooltipProvider
import { TooltipProvider } from "@/components/ui/tooltip"

// Import the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] })

// Define the metadata for the page
export const metadata: Metadata = {
  title: "VERIVOX - Amplifying the Voices of the EdLD Community",
  description: "A platform for Harvard EdLD students and alumni to share their work and connect with each other.",
  generator: "v0.dev",
  // 👇 Tell Next to use this PNG as the favicon
  icons: {
    icon: "/images/verivox-logo.png"
  }
}

// Define the RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is the root layout component for the app. It wraps the entire app in a theme provider and a Supabase provider.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap entire app in SupabaseProvider so all hooks share one client */}
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* ✨ EDIT: Wrap in TooltipProvider with zero hover delay */}
            <TooltipProvider delayDuration={0}>
              {/* Wrap in ScrollAnimation */}
              <div className="flex min-h-screen flex-col">
                <ScrollAnimation />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
