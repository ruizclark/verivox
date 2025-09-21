import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

async function removeFolder(bucket: string, userId: string) {
  // List all objects under the user's folder and remove them
  const { data: list, error: listErr } = await supabaseAdmin.storage.from(bucket).list(userId, {
    limit: 1000,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  })
  if (listErr) return // best-effort cleanup; don't block rejection

  if (!list || list.length === 0) return
  const paths = list.map((obj) => `${userId}/${obj.name}`)
  await supabaseAdmin.storage.from(bucket).remove(paths)
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    // 1) Best-effort: delete uploads in 'resumes' and 'photos'
    await Promise.all([
      removeFolder("resumes", id),
      removeFolder("photos", id),
    ])

    // 2) Delete profile row(s)
    const { error: profErr } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", id)
    if (profErr) {
      // If profile delete fails, still attempt to delete the auth user
      console.error("Profile delete error:", profErr.message)
    }

    // 3) Delete the auth user (requires service role)
    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Reject failed" }, { status: 500 })
  }
}
