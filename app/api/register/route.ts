// app/api/register/route.ts

// Import the necessary modules and types
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

// This function handles the POST request to register a user profile
export async function POST(req: Request) {
  // Read the user’s session from the cookie:
  const authClient = createRouteHandlerClient({ cookies })
  // Get the session from the request
  const {
    data: { session },
    error: sessionError,
  } = await authClient.auth.getSession()

  // Check if the session exists and if there is an error
  const user = session?.user
  if (sessionError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to register your profile." },
      { status: 401 }
    )
  }

  // Check if the user is already registered
  try {
    // Pull every field sent from the frontend (including slug & photo_url)
    const body = await req.json()

    // Check if the body is empty
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

    // Upsert the complete object, no missing NOT NULL columns
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        [
          {
            id:               user.id,
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

    // Check if there was an error during the upsert operation
    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      )
    }

    // Return a success response
    return NextResponse.json({ message: "Profile saved!" }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }
}