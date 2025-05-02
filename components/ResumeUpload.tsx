// components/ResumeUpload.tsx

"use client"

import React, { useState } from "react"
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
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage("")

    // Build FormData
    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", userId)

    // Call your server-side route
    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    })
    const json = await res.json()

    if (json.error) {
      console.error("❌ Upload failed:", json.error)
      setMessage("Upload failed: " + json.error)
      setUploading(false)
      return
    }

    console.log("✅ Upload succeeded! Public URL:", json.publicUrl)
    setMessage("Upload successful!")

    if (onUploadSuccess) {
      onUploadSuccess(json.publicUrl)
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
      <Button type="button" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload PDF"}
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}
