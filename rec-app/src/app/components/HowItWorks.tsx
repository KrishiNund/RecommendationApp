"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Create Your Board",
    description:
      "Start by creating a beautiful recommendation board for your favorite movies, games, books, or anything you love.",
    image: "/screenshots/create-board.png",
  },
  {
    title: "Add Recommendations",
    description:
      "Easily add recommendations with ratings and personal notes. Keep everything organized in one place.",
    image: "/screenshots/add-recommendation.png",
  },
  {
    title: "Share With Friends",
    description:
      "Share your board with a unique link. No accounts needed to view.",
    image: "/screenshots/share-board.png",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block bg-[#bc6c25]/10 text-[#bc6c25] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            How It Works
          </span>
          <h2 className="text-5xl font-bold text-zinc-900 dark:text-white mb-5">
            Share your favorites in 3 simple steps
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Beautifully organized recommendations that are easy to create and share.
          </p>
        </div>

        <div className="space-y-32">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col items-center text-center gap-8"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#bc6c25] text-white font-bold text-lg flex items-center justify-center">
                  {i + 1}
                </div>
              </div>

              <h4 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                {step.description}
              </p>

              {/* <div className="w-full flex justify-center items-center">
                <div className="relative overflow-hidden rounded-2xl border-4 border-double border-zinc-500 dark:border-zinc-800 shadow-md bg-zinc-100 dark:bg-zinc-900 transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="block h-auto w-full object-contain rounded-2xl"
                  />
                </div>
              </div> */}

              <div className="w-full flex justify-center items-center">
                <div className="relative rounded-2xl shadow-lg bg-[#fff9f2] transform duration-500 hover:translate-x-5 hover:-translate-y-5 pointer-events-none">
                  <img 
                    className="block h-auto w-full object-contain rounded-2xl shadow-lg transform duration-500 hover:-translate-x-10 hover:translate-y-10 pointer-events-auto" 
                    src={step.image}
                    alt={step.title}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
