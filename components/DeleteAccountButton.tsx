// components/DeleteAccountButton.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function DeleteAccountButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const handleDelete = async () => {
    setErrorMsg("")

    const confirm = window.confirm(
      "By clicking delete, all data (including previously published articles and information in your profile) will be erased. Once deleted, it will not be possible to restore or recover this data.\n\nAre you sure you want to continue?"
    )
    if (!confirm) return

    setLoading(true)
    const res = await fetch("/api/delete-account", { method: "POST" })
    setLoading(false)

    if (!res.ok) {
      const json = await res.json().catch(() => ({} as any))
      setErrorMsg(json?.error || "Failed to delete account.")
      return
    }

    // Clear local auth state and go home
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    // ✅ Added mb-16 to create space between this box and the footer
    <div className="mt-12 mb-16 border rounded-md p-6">
      {/* Small header */}
      <h2 className="text-lg font-semibold text-red-700 mb-2">
        Want to delete your profile?
      </h2>

      <p className="text-sm text-red-700 mb-3">
        <strong>Warning:</strong> By clicking delete, all data (including
        previously published articles and information in your profile) will be
        erased. Once deleted, it will not be possible to restore or recover this
        data.
      </p>

      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      {/* Red button using site color */}
      <Button
        onClick={handleDelete}
        disabled={loading}
        className="w-full bg-harvard-crimson text-white hover:bg-harvard-crimson/90"
      >
        {loading ? "Deleting…" : "Delete My Profile"}
      </Button>
    </div>
  )
}
