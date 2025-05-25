// app/profiles/[id]/edit/page.tsx
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { notFound, redirect } from "next/navigation"
import EditProfileForm, { ProfileData } from "@/components/EditProfileForm"

export const dynamic = "force-dynamic"

interface Props {
  params: { id: string }
}

export default async function EditProfilePage({ params }: Props) {
  const cookieStore = cookies()
  const userId = params.id

  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }
  if (session.user.id !== userId) {
    redirect("/")
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select(
      "full_name,slug,photo_url,graduation_year,title,employer,location,linkedin_url,website_url,resume_url,about"
    )
    .eq("user_id", userId)
    .single()

  if (error || !profile) {
    return notFound()
  }

  const initialProfile: ProfileData = {
    full_name:       profile.full_name,
    slug:            profile.slug,
    photo_url:       profile.photo_url,
    graduation_year: profile.graduation_year,
    title:           profile.title,
    employer:        profile.employer,
    location:        profile.location,
    linkedin_url:    profile.linkedin_url,
    website_url:     profile.website_url,
    resume_url:      profile.resume_url,
    about:           profile.about,
  }

  return <EditProfileForm userId={userId} initialProfile={initialProfile} />
}
