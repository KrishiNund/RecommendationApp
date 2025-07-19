'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function Pricing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="bg-white py-20 px-4 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <motion.div variants={item} className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free. Upgrade once for unlimited access. No subscriptions, no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Free Plan */}
          <motion.div 
            variants={item}
            className="border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col bg-white"
          >
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-gray-900">Free</h3>
              <p className="text-gray-500 mt-2 mb-6">Great for getting started</p>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-700">Create up to 3 boards</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-700">10 recommendations per board</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-700">Share boards publicly</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Button disabled variant="outline" className="w-full h-12 text-gray-700">
                  Your Current Plan
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            variants={item}
            transition={{ delay: 0.1 }}
            className="relative border-2 border-[#bc6c25]/20 rounded-2xl p-8 shadow-lg flex flex-col bg-white overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#bc6c25] text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
              Popular
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-2">
                <Zap className="text-[#bc6c25]" size={20}/>
                <h3 className="text-2xl font-semibold text-gray-900">Pro</h3>
              </div>
              <p className="text-gray-600 mt-2 mb-6">Lifetime access, one payment</p>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-800 font-medium">Unlimited boards & recommendations</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-800 font-medium">Custom colors & layouts</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-800 font-medium">Data backup & export</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={18}/>
                  <span className="text-gray-800 font-medium">Priority support</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$15</span>
                  <span className="text-gray-500"> one-time</span>
                </div>
                <Button className="w-full h-12 bg-gradient-to-r from-[#bc6c25] to-[#a05a1f] hover:from-[#a05a1f] hover:to-[#8a4e1a] text-white shadow-md">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}