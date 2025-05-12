// app/api/approve/route.ts

import { NextResponse } from "next/server"
// Import the admin client initialized with your service-role key
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    // Read the JSON body to extract the `id` field
    const { id } = await req.json()

    // If no ID was provided, return a 400 Bad Request
    if (!id) {
      return NextResponse.json(
        { error: "Missing profile ID" },
        { status: 400 }
      )
    }

    // Use the admin client to update the profiles table
    const { error } = await supabaseAdmin
      .from("profiles")
      // set approved = true
      .update({ approved: true })  
      // where id matches the one we received
      .eq("id", id)                

    // If the update failed, return a 500 with the error message
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // On success, return a simple 200 OK
    return NextResponse.json(
      { message: "Profile approved" },
      { status: 200 }
    )
  
  // Catch any errors that occur during the process
  } catch (err) {
    // If parsing JSON or anything else throws, return a 400
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
