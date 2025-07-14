'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetPassword`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your inbox for a password reset link.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f9f6f1] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <Mail className="text-[#bc6c25]" />
          <h2 className="text-2xl font-bold text-gray-800">
            Forgot your password?
          </h2>
        </div>

        <p className="text-sm text-gray-600">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-[#d4a373] focus:border-[#d4a373]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#bc6c25] hover:bg-[#a65e20] cursor-pointer"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        {message && (
          <p className="text-sm text-green-600 text-center transition-all duration-200">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 text-center transition-all duration-200">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
