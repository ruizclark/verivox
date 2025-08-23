// app/api/delete-account/route.ts
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST() {
  const authClient = createRouteHandlerClient({ cookies })
  const {
    data: { session },
    error: sessionError,
  } = await authClient.auth.getSession()

  const user = session?.user
  if (sessionError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to delete your account." },
      { status: 401 }
    )
  }

  // 1) Delete articles by this user
  const { error: articlesErr } = await supabaseAdmin
    .from("articles")
    .delete()
    .eq("author_id", user.id)
  if (articlesErr) {
    return NextResponse.json({ error: articlesErr.message }, { status: 500 })
  }

  // 2) Delete profile row
  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("user_id", user.id)
  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 })
  }

  // 3) Delete auth user
  const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Account deleted." }, { status: 200 })
}
