'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.warn("Auth check error:", error.message)
          setUser(null)
        } else {
          setUser(data.user ?? null)
        }
      } catch (err) {
        console.error("Unexpected auth check error:", err)
        setUser(null)
      }
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  return {
    user,
    isLoading: user === undefined,
  }
}
