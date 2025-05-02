// app/profiles/page.tsx

import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase/admin"

// Tell TypeScript what a profile row looks like
type Profile = {
  id: string
  full_name: string
  resume_url: string | null
}

export default async function ProfilesPage() {
  // 1. Fetch only approved profiles using the service-role client
  const { data: profiles, error } = await supabaseAdmin
    .from<Profile>("profiles")
    .select("id, full_name, resume_url")
    .eq("approved", true)

  // 2. Handle errors or empty state
  if (error) {
    return (
      <p className="text-red-500">
        Error loading profiles: {error.message}
      </p>
    )
  }
  if (!profiles || profiles.length === 0) {
    return <p>No profiles are approved yet.</p>
  }

  // 3. Render your approved profiles
  return (
    <div className="grid gap-6">
      {profiles.map((p) => (
        <div
          key={p.id}
          className="p-4 border rounded-lg hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">{p.full_name}</h2>
          {p.resume_url && (
            <a
              href={p.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Résumé
            </a>
          )}
          <p className="mt-2">
            <Link
              href={`/profiles/${p.id}`}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              View full profile →
            </Link>
          </p>
        </div>
      ))}
    </div>
  )
}
