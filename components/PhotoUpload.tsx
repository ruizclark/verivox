// File: components/PhotoUpload.tsx
"use client"

import React, { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"

interface PhotoUploadProps {
  userId: string
  onUploadSuccess: (url: string) => void
  bucket?: string                         // ✅ allow specifying upload bucket
}

export default function PhotoUpload({
  userId,
  onUploadSuccess,
  bucket = "photos",                     // ✅ default to 'photos' bucket
}: PhotoUploadProps) {
  const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 📏 Constraints unchanged
  const MAX_FILE_SIZE = 5 * 1024 * 1024     // 5 MB
  const MIN_FILE_SIZE = 10 * 1024           // 10 KB
  const MIN_WIDTH     = 2560                // YouTube banner width
  const MIN_HEIGHT    = 1440                // YouTube banner height

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // size checks (unchanged)
    if (file.size > MAX_FILE_SIZE) {
      return setError("Image must be smaller than 5 MB.")
    }
    if (file.size < MIN_FILE_SIZE) {
      return setError("Photo must be at least 10 KB.")
    }

    setUploading(true)

    // dimension check (unchanged)
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.src = objectUrl
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)

      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        setUploading(false)
        return setError(
          `Image must be at least ${MIN_WIDTH}×${MIN_HEIGHT}px (16:9 ratio).`
        )
      }

      // 🚀 Upload file
      const ext = file.name.split(".").pop()
      const fileName = `${userId}.${ext}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase
        .storage
        .from(bucket)                        // ✅ use dynamic bucket
        .upload(filePath, file, { upsert: true })

      console.log("PhotoUpload uploadError:", uploadError)  // ✅ DEBUG: inspect upload error
      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      // 🗂 Fetch Supabase’s URL
      const { data } = supabase
        .storage
        .from(bucket)                        // ✅ use dynamic bucket
        .getPublicUrl(filePath)

      console.log("PhotoUpload getPublicUrl data:", data)  // ✅ DEBUG: inspect public URL data

      // ✅ Ensure we use the “public” path to bypass RLS on GET
      let publicUrl = data.publicUrl
      if (!publicUrl.includes("/object/public/")) {
        publicUrl = publicUrl.replace(
          "/object/",
          "/object/public/"
        )
      }

      onUploadSuccess(publicUrl)
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
      <label className="block text-sm font-medium mb-1">Upload Image</label>
      <p className="text-xs text-muted-foreground mb-2">
        Recommended size: 2560 × 1440 px (16:9 ratio)
      </p>
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={handleFileChange}
      />
      {uploading && <p className="text-sm">Uploading image…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
