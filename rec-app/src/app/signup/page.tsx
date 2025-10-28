'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// importing google font for logo/brand name
import { Luckiest_Guy } from 'next/font/google'

const logo_font = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
})

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSignUp = async () => {
    setLoading(true)
    
    // signing up user and adding to authentication table
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
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
        toast.error("Something went wrong during signup. Please try again.")
        setLoading(false)
        return
      }
    }

    toast.success("Sign up successful!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    })
    setTimeout(() => {
        router.push('/login')
      }, 1000)
    setLoading(false)
  }

  const handleGoogleSignUp = async() => {
    // const redirectTo = process.env.NODE_ENV === 'development'
    // ? 'http://localhost:3000/dashboard'
    // : 'https://yourdomain.com/dashboard';
    const redirectTo = 'https://www.recoards.com/dashboard'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      console.error('Error during Google sign-in:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[hsl(28,10%,92%)] px-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col items-center"
      >
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1
            className={`${logo_font.className} text-5xl tracking-tight text-[hsl(28,50%,50%)] drop-shadow-sm`}
          >
            Recoards
          </h1>
        </Link>
        <p className="text-sm text-[hsl(28,12%,35%)] mt-2">
          Your personalized recommendation board
        </p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-[hsl(28,20%,95%)] p-8 shadow-lg"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-[hsl(28,25%,15%)] mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Create Your Account
          </motion.h1>
          <motion.p 
            className="text-[hsl(28,22%,35%)]"
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
            <label htmlFor="email" className="block text-sm font-medium text-[hsl(28,24%,25%)] mb-1">
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
            <label htmlFor="password" className="block text-sm font-medium text-[hsl(28,24%,25%)] mb-1">
              <span className="inline-flex items-center">
                Password
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center ml-1 w-4 h-4 rounded-full transition-colors cursor-help"
                    >
                      <Info size={13} className="text-gray-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="max-w-xs bg-gray-900 text-white border-gray-700 shadow-xl"
                  >
                    <div className="space-y-2">
                      <p className="font-medium">Password Requirements:</p>
                      <ul className="text-xs space-y-1 text-gray-200">
                        <li>• At least 8 characters long</li>
                        <li>• One uppercase letter (A-Z)</li>
                        <li>• One lowercase letter (a-z)</li>
                        <li>• One digit (0-9)</li>
                        <li>• One special symbol (!@#$%^&*)</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </span>
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
              className="w-full bg-[hsl(28,70%,50%)] hover:bg-[hsl(28,70%,55%)] text-[hsl(28,20%,15%)] py-5 text-base font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </motion.div>
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

        {/* Google Sign-In Button */}
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }} 
        whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-5 text-base font-medium bg-[hsl(28,20%,95%)] hover:bg-[hsl(28,20%,92%)] transition-colors cursor-pointer"
            onClick={handleGoogleSignUp}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="mr-2">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
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