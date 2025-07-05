'use client'

import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Skeleton } from '../../components/ui/skeleton'
import { Button } from '../../components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, LogIn, UserPlus } from 'lucide-react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 px-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (user) {
    return <>{children}</>
  } else {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="max-w-md space-y-6">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center rounded-full bg-red-50 p-4"
          >
            <Lock className="h-8 w-8 text-red-500" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Restricted Content
          </h1>
          
          <p className="text-gray-600 text-lg">
            You need to be signed in to access this page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 bg-[#bc6c25] hover:bg-[#a05a1f] shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/signup')}
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }
}
