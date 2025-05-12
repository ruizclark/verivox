// app/api/upload-resume/route.ts

// This route handles the upload of resumes to Supabase storage.
import { NextResponse } from "next/server"
// Importing the Supabase client for server-side operations
import { supabaseAdmin } from "@/lib/supabase/admin"

// Exporting the config for the API route
export const config = {
  api: {
    bodyParser: false, // we’ll parse a FormData stream
  },
}

// Quick GET to confirm the route exists
export async function GET() {
  return NextResponse.json({ message: "upload-resume route is live" })
}

// POST request handler for uploading resumes
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    const userId = form.get("userId")

    // Check if the file and userId are valid
    if (!(file instanceof File) || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    // Check if the file is a valid PDF
    const path = `${userId}/${file.name}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(path, file, { upsert: true, contentType: file.type })

    // Check for upload errors
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("resumes").getPublicUrl(path)

    // Check if the public URL is valid
    return NextResponse.json({ publicUrl })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
