// app/register/pending/page.tsx

// This is a Next.js page component that displays a message to users
import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// This component is displayed when a user registers for the platform
export default function PendingRegistrationPage() {
  return (
    // The main container for the page
    <div className="max-w-md mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Registering!</h1>
      {/* The message displayed to the user */}
      <p className="mb-6">
        VERIVOX is an exclusive platform for the HGSE EdLD community. Your profile is currently under review and will be approved once we’ve verified your program affiliation.
      </p>
      <Link href="/" passHref>
        {/* ↓ Removed size="md" (invalid) so this button uses the default size */}
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
