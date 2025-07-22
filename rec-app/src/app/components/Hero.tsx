"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, Star, Heart, ListChecks } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative px-4 py-20 sm:py-28 w-full overflow-hidden bg-white">

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
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">Share what you love</span>
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
            <Link href="/signup" className="block">
              <Button
                size="lg"
                className="bg-[#bc6c25] hover:bg-[#a05a1f] text-white px-8 py-5 text-base shadow-lg hover:shadow-xl rounded-xl font-semibold cursor-pointer"
              >
                Start for free
              </Button>
            </Link>
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
            <Star className="w-5 h-5 text-yellow-400" />
            <span>No credit card needed</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ListChecks className="w-5 h-5 text-[#bc6c25]" />
            <span>Easy to use</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span>Share with friends</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}