// app/admin/approvals/page.tsx

import React from "react"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"
import ApproveButton from "@/components/ApproveButton"  // <- client-only

type Profile = {
  id: string
  full_name: string
}

export default async function AdminApprovalsPage() {
  // ── 1) Call cookies() once here ──
  const cookieStore = cookies()

  // ── 2) Pass a function that returns that same store ──
  const authClient = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const {
    data: { session },
  } = await authClient.auth.getSession()

  if (!session?.user || !session.user.user_metadata?.is_admin) {
    // Non-admin or not signed in
    return <p>You must be signed in as an admin to view this page.</p>
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .eq("approved", false)

  if (error) {
    return <p className="text-red-500">Error loading profiles: {error.message}</p>
  }

  const profiles = (data as Profile[]) || []
  if (profiles.length === 0) {
    return <p>All profiles are approved!</p>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Pending Approvals</h1>
      {profiles.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <span className="font-semibold">{p.full_name}</span>
          {/* ← This is the only interactive piece now */}
          <ApproveButton id={p.id} />
        </div>
      ))}
    </div>
  )
}
