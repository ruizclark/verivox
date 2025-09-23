// File: app/admin/approvals/page.tsx

// Import necessary modules and components
import React from "react"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"
import ApproveButton from "@/components/ApproveButton"  // <- client-only
import RejectButton from "@/components/RejectButton"    // <- ✅ NEW

// Define the Profile type
type Profile = {
  id: string
  user_id: string            // ✅ NEW
  full_name: string
  resume_url: string | null
}

// Import the ApproveButton component
export default async function AdminApprovalsPage() {
  // Call cookies()
  const cookieStore = cookies()

  // Pass a function that returns the cookies
  const authClient = createRouteHandlerClient({ cookies: () => cookieStore })

  // Get the session
  const {
    data: { session },
  } = await authClient.auth.getSession()

  // Check if the user is signed in
  if (!session?.user) {
    // If not signed in, return a message
    return <p>You must be signed in as an admin to view this page.</p>
  }

  // Verify admin flag from profiles table instead of user_metadata
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single()

  // Check if the user is an admin
  if (profileError || !profileData?.is_admin) {
    // If not an admin, return a message
    return <p>You must be signed in as an admin to view this page.</p>
  }

  // Fetch profiles that are not approved
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, user_id, full_name, resume_url") // ✅ include user_id
    .eq("approved", false)

  // Check for errors in fetching profiles
  if (error) {
    return (
      <p className="text-red-500">Error loading profiles: {error.message}</p>
    )
  }

  // Check if there are any profiles to approve
  const profiles = (data as Profile[]) || []
  if (profiles.length === 0) {
    return <p>All profiles are approved!</p>
  }

  // Render the list of profiles with approve buttons
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Pending Approvals</h1>
      {profiles.map((p) => (
        <div
          key={p.id}
          className="flex flex-col gap-3 p-4 border rounded-lg"
        >
          {/* Top row: name + approve/reject buttons */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">{p.full_name}</span>
            <div className="flex items-center gap-2">
              <ApproveButton id={p.id} />
              <RejectButton userId={p.user_id} /> {/* ✅ NEW */}
            </div>
          </div>

          {/* Resume link + optional quick preview */}
          {p.resume_url ? (
            <div className="space-y-2">
              <a
                href={p.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-harvard-crimson underline"
              >
                View résumé (PDF)
              </a>

              <details className="mt-1">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Quick preview
                </summary>
                <div className="mt-2 border rounded overflow-hidden">
                  <iframe
                    src={p.resume_url}
                    className="w-full h-96"
                    title={`${p.full_name} résumé`}
                  />
                </div>
              </details>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No résumé uploaded.</p>
          )}
        </div>
      ))}
    </div>
  )
}
