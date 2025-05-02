// app/admin/approvals/page.tsx

import React from "react"
import { supabaseAdmin } from "@/lib/supabase/admin"

// Define the shape of a profile record
type Profile = {
  id: string
  name: string
}

// Server component for listing and approving user profiles
export default async function AdminApprovalsPage() {
  // 1. Fetch profiles where `approved = false`
  const { data: profiles, error } = await supabaseAdmin
    .from<Profile>("profiles")
    .select("id, name")
    .eq("approved", false)

  // 2. Handle any fetch errors
  if (error) {
    return <p className="text-red-500">Error loading profiles: {error.message}</p>
  }

  // 3. Show a message if there are none pending
  if (!profiles || profiles.length === 0) {
    return <p>All profiles are approved!</p>
  }

  // 4. Render the list of unapproved profiles
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Pending Approvals</h1>
      {profiles.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <p className="font-semibold">{p.name}</p>
          <button
            onClick={async () => {
              // Call the approve API route
              const res = await fetch("/api/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: p.id }),
              })
              const json = await res.json()
              if (res.ok) {
                // Reload to remove the approved profile from the list
                window.location.reload()
              } else {
                alert("Approve failed: " + json.error)
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  )
}