// app/api/upload-resume/route.ts

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const config = {
  api: {
    bodyParser: false, // we’ll parse a FormData stream
  },
}

// Quick GET to confirm the route exists
export async function GET() {
  return NextResponse.json({ message: "upload-resume route is live" })
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    const userId = form.get("userId")

    if (!(file instanceof File) || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    const path = `${userId}/${file.name}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("resumes").getPublicUrl(path)

    return NextResponse.json({ publicUrl })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
