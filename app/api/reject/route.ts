// app/api/reject/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const authClient = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { session } } = await authClient.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin
    const { data: adminCheck, error: adminErr } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()

    if (adminErr || !adminCheck?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Delete profile row (ok if none)
    const { error: profileDelErr } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("user_id", userId)

    if (profileDelErr) {
      // Not fatal, but surface it to help debug
      console.warn("Profile delete warning:", profileDelErr.message)
    }

    // Delete auth user
    const { error: userDelErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (userDelErr) {
      return NextResponse.json({ error: userDelErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 })
  }
}
