"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="px-6 py-24 bg-gradient-to-br from-white to-gray-50 max-w-6xl mx-auto rounded-lg">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-left">
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your personal space
            </motion.span>
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              for <span className="text-[#bc6c25] bg-clip-text bg-gradient-to-r from-[#d4a373] to-[#bc6c25]">lists</span> people
            </motion.span>
            <motion.span 
              className="block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              actually care about
            </motion.span>
          </h1>

          <motion.p 
            className="text-gray-600 text-lg md:text-xl mt-6 max-w-2xl text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            From anime and games to music and movies — build personalized lists your friends will actually want to check out.
          </motion.p>

          <motion.div 
            className="flex gap-4 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="bg-[#bc6c25] text-black px-8 py-4 rounded-lg cursor-pointer shadow-lg hover:shadow-xl hover:bg-[#d4a373]"
              >
                Get Started Free
              </Button>
            </motion.div>
            {/* <Button 
              variant="outline" 
              className="px-8 py-4 rounded-lg border-gray-300 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
            >
              See Examples
            </Button> */}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:block"
        >
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl border-2 border-[#d4a373] z-0"></div>
            <div className="relative z-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-80 w-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500">Your beautiful list preview</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}