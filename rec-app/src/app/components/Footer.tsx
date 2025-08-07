'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const currentPath = usePathname()
  const authPages = ['/signup', '/login']

  let bgVar = 'bg-white'
  const useDiffBg = authPages.includes(currentPath)

  if (useDiffBg) {
    bgVar = `bg-[#f5ebe1]`
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className={`${bgVar} py-6 text-center text-sm text-gray-500`}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
        <span>© {currentYear} Recoards. All rights reserved.</span>

        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-black transition">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-black transition">Terms of Service</Link>
          <a
            href="mailto:krishinund@gmail.com"
            className="hover:text-black transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
