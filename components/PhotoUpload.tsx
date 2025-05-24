// components/PhotoUpload.tsx

"use client"

import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

interface PhotoUploadProps {
  userId: string
  onUploadSuccess: (url: string) => void
}

export default function PhotoUpload({ userId, onUploadSuccess }: PhotoUploadProps) {
  const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const MAX_FILE_SIZE = 2 * 1024 * 1024     // 2 MB
  const MIN_FILE_SIZE = 10 * 1024           // 10 KB
  const MIN_WIDTH     = 100                 // px
  const MIN_HEIGHT    = 100                 // px

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      return setError("Photo must be smaller than 2 MB.")
    }
    if (file.size < MIN_FILE_SIZE) {
      return setError("Photo must be at least 10 KB.")
    }

    setUploading(true)
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.src = objectUrl

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)

      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setUploading(false)
        return setError(`Photo must be at least ${MIN_WIDTH}×${MIN_HEIGHT} pixels.`)
      }

      // Instead of calling storage.upload directly, send to our server route:
      const form = new FormData()
      form.append("file", file)
      form.append("userId", userId)

      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: form,
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Upload failed")
        setUploading(false)
        return
      }
      const signedUrl = json.signedUrl

      // Write that signed URL into profiles.photo_url
      const { error: dbError } = await supabase
        .from("profiles")
        .update({ photo_url: signedUrl })
        .eq("user_id", userId)

      if (dbError) {
        setError(dbError.message)
      } else {
        onUploadSuccess(signedUrl)
      }

      setUploading(false)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      setUploading(false)
      setError("Failed to read image. Please try a different file.")
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Upload Profile Photo
      </label>
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
