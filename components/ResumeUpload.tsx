// components/ResumeUpload.tsx

// This component allows users to upload their resumes to Supabase Storage.
"use client"

// Use the shared Supabase client
import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Interface Props 
interface ResumeUploadProps {
  userId: string
  onUploadSuccess?: (url: string) => void
}

// Export the ResumeUpload component
export default function ResumeUpload({
  userId,
  onUploadSuccess,
}: ResumeUploadProps) {
  // Use the shared Supabase client
  const supabase = useSupabaseClient()  // shared instance
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  // Handle file change event
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if the file is a PDF
    setUploading(true)
    setMessage("")

    // Build a unique path for the file
    const path = `${userId}/${Date.now()}-${file.name}`

    // 1Upload the file
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    // Handle upload error
    if (uploadError) {
      console.error("Upload failed:", uploadError.message)
      setMessage("Upload failed: " + uploadError.message)
      setUploading(false)
      return
    }

    // Retrieve the public URL
    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(path)

    const publicUrl = urlData.publicUrl
    console.log("Upload succeeded! Public URL:", publicUrl)
    setMessage("Upload successful!")

    // Notify parent
    if (onUploadSuccess) {
      onUploadSuccess(publicUrl)
    }

    setUploading(false)
  }

  // Render the component
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
