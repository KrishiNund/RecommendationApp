'use client'

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Menu, LogIn, LogOut, UserPlus } from "lucide-react"
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js'

// importing google font for logo/brand name
import { Bebas_Neue } from 'next/font/google'

const logo_font = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
})


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // checking if someone is logged in, if yes store user in user state
        const getUser = async() => {
            const {data, error} = await supabase.auth.getUser()
            if (data?.user){
                setUser(data.user)
            } else {
                setUser(null)
            }
        }
        
        getUser()

        //sets up a listener that waits for changes in login state
        const {data: listener} = supabase.auth.onAuthStateChange(() => {
            getUser()
        })

        //cleanup in case component is removed
        return() => listener?.subscription.unsubscribe()
    }, [])

    const router = useRouter()

    // when logged out, return to landing page
    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return(
        <nav className="w-full px-4 py-3 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3  items-center w-full">
            
            {/* LEFT: Logo aligned to left */}
            <div className="justify-self-start">
              <Link href="/">
                <div className={`${logo_font.className} text-2xl font-bold text-black`}>RecThis</div>
              </Link>
            </div>

            {/* CENTER: Nav Links aligned center */}
            <div className="justify-self-center hidden md:flex space-x-4">
              {user ? (
                <Link href="/myboards">
                  <Button variant="ghost">My Boards</Button>
                </Link>
              ) : (
                <>
                  <Button variant="ghost" className="hover:bg-[#faedcd] cursor-pointer">About</Button>
                  <Button variant="ghost" className="hover:bg-[#faedcd] cursor-pointer">Features</Button>
                  <Button variant="ghost" className="hover:bg-[#faedcd] cursor-pointer">Pricing</Button>
                </>
              )}
            </div>

            {/* RIGHT: Action Buttons aligned to right */}
            <div className="justify-self-end flex items-center space-x-2">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="hidden md:flex cursor-pointer hover:bg-[#faedcd]">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" className="hidden md:flex bg-[#a05a1f] hover:bg-[#8a4e1a] text-white cursor-pointer">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut /> Logout
                </Button>
              )}

              {/* Hamburger (for mobile only) */}
              <div className="md:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 flex flex-col space-y-1">
                    <Link href="/signup">
                      <Button variant="ghost" className="w-full justify-start">
                        <UserPlus /> Signup
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn /> Login
                      </Button>
                    </Link>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

          </div>
        </nav>

    )
}