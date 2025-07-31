'use client'

import { motion } from "framer-motion"
import { LayoutGrid, Star, ListChecks, Share2, Sparkles } from "lucide-react"

const features = [
  {
    icon: <LayoutGrid className="w-8 h-8 text-[#bc6c25]" />,
    title: "Pretty Recommendation Cards",
    desc: "Display your recommendations with clean, elegant cards that look great at a glance."
  },  
  {
    icon: <Star className="w-8 h-8 text-[#bc6c25]" />, // Personal Ratings & Comments
    title: "Personal Ratings & Comments",
    desc: "Add your own ratings and comments to each recommendation."
  },
  {
    icon: <ListChecks className="w-8 h-8 text-[#bc6c25]" />, // Unlimited Recommendations
    title: "Unlimited Recommendations",
    desc: "Add as many recommendations as you want to each board."
  },
  {
    icon: <Share2 className="w-8 h-8 text-[#bc6c25]" />, // Easy Sharing
    title: "Easy Sharing",
    desc: "Share your boards instantly with a public link."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-[#bc6c25]" />, // Modern, Clean Design
    title: "Modern, Clean Design",
    desc: "Enjoy a user-friendly, aesthetic layout for every list."
  }
]

export default function Features() {
  return (
    <section className="relative py-28 bg-white overflow-hidden" id="features">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="fmesh1" cx="30%" cy="30%" r="70%" gradientTransform="rotate(10)">
              <stop offset="0%" stopColor="#f5ebe1" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#faedcd" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fmesh2" cx="80%" cy="80%" r="60%" gradientTransform="rotate(-10)">
              <stop offset="0%" stopColor="#bc6c25" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1440" height="600" fill="url(#fmesh1)" />
          <rect width="1440" height="600" fill="url(#fmesh2)" />
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <span className="inline-block bg-[#bc6c25]/10 text-[#bc6c25] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Features
        </span>
        {/* Section Title */}
        <motion.h2 
          className="text-4xl font-bold text-gray-900 mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Built for Sharing Recommendations
        </motion.h2>

        {/* Optional subheading */}
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Whether it's anime, games, music, or movies — Recoards helps you create interactive, shareable lists that look great and feel personal.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.slice(0, 3).map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/90 border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.04 }}
            >
              <div className="mb-5 drop-shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
        {/* Center last two features on a new row */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-8">
          {features.slice(3).map((feature, i) => (
            <motion.div
              key={i + 3}
              className="bg-white/90 border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center backdrop-blur-sm w-full max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i + 3) * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.04 }}
            >
              <div className="mb-5 drop-shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
