// app/api/register/route.ts

import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  // Read the user’s session from the cookie:
  const authClient = createRouteHandlerClient({ cookies })
  const {
    data: { session },
    error: sessionError,
  } = await authClient.auth.getSession()

  const user = session?.user
  if (sessionError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to register your profile." },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const {
      full_name,
      slug,
      photo_url,
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

    // Upsert the complete object, including user_id
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        [
          {
            id:               user.id,
            user_id:          user.id,    // ← added this line
            full_name,
            slug,
            photo_url,
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

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Profile saved!" }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }
}
