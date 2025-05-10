// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollAnimation } from "@/components/scroll-animation"
// ✅ NEW: import our top-level Supabase context provider
import SupabaseProvider from "./providers/SupabaseProvider"
// ✨ EDIT: import TooltipProvider
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VERIVOX - Amplifying the Voices of the EdLD Community",
  description: "A platform for Harvard EdLD students and alumni to share their work and connect with each other.",
  generator: "v0.dev",
  // 👇 Tell Next to use this PNG as the favicon
  icons: {
    icon: "/images/verivox-logo.png"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ✅ Wrap entire app in SupabaseProvider so all hooks share one client */}
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* ✨ EDIT: Wrap in TooltipProvider with zero hover delay */}
            <TooltipProvider delayDuration={0}>
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
