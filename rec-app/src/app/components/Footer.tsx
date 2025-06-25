'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-transparent py-6 text-center text-sm text-gray-500">
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
