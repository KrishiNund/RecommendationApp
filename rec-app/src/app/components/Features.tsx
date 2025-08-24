'use client'

import { motion } from "framer-motion"
import { LayoutGrid, Star, ListChecks, Share2, Sparkles } from "lucide-react"

const features = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="#bc6c25" 
      d="M11.19 2.25c-.26 0-.52.06-.77.15L3.06 5.45a1.994 1.994 0 0 0-1.09 2.6L6.93 20a2 2 0 0 0 1.81 1.25c.26 0 .53-.03.79-.15l7.37-3.05a2.02 2.02 0 0 0 
      1.23-1.8c.01-.25-.04-.54-.13-.8L13 3.5a1.95 1.95 0 0 0-1.81-1.25m3.48 0l3.45 8.35V4.25a2 2 0 0 0-2-2m4.01 1.54v9.03l2.43-5.86a1.99 1.99 0 
      0 0-1.09-2.6m-10.28-.14l4.98 12.02l-7.39 3.06L3.8 7.29"/>
    </svg>,
    title: "Pretty Recommendation Cards",
    desc: "Display your recommendations with clean, elegant cards that look great at a glance."
  },  
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="#bc6c25" 
      d="m12 12.475l1.9 1.15q.275.175.55-.012t.2-.513l-.5-2.175l1.7-1.475q.25-.225.15-.537t-.45-.338L13.325 8.4l-.875-2.05q-.125-.3-.45-.3t-.45.3l-.875 
      2.05l-2.225.175Q8.1 8.6 8 8.913t.15.537l1.7 1.475l-.5 2.175q-.075.325.2.513t.55.012zM6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 
      0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4z" />
    </svg>, // Personal Ratings & Comments
    title: "Personal Ratings & Comments",
    desc: "Add your own ratings and comments to each recommendation."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="#bc6c25" 
      d="M18.6 6.62C21.58 6.62 24 9 24 12c0 2.96-2.42 5.37-5.4 5.37c-1.45 0-2.8-.56-3.82-1.57L12 13.34l-2.83 2.51c-.97.97-2.33 1.53-3.77 
      1.53C2.42 17.38 0 14.96 0 12s2.42-5.38 5.4-5.38c1.44 0 2.8.56 3.82 1.58L12 10.66l2.83-2.51c.97-.97 2.33-1.53 3.77-1.53M7.8 14.39L10.5 
      12L7.84 9.65c-.68-.68-1.53-1.03-2.44-1.03C3.53 8.62 2 10.13 2 12s1.53 3.38 3.4 3.38c.91 0 1.76-.35 2.4-.99m8.4-4.78L13.5 12l2.66 2.35c.68.68 
      1.54 1.03 2.44 1.03c1.87 0 3.4-1.51 3.4-3.38s-1.53-3.38-3.4-3.38c-.91 0-1.76.35-2.4.99" />
    </svg>, // Unlimited Recommendations
    title: "Unlimited Recommendations (Pro)",
    desc: "Start with 20 and upgrade to Pro to add as many recommendations as you like to your boards."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="#bc6c25" 
      d="M5 20q-.825 0-1.412-.587T3 18V4q0-.825.588-1.412T5 2h14q.825 0 1.413.588T21 4v6q0 .425-.288.713T20 11t-.712-.288T19 
      10V4H5v14h2.5q.425 0 .713.288T8.5 19t-.288.713T7.5 20zm0-3v1V4zm2-4v2q0 .425.288.713T8 16h.1q.2-1.225.875-2.262T10.7 12H8q-.425 0-.712.288T7 
      13m0-6v2q0 .425.288.713T8 10h2q.425 0 .713-.288T11 9V7q0-.425-.288-.712T10 6H8q-.425 0-.712.288T7 7m7 14q-1.65 0-2.825-1.175T10 
      17t1.175-2.825T14 13h1q.425 0 .713.288T16 14t-.288.713T15 15h-1q-.825 0-1.412.588T12 17t.588 1.413T14 19h1q.425 0 .713.288T16 20t-.288.713T15 
      21zm0-11h2q.425 0 .713-.288T17 9V7q0-.425-.288-.712T16 6h-2q-.425 0-.712.288T13 7v2q0 .425.288.713T14 10m1 8q-.425 0-.712-.288T14 17t.288-.712T15 
      16h4q.425 0 .713.288T20 17t-.288.713T19 18zm5 3h-1q-.425 0-.712-.288T18 20t.288-.712T19 19h1q.825 0 1.413-.587T22 17t-.587-1.412T20 15h-1q-.425 0-.712-.288T18 
      14t.288-.712T19 13h1q1.65 0 2.825 1.163T24 17q0 1.65-1.175 2.825T20 21" />
    </svg>, // Easy Sharing
    title: "Easy Sharing",
    desc: "Share your boards instantly with a public link."
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20">
      <path fill="#bc6c25" 
      d="M9.09 3H5.5A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5v-2.6a1.3 1.3 0 0 1-1 0v.1h-3V8h.1q.01-.026.022-.051a1.4 1.4 
      0 0 1-.444-.21l-.07-.053a1.4 1.4 0 0 1-.45-.635l-.004-.012L12 6.566V7H8V4h1.092a1.42 1.42 0 0 1-.002-1M4 13h3v3H5.5l-.144-.007A1.5 1.5 0 0 1 4 
      14.5zm4 3v-3h4v3zm5 0v-3h3v1.5l-.007.145A1.5 1.5 0 0 1 14.5 16zm-1-4H8V8h4zM4 5.5l.007-.144A1.5 1.5 0 0 1 5.5 4H7v3H4zM7 12H4V8h3zM13.878.282l.348 
      1.071a2.2 2.2 0 0 0 1.398 1.397l1.072.348l.021.006a.423.423 0 0 1 0 .798l-1.071.348a2.2 2.2 0 0 0-1.399 1.397l-.348 1.07a.423.423 0 0 1-.798 0l-.349-1.07a2.2 2.2 
      0 0 0-.532-.867a2.2 2.2 0 0 0-.866-.536l-1.071-.348a.423.423 0 0 1 0-.798l1.071-.348a2.2 2.2 0 0 0 1.377-1.397l.348-1.07a.423.423 0 0 1 .799 0m4.905 
      7.931l-.766-.248a1.58 1.58 0 0 1-.998-.999l-.25-.764a.302.302 0 0 0-.57 0l-.248.764a1.58 1.58 0 0 1-.984.999l-.765.248a.303.303 0 0 0 0 .57l.765.249a1.58 
      1.58 0 0 1 1 1.002l.248.764a.302.302 0 0 0 .57 0l.249-.764a1.58 1.58 0 0 1 .999-.999l.765-.248a.303.303 0 0 0 0-.57z"/>
    </svg>, // Modern, Clean Design
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
          Whether it's books, games, TV shows, or movies — Recoards helps you create interactive, shareable lists that look great and feel personal.
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
