'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
// importing google font for logo/brand name
import { Bebas_Neue } from 'next/font/google'

const logo_font = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
})

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const handleSignUp = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)
    
    // signing up user and adding to authentication table
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      toast.error("Something went wrong during signup. Please try again.")
      setLoading(false)
      return
    }

    //adding user to users table (public)
    const user = data.user
    if (user) {
      const {error: insertError} = await supabase.from('users').insert(
        {
          id: user.id,
          plan: "free"
        }
      )

      if(insertError){
        console.error('Failed to insert into users table:', insertError)
        setError('Something went wrong during signup. Please try again.')
        toast.error("Something went wrong during signup. Please try again.")
        setLoading(false)
        return
      }
    }
    
    setSuccess(true)
    toast.success("Sign up successful!")
    setTimeout(() => {
        router.push('/login')
      }, 1000)
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f5ebe1] px-4">
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
            Create Your Account
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Start building your recommendation boards today
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
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pr-10 focus:ring-2 focus:ring-[#d4a373] focus:border-[#d4a373]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full bg-[#bc6c25] hover:bg-[#a05a1f] text-white py-5 text-base font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </motion.div>

          {/* {error && (
            <motion.p 
              className="text-sm text-red-500 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )} */}

          {/* {success && (
            <motion.p 
              className="text-sm text-green-600 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Check your email to confirm your account!
            </motion.p>
          )} */}
        </motion.div>

        {/* Divider */}
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

        <motion.p 
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="cursor-pointer text-[#bc6c25] hover:underline font-medium"
          >
            Log in
          </span>
        </motion.p>
      </motion.div>

    </div>
  )
}