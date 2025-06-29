// hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'


export function useAuth() {
    const [user, setUser] = useState<User | null | undefined>(undefined)

    // Checking if user is logged in
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user ?? null)
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
