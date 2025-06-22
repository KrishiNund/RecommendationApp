'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
  {
    q: "Do I need to create an account to view someone's list?",
    a: "Nope! Lists are public by default — anyone with the link can view them."
  },
  {
    q: "Can I use Recco to share things other than anime or games?",
    a: "Yes! You can create boards for books, podcasts, travel spots, or anything else you'd like to recommend."
  },
  {
    q: "Is Recco free to use?",
    a: "Absolutely. You can sign up and create unlimited lists for free."
  },
  {
    q: "Can I customize how my board looks?",
    a: "Yes — you can choose from clean, simple themes and reorder your list however you like."
  },
  {
    q: "Will people need to sign up to interact with my list?",
    a: "Nope! Friends can check items off without creating an account."
  }
]

export default function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
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
                  className="bg-gray-100 rounded-lg overflow-hidden transition-all"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-base font-medium text-gray-800 transition-all hover:no-underline cursor-pointer">
                    <span className="flex items-center">
                      {/* <span className="mr-3 text-[#d4a373]">{i + 1}.</span> */}
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 text-base leading-relaxed bg-gray-100">
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