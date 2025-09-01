// components/ResumeUpload.tsx

"use client"

import React, { useState } from "react"
// (removed) import { useSupabaseClient } from "@supabase/auth-helpers-react"
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
  // (removed) const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage("")

    try {
      const form = new FormData()
      form.append("file", file)
      form.append("userId", userId)

      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: form,
      })

      const json = await res.json()

      if (!res.ok) {
        setMessage("Upload failed: " + (json?.error || "Unknown error"))
        setUploading(false)
        return
      }

      const publicUrl = json.publicUrl as string
      setMessage("Upload successful!")
      onUploadSuccess?.(publicUrl)
    } catch {
      setMessage("Upload failed: network error")
    } finally {
      setUploading(false)
    }
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
