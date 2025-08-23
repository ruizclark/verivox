// components/PasswordRecoveryRouter.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PasswordRecoveryRouter() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      // Preserve the hash so access_token / refresh_token are kept
      router.replace(`/update-password${window.location.hash}`)
    }
  }, [router])

  return null
}
