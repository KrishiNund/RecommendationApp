'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const currentPath = usePathname()
  const authPages = ['/signup', '/login']

  let bgVar = 'bg-[hsl(28,10%,98%)]'
  const useDiffBg = authPages.includes(currentPath)

  if (useDiffBg) {
    bgVar = `bg-[hsl(28,10%,92%)]`
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className={`${bgVar} py-6 text-center text-sm text-[hsl(28,15%,45%)]`}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        <div className="flex flex-col md:flex-row items-center gap-1">
          <span>© {currentYear} Recoards. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <span>
            Demo only 𖹭
          </span>
        </div>

        <div className="flex gap-4">
          <a className="hover:text-black transition cursor-pointer">Privacy Policy</a>
          <a className="hover:text-black transition cursor-pointer">Terms of Service</a>
          <a
            className="hover:text-black transition cursor-pointer"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
