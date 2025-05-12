// components/ApproveButton.tsx

"use client"

// This component is used to approve a user
import React from "react"
import { Button } from "@/components/ui/button"

// This component is used to approve a user
interface ApproveButtonProps {
  id: string
}

// Export the ApproveButton component
export default function ApproveButton({ id }: ApproveButtonProps) {
  // This function is used to handle the click event of the button
  const handleClick = async () => {
    // Show a confirmation dialog
    const res = await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    // If the response is ok, refresh the page
    if (res.ok) {
      // Refresh the page to update the list
      window.location.reload()
    } else {
      // If the response is not ok, show an alert with the error message
      const json = await res.json()
      alert("Approve failed: " + (json.error ?? res.statusText))
    }
  }

  // Render the button
  return (
    <Button size="sm" onClick={handleClick}>
      Approve
    </Button>
  )
}


