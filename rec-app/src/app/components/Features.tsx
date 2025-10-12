'use client'

import { motion } from "framer-motion"
import { LayoutGrid, Star, ListChecks, Share2, Sparkles } from "lucide-react"

const features = [
  {
    image: "/screenshots/share-board.png",
    title: "Create pretty recommendation cards",
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
  }
]

export default function Features() {
  return (
    <section className="relative py-15 md:py-28 bg-[hsl(28,20%,95%)] overflow-hidden h-full" id="features">
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Section Title */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-[hsl(30,22%,18%)] mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Built for sharing recommendations
        </motion.h2>

        {/* Optional subheading */}
        <motion.p
          className="text-lg text-[hsl(30,10%,16%)] max-w-2xl mx-auto mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Whether it's books, games, TV shows, or movies — Recoards helps you create interactive, shareable lists that look great and feel personal.
        </motion.p>

        {/* Feature Cards */}
        <div className="flex flex-col items-center gap-15 w-full">
            <motion.div
              className="bg-transparent p-0 flex flex-col md:flex-row items-start md:items-center backdrop-blur-sm 
              md:gap-x-4 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="rounded-lg shadow-lg 
              hover:shadow-xl transition-all">
                  <img src={features[0].image} alt="" className="rounded-lg" />
              </div>
              
              <div className="text-left md:w-[450px] p-4">
                <h3 className="text-3xl font-medium text-[hsl(28,20%,10%)] mb-3 leading-tight">
                  {features[0].title}
                </h3>
                <p className="text-lg text-[hsl(28,10%,25%)] leading-relaxed">
                  {features[0].desc}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="hidden bg-transparent p-0 md:flex flex-col md:flex-row items-start md:items-center backdrop-blur-sm 
              md:gap-x-4 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="text-left md:w-[450px] p-4">
                <h3 className="text-3xl font-medium text-[hsl(28,20%,10%)] mb-3 leading-tight">
                  {features[0].title}
                </h3>
                <p className="text-lg text-[hsl(28,10%,25%)] leading-relaxed">
                  {features[0].desc}
                </p>
              </div>
  
              <div className="rounded-lg shadow-lg 
              hover:shadow-xl transition-all">
                  <img src={features[0].image} alt="" className="rounded-lg" />
              </div>

            </motion.div>

            <motion.div
              className="bg-transparent p-0 md:hidden flex-col md:flex-row items-start md:items-center backdrop-blur-sm 
              md:gap-x-4 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="rounded-lg shadow-lg 
              hover:shadow-xl transition-all">
                  <img src={features[0].image} alt="" className="rounded-lg" />
              </div>

              <div className="text-left md:w-[450px] p-4">
                <h3 className="text-3xl font-medium text-[hsl(28,20%,10%)] mb-3 leading-tight">
                  {features[0].title}
                </h3>
                <p className="text-lg text-[hsl(28,10%,25%)]0 leading-relaxed">
                  {features[0].desc}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-transparent p-0 flex flex-col md:flex-row items-start md:items-center backdrop-blur-sm 
               md:gap-x-4 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="rounded-lg shadow-lg 
              hover:shadow-xl transition-all">
                  <img src={features[0].image} alt="" className="rounded-lg" />
              </div>
              
              <div className="text-left md:w-[450px] p-4">
                <h3 className="text-3xl font-medium text-[hsl(28,20%,10%)] mb-3 leading-tight">
                  {features[0].title}
                </h3>
                <p className="text-lg text-[hsl(28,10%,25%)] leading-relaxed">
                  {features[0].desc}
                </p>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
