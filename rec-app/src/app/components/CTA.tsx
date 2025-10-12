'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-6 relative bg-[hsl(28,10%,98%)]">
      <div className="max-w-4xl mx-auto relative">
        <motion.div 
          className="bg-white rounded-xl p-8 md:p-12 shadow-lg border border-gray-100 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f5ebe1] via-[#bc6c25] to-[#f5ebe1]"></div>
          
          <div className="text-center relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to share your <span className="text-[#bc6c25]">favorites</span>?
            </motion.h2>

            <motion.p 
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Create beautiful recommendation boards to showcase what you love.
            </motion.p>

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/signup" className="inline-block">
                <motion.button
                  className="relative px-8 py-3.5 text-white bg-gradient-to-br from-[#bc6c25] to-[#a05a1f] rounded-lg font-medium text-base shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started — It's Free
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-12"></span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}