'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  //get current path of page footer is on
  const currentPath = usePathname();
  const authPages = ['/signup', '/login']

  //default value for bgVar
  let bgVar = 'bg-white';

  const useDiffBg = authPages.includes(currentPath)

  if (useDiffBg){
    bgVar = `bg-[#f5ebe1]`
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className={`${bgVar} py-6 text-center text-sm text-gray-500`}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
        <span>© {currentYear} RECTHIS. All rights reserved.</span>
        
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-black transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-black transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
