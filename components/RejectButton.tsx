// components/RejectButton.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function RejectButton({ userId }: { userId: string }) {
  const handleClick = async () => {
    if (!confirm("Are you sure you want to reject this user? This will delete their account.")) {
      return
    }

    const res = await fetch("/api/reject", {
      method: "POST", // use POST to avoid method mismatch/404
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    if (res.ok) {
      window.location.reload()
    } else {
      let msg = res.statusText
      try {
        const json = await res.json()
        msg = json?.error ?? msg
      } catch {}
      alert("Reject failed: " + msg)
    }
  }

  // Use the same default Button styling as Approve so the colors match
  return (
    <Button size="sm" onClick={handleClick}>
      Reject
    </Button>
  )
}
