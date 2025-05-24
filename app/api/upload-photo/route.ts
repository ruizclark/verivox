// app/api/upload-photo/route.ts

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const runtime = "edge"  // or "nodejs"

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file") as File
  const userId = form.get("userId") as string

  if (!file || !userId) {
    return NextResponse.json(
      { error: "Missing file or userId" },
      { status: 400 }
    )
  }

  const ext = file.name.split(".").pop()
  const fileName = `${userId}.${ext}`
  const filePath = `${userId}/${fileName}`

  // 1️⃣ Upload with service‐role key (bypasses storage RLS)
  const { error: uploadError } = await supabaseAdmin
    .storage
    .from("photos")
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    )
  }

  // 2️⃣ Get the permanent public URL (no error returned here)
  const { data: publicData } = supabaseAdmin
    .storage
    .from("photos")
    .getPublicUrl(filePath)

  if (!publicData?.publicUrl) {
    return NextResponse.json(
      { error: "Failed to get public URL" },
      { status: 500 }
    )
  }

  // 3️⃣ Return it
  return NextResponse.json(
    { signedUrl: publicData.publicUrl },
    { status: 200 }
  )
}
