"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

interface RejectButtonProps {
  id: string
}

export default function RejectButton({ id }: RejectButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this profile? This will delete it permanently.")) return

    setLoading(true)
    const res = await fetch("/api/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    setLoading(false)

    if (res.ok) {
      window.location.reload()
    } else {
      const json = await res.json()
      alert("Reject failed: " + (json.error ?? res.statusText))
    }
  }

  return (
    <Button size="sm" onClick={handleReject} disabled={loading}>
      {loading ? "Rejecting…" : "Reject"}
    </Button>
  )
}
