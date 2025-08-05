"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, Star, Heart, ListChecks } from "lucide-react"
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export default function Hero() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user || null;
      setUser(currentUser);

      setIsLoading(false);
    };

      getCurrentUser(); // run once on mount
  }, [])

  return (
    <section className="relative px-4 py-20 sm:py-28 w-full h-screen overflow-hidden bg-white bg-[url(/textures/texture.png)]">

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-7"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#bc6c25]/10 text-[#bc6c25] rounded-full border border-amber-100 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Share what you love</span>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Personal <span className="text-[#bc6c25]">Recommendation</span> Hub
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto mb-10 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create and share beautiful boards for anything you love—anime, games, music, movies, and more.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* <Link href="/signup" className="block">
              {(!user && !isLoading) && (
                <Button
                  size="lg"
                  className="bg-[#bc6c25] hover:bg-[#a05a1f] text-white px-8 py-5 text-base shadow-lg hover:shadow-xl rounded-xl font-semibold cursor-pointer"
                >
                  Start for free
                </Button>
              )}
            </Link> */}
            {isLoading ? (
              // Skeleton while loading
              <div className="mt-8 space-y-4 animate-pulse text-center">
                <div className="h-8 w-60 mx-auto rounded-md bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-72 mx-auto rounded-md bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-10 w-44 mx-auto rounded-xl bg-zinc-300 dark:bg-zinc-600" />
              </div>
            ) : user ? (
              // Logged-in welcome
              <motion.div
                className="mt-8 text-center space-y-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div>
                  <Link href="/dashboard">
                    <button className="bg-[#bc6c25] text-white px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-medium hover:bg-[#a3581e] shadow-lg cursor-pointer">
                      Go to Your Boards →
                    </button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              // Default "Start for free" CTA
              <Link href="/signup">
                <button className="bg-[#bc6c25] text-white px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-medium hover:bg-[#a3581e] shadow-lg transition cursor-pointer">
                  Start for free
                </button>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Benefit points with icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-base text-gray-600"
        >
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#bc6c25" d="M21.775 18.925L20 17.15V12h-5.15l-4-4H20V6H8.85l-2-2H20q.825 0 1.413.588T22 6v12q0 .25-.05.488t-.175.437M9.15 
              12H4v6h11.15zM4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4l2 2H4v2h1.15l-3.8-3.8q-.3-.3-.3-.712t.3-.713t.713-.3t.712.3l18.4 
              18.4q.3.3.3.7t-.3.7t-.712.3t-.713-.3L17.15 20z" />
            </svg>
            <span>No credit card needed</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#bc6c25" d="M7.1 11.35q.35-.7.725-1.35t.825-1.3l-1.4-.275l-2.1 2.1zm12.05-6.875q-1.75.05-3.737 
              1.025T11.8 8.1q-1.05 1.05-1.875 2.25T8.7 12.6l2.85 2.825q1.05-.4 2.25-1.225t2.25-1.875q1.625-1.625 2.6-3.6T19.675 5q0-.1-.038-.2t-.112-.175t-.175-.112t-.2-.038m-5.5 
              6q-.575-.575-.575-1.412t.575-1.413t1.425-.575t1.425.575t.575 1.413t-.575 1.412t-1.425.575t-1.425-.575m-.85 6.55L13.625 
              19l2.1-2.1l-.275-1.4q-.65.45-1.3.813t-1.35.712m8.775-13.35q.2 2.75-.9 5.363T17.2 14.025l.5 2.475q.1.5-.05.975t-.5.825L14 21.45q-.375.375-.9.288t-.725-.588l-1.525-3.575L6.575 
              13.3L3 11.775q-.5-.2-.6-.725t.275-.9L5.825 7q.35-.35.837-.5t.988-.05l2.475.5q2.375-2.375 4.988-3.475t5.362-.9q.2.025.4.113t.35.237t.238.35t.112.4m-17.65 
              12.3q.875-.875 2.138-.887t2.137.862t.863 2.138t-.888 2.137q-1.2 1.2-2.838 1.425t-3.287.45l.45-3.287q.225-1.637 1.425-2.838m1.425 1.4q-.425.425-.587 
              1.025T4.5 19.625q.625-.1 1.225-.25T6.75 18.8q.3-.3.325-.725T6.8 17.35t-.725-.288t-.725.313" />
            </svg>
            <span>Create your board in seconds</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#bc6c25" d="M17 22q-1.25 0-2.125-.875T14 19q0-.15.075-.7L7.05 14.2q-.4.375-.925.588T5 15q-1.25 0-2.125-.875T2 
              12t.875-2.125T5 9q.6 0 1.125.213t.925.587l7.025-4.1q-.05-.175-.062-.337T14 5q0-1.25.875-2.125T17 2t2.125.875T20 5t-.875 2.125T17 8q-.6 
              0-1.125-.213T14.95 7.2l-7.025 4.1q.05.175.063.338T8 12t-.012.363t-.063.337l7.025 4.1q.4-.375.925-.587T17 16q1.25 0 2.125.875T20 19t-.875 2.125T17 
              22m0-2q.425 0 .713-.287T18 19t-.288-.712T17 18t-.712.288T16 19t.288.713T17 20M5 13q.425 0 .713-.288T6 12t-.288-.712T5 11t-.712.288T4 12t.288.713T5 
              13m12-7q.425 0 .713-.288T18 5t-.288-.712T17 4t-.712.288T16 5t.288.713T17 6m0-1" />
            </svg>
            <span>Share with friends</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}