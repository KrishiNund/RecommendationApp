'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


export default function LoginPage(){
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleLogIn = async () => {
        setLoading(true)
        setError('')
        setSuccess(false)

        // signs in user with the email and password input
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        }
        
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-20 p-4">
            <h1 className="text-xl font-bold text-center">Log In To Your Account</h1>
            
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            {/* temporaily disables the button when it is clicked */}
            <Button onClick={handleLogIn} disabled={loading}>
                {loading ? 'Authenticating account...' : 'Log In'}
            </Button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Login Successful!</p>}
        </div>
    )
}