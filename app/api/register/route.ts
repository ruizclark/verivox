// app/api/register/route.ts

import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  // 1️⃣ Read the user’s session from the cookie:
  const authClient = createRouteHandlerClient({ cookies })
  const {
    data: { session },
    error: sessionError,
  } = await authClient.auth.getSession()

  // 🐞 LOG: session & sessionError for debugging
  console.log("🔌 /api/register: session", session)
  console.log("🔌 /api/register: sessionError", sessionError)

  const user = session?.user
  if (sessionError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to register your profile." },
      { status: 401 }
    )
  }

  try {
    // 2️⃣ Pull every field sent from the frontend (including slug & photo_url)
    const body = await req.json()
    // 🐞 LOG: incoming request body
    console.log("🔌 /api/register: received body", body)

    const {
      full_name,
      slug,             // ⬅️ existing: slug from front end
      photo_url,        // ⬅️ EDIT: added photo_url here
      graduation_year,
      title,
      employer,
      location,
      linkedin_url,
      website_url,
      resume_url,
      about,
      approved,
    } = body

    // 3️⃣ Upsert the complete object, no missing NOT NULL columns
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        [
          {
            id:               user.id,
            full_name,
            slug,           // ⬅️ existing: include slug
            photo_url,      // ⬅️ EDIT: include photo_url in upsert
            graduation_year,
            title,
            employer,
            location,
            linkedin_url,
            website_url,
            resume_url,
            about,
            approved,
          },
        ],
        { onConflict: "id" }
      )

    // 🐞 LOG: upsert result
    console.log("🔌 /api/register: upsertError", upsertError)

    if (upsertError) {
      console.error("🛑 Profile upsert failed:", upsertError)
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      )
    }

    // 4️⃣ All good
    return NextResponse.json({ message: "Profile saved!" }, { status: 200 })
  } catch (err) {
    console.error("🛑 Unexpected error in /api/register:", err)
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }
}