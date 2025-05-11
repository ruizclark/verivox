// components/ResumeUpload.tsx

"use client"

import React, { useState } from "react"
// — use the shared Supabase client
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ResumeUploadProps {
  userId: string
  onUploadSuccess?: (url: string) => void
}

export default function ResumeUpload({
  userId,
  onUploadSuccess,
}: ResumeUploadProps) {
  const supabase = useSupabaseClient()  // shared instance
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage("")

    // Build a unique path for the file
    const path = `${userId}/${Date.now()}-${file.name}`

    // 1️⃣ Upload the file
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("❌ Upload failed:", uploadError.message)
      setMessage("Upload failed: " + uploadError.message)
      setUploading(false)
      return
    }

    // 2️⃣ Retrieve the public URL
    // — getPublicUrl returns only `{ data: { publicUrl: string } }`
    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(path)

    const publicUrl = urlData.publicUrl
    console.log("✅ Upload succeeded! Public URL:", publicUrl)
    setMessage("Upload successful!")

    // 3️⃣ Notify parent
    if (onUploadSuccess) {
      onUploadSuccess(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
