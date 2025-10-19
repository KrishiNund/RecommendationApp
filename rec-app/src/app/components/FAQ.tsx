'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
  {
    q: "Do I need to create an account to view a board?",
    a: "No. Boards are public by default — anyone with the link can view the recommendations without signing up."
  },
  {
    q: "What can I use this app to recommend?",
    a: "You can create boards for anything you love — from movies, TV shows, games, books, music to tech gadgets, travel spots or niche collections."
  },
  {
    q: "Is the app free to use?",
    a: "Yes! You can sign up and create up to 3 boards for free with each being able to accommodate up to 20 recommedations."
  },
  {
    q: "What do I get with the Pro upgrade?",
    a: "The Pro plan unlocks the ability to create unlimited boards and gives you early access to upcoming features. It's a one-time upgrade for those who want to support the app."
  },
  {
    q: "How do I share a board?",
    a: "Click the three dots on the board, then click 'Copy link'. The public link will be copied to your clipboard, which you can then share with anyone."
  },
  {
    q: "What about privacy?",
    a: "Your data is never shared with third parties. You can delete your account and all associated data at any time from your account settings."
  }
]

export default function FAQSection() {
  return (
    <section className="py-24 bg-[hsl(28,10%,98%)]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[hsl(28,20%,15%)] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="multiple" className="w-full space-y-2">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-20px" }}
              >
                <AccordionItem 
                  value={`item-${i}`} 
                  className="bg-[hsl(28,18%,92%)] rounded-lg overflow-hidden transition-all"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-base font-medium text-[hsl(28,22%,18%)] transition-all hover:no-underline cursor-pointer">
                    <span className="flex items-center">
                      {/* <span className="mr-3 text-[#d4a373]">{i + 1}.</span> */}
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-[hsl(28,20%,20%)] text-base leading-relaxed bg-[hsl(28,18%,92%)]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}