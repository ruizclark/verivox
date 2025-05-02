// app/api/register/route.ts

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const supabase = supabaseAdmin

  // 1. Parse the incoming JSON
  const { name, resumeUrl } = await req.json()

  // 2. Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to register your profile." },
      { status: 401 }
    )
  }

  // 3. Upsert the profile row
  const { error } = await supabase
    .from("profiles")
    .upsert(
      [
        {
          id: user.id,             // use auth ID as primary key
          name,                    // from your form
          email: user.email ?? "", // from auth metadata
          resume_url: resumeUrl,   // from your upload component
          approved: false          // start as unapproved
        },
      ],
      { onConflict: ["id"] }
    )

  if (error) {
    console.error("❌ Profile upsert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. Return success
  return NextResponse.json({ message: "Profile saved!" }, { status: 200 })
}
