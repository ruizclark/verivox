// components/PhotoUpload.tsx

// NOTE: This component is not yet functional. It is a work in progress.
"use client"

// Import { useEffect } from "react"
import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"

// import { useSupabase } from "@/lib/supabaseClient"
interface PhotoUploadProps {
  userId: string
  onUploadSuccess: (url: string) => void
}

// interface PhotoUploadProps
export default function PhotoUpload({ userId, onUploadSuccess }: PhotoUploadProps) {
  const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Define your constraints
  const MAX_FILE_SIZE = 2 * 1024 * 1024     // 2 MB
  const MIN_FILE_SIZE = 10 * 1024           // 10 KB (optional)
  const MIN_WIDTH     = 100                 // pixels
  const MIN_HEIGHT    = 100                 // pixels

  // Constraints for image dimensions
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // Reject by file size
    if (file.size > MAX_FILE_SIZE) {
      return setError("Photo must be smaller than 2 MB.")
    }
    // Reject by file type
    if (file.size < MIN_FILE_SIZE) {
      return setError("Photo must be at least 10 KB.")
    }

    setUploading(true)

    // Check image dimensions before uploading
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.src = objectUrl
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)

      // Check image dimensions
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setUploading(false)
        return setError(`Photo must be at least ${MIN_WIDTH}×${MIN_HEIGHT} pixels.`)
      }

      // If we pass all checks, proceed with uploading
      const ext = file.name.split(".").pop()
      const fileName = `${userId}.${ext}`
      const filePath = `${userId}/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from("photos")
        .upload(filePath, file, { upsert: true })

      // Check for upload errors
      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      // Create a signed URL for the uploaded file
      const { data, error: urlError } = await supabase
        .storage
        .from("photos")
        .createSignedUrl(filePath, 60)  // URL valid for 60 seconds

      // Check for URL errors
      if (urlError) {
        setError(urlError.message)
      } else {
        onUploadSuccess(data.signedUrl)
      }

      // Clean up
      setUploading(false)
    }

    // Handle image loading error
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      setUploading(false)
      setError("Failed to read image. Please try a different file.")
    }
  }

  // useEffect(() => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Upload Photo (Coming Soon -- Not Yet Functional)</label>
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={handleFileChange}
      />
      {uploading && <p className="text-sm">Uploading photo…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
