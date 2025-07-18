'use client'

import { easeOut, motion } from "framer-motion"
import { List, PlusCircle, Palette, Move, Share2, CheckCircle2 } from "lucide-react"

const features = [
  {
    icon: <List className="w-8 h-8 text-[#bc6c25]" />, // Create Custom Boards
    title: "Create Custom Boards",
    desc: "Organize your recommendations into themed lists like 'Top Anime' or 'Favorite Indie Games'."
  },
  {
    icon: <PlusCircle className="w-8 h-8 text-[#a05a1f]" />, // Add Items Easily
    title: "Add Items Easily",
    desc: "Add titles with images, links, and short notes — all under your creative control."
  },
  {
    icon: <Palette className="w-8 h-8 text-[#f59e42]" />, // Choose a Style
    title: "Choose a Style",
    desc: "Personalize each board with minimalist themes and color palettes that suit your vibe."
  },
  {
    icon: <Move className="w-8 h-8 text-[#bc6c25]" />, // Drag & Reorder
    title: "Drag & Reorder",
    desc: "Effortlessly reorder items to highlight what matters most to you."
  },
  {
    icon: <Share2 className="w-8 h-8 text-[#a05a1f]" />, // Share Your Board
    title: "Share Your Board",
    desc: "Generate a public link to share your curated list with anyone — no login needed."
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-green-500" />, // Interactive Viewer Mode
    title: "Interactive Viewer Mode",
    desc: "Let others tick off what they’ve already seen — and discover what’s next."
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
      <div className="max-w-6xl mx-auto px-6 relative z-10">
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
          Whether it's anime, games, music, or movies — Recco helps you create interactive, shareable lists that look great and feel personal.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
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
      </div>
    </section>
  )
}
