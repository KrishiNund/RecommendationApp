'use client';

import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-16 px-6 relative">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5ebe1] opacity-20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#f8f1e9] opacity-20 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Decorative border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f8f1e9] via-[#d4a373] to-[#f5ebe1]"></div>
          
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to share your favorites?
            </motion.h2>

            <motion.p 
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Start building your first recommendation board today.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.button
                  className="text-white text-base px-8 py-4 bg-[#a05a1f] hover:bg-[#8a4e1a] shadow-sm hover:shadow-md transition-all relative overflow-hidden group rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  <span className="relative z-10">Get Started For Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}