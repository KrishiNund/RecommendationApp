'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { EyeOff, Eye } from 'lucide-react'

// importing google font for logo/brand name
import { Bebas_Neue } from 'next/font/google'

const logo_font = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
})

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogIn = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

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
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f5ebe1] px-4">
      {/* logo */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col items-center"
      >
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1
            className={`${logo_font.className} text-5xl tracking-wide text-[#bc6c25] drop-shadow-sm`}
          >
            RecThis
          </h1>
        </Link>
        <p className="text-sm text-gray-600 mt-2">
          Your personalized recommendation board
        </p>
      </motion.header>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Log in to access your recommendation boards
          </motion.p>
        </div>

        <motion.div 
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-2 focus:ring-[#d4a373] focus:border-[#d4a373]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                href="/forgotPassword"
                className="text-xs text-[#bc6c25] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 focus:ring-2 focus:ring-[#d4a373] focus:border-[#d4a373]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full bg-[#bc6c25] hover:bg-[#a05a1f] text-white py-5 text-base font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={handleLogIn}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : 'Log in'}
            </Button>
          </motion.div>

          {error && (
            <motion.p 
              className="text-sm text-red-500 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p 
              className="text-sm text-green-600 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Login successful! Redirecting...
            </motion.p>
          )}

          <motion.div 
            className="my-6 flex items-center justify-center gap-4 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <hr className="flex-grow border-gray-200" />
            OR
            <hr className="flex-grow border-gray-200" />
          </motion.div>
        </motion.div>

        <motion.p 
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="cursor-pointer text-[#bc6c25] hover:underline font-medium"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}