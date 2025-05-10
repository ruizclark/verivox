"use client"

import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"

interface PhotoUploadProps {
  userId: string
  onUploadSuccess: (url: string) => void
}

export default function PhotoUpload({ userId, onUploadSuccess }: PhotoUploadProps) {
  const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 📏 NEW: define your constraints
  const MAX_FILE_SIZE = 2 * 1024 * 1024     // 2 MB
  const MIN_FILE_SIZE = 10 * 1024           // 10 KB (optional)
  const MIN_WIDTH     = 100                 // pixels
  const MIN_HEIGHT    = 100                 // pixels

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // EDIT: reject by file size
    if (file.size > MAX_FILE_SIZE) {
      return setError("Photo must be smaller than 2 MB.")
    }
    if (file.size < MIN_FILE_SIZE) {
      return setError("Photo must be at least 10 KB.")
    }

    setUploading(true)

    // NEW: check image dimensions before uploading
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.src = objectUrl
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)

      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setUploading(false)
        return setError(`Photo must be at least ${MIN_WIDTH}×${MIN_HEIGHT} pixels.`)
      }

      // If we pass all checks, proceed with uploading
      const ext = file.name.split(".").pop()
      const fileName = `${userId}.${ext}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase
        .storage
        .from("photos")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase
        .storage
        .from("photos")
        .getPublicUrl(filePath)

      onUploadSuccess(data.publicUrl)
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
      <label className="block text-sm font-medium mb-1">Upload Photo</label>
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
