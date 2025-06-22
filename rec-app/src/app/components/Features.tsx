'use client'

import { motion } from "framer-motion"

const features = [
  {
    icon: "📝",
    title: "Create Custom Boards",
    desc: "Organize your recommendations into themed lists like 'Top Anime' or 'Favorite Indie Games'."
  },
  {
    icon: "➕",
    title: "Add Items Easily",
    desc: "Add titles with images, links, and short notes — all under your creative control."
  },
  {
    icon: "🎨",
    title: "Choose a Style",
    desc: "Personalize each board with minimalist themes and color palettes that suit your vibe."
  },
  {
    icon: "🪄",
    title: "Drag & Reorder",
    desc: "Effortlessly reorder items to highlight what matters most to you."
  },
  {
    icon: "🔗",
    title: "Share Your Board",
    desc: "Generate a public link to share your curated list with anyone — no login needed."
  },
  {
    icon: "✅",
    title: "Interactive Viewer Mode",
    desc: "Let others tick off what they’ve already seen — and discover what’s next."
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <motion.h2 
          className="text-4xl font-bold text-gray-900 mb-4 text-left md:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Built for Sharing Recommendations
        </motion.h2>

        {/* Optional subheading */}
        <motion.p
          className="text-md text-gray-600 max-w-2xl mx-auto mb-12 text-left md:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Whether it's anime, games, music, or movies — Recco helps you create interactive, shareable lists that look great and feel personal.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
