// app/api/approve/route.ts

import { NextResponse } from "next/server"
// 1️⃣ Import the admin client initialized with your service-role key
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    // 2️⃣ Read the JSON body to extract the `id` field
    const { id } = await req.json()

    // 3️⃣ If no ID was provided, return a 400 Bad Request
    if (!id) {
      return NextResponse.json(
        { error: "Missing profile ID" },
        { status: 400 }
      )
    }

    // 4️⃣ Use the admin client to update the profiles table
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ approved: true })  // set approved = true
      .eq("id", id)                // where id matches the one we received

    // 5️⃣ If the update failed, return a 500 with the error message
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // 6️⃣ On success, return a simple 200 OK
    return NextResponse.json(
      { message: "Profile approved" },
      { status: 200 }
    )

  } catch (err) {
    // If parsing JSON or anything else throws, return a 400
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
