'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully! Redirecting to login...')
      setTimeout(() => router.push('/login'), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f6f1] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <Lock className="text-[#bc6c25]" />
          <h2 className="text-2xl font-bold text-gray-800">
            Reset Your Password
          </h2>
        </div>

        <p className="text-sm text-gray-600">
          Enter a new password to complete your reset.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-[#d4a373] focus:border-[#d4a373]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#bc6c25] hover:bg-[#a65e20]"
          >
            {loading ? 'Updating...' : 'Update Password'}
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
