// components/ApproveButton.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ApproveButtonProps {
  id: string
}

export default function ApproveButton({ id }: ApproveButtonProps) {
  const handleClick = async () => {
    const res = await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      // Refresh the page to update the list
      window.location.reload()
    } else {
      const json = await res.json()
      alert("Approve failed: " + (json.error ?? res.statusText))
    }
  }

  return (
    <Button size="sm" onClick={handleClick}>
      Approve
    </Button>
  )
}


