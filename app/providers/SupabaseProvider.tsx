"use client"

// This file is used to create a Supabase client and provide it to the app
import { ReactNode, useState, useEffect } from "react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import {
  SessionContextProvider,
  type Session
} from "@supabase/auth-helpers-react"

// 1) Create exactly one Supabase client and hold it in state
export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  // 2) Load the initial session so that hooks below know about it immediately
  const [initialSession, setInitialSession] = useState<Session | null | undefined>(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setInitialSession(data.session)
    })
  }, [supabase])

  // 3) Don’t render children until we know the initial session
  if (initialSession === undefined) {
    return <div className="p-8 text-center">Loading auth…</div>
  }

  // 4) Wrap the rest of the app in the official SessionContextProvider
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  )
}
