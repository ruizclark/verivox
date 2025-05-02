// app/admin/approvals/page.tsx

import React from "react"
import { supabaseAdmin } from "@/lib/supabase/admin"

type Profile = {
  id: string
  full_name: string
  email: string
}

export default async function AdminApprovalsPage() {
  // 1. Fetch all profiles where approved = false
  const { data: profiles, error } = await supabaseAdmin
    .from<Profile>("profiles")
    .select("id, full_name, email")
    .eq("approved", false)

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>
  }

  if (!profiles || profiles.length === 0) {
    return <p>All profiles are approved!</p>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Pending Approvals</h1>
      {profiles.map((p) => (
        <div key={p.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <p className="font-semibold">{p.full_name}</p>
            <p className="text-sm text-gray-600">{p.email}</p>
          </div>
          <button
            onClick={async () => {
              // we'll implement this in Step 2
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
