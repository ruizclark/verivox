// components/ResumeUpload.tsx

"use client"

import React, { useState } from "react"
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
  const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage("")

    // ✅ Minimal guard: ensure we have the signed-in user and use their UID for the path
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage("Upload failed: not authenticated.")
      setUploading(false)
      return
    }

    // IMPORTANT: path must start with auth.uid() to satisfy your RLS policy
    const path = `${user.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Upload failed:", uploadError.message)
      setMessage("Upload failed: " + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(path)
    const publicUrl = urlData.publicUrl

    setMessage("Upload successful!")
    onUploadSuccess?.(publicUrl)
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
