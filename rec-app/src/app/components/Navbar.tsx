'use client'

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Menu, LogIn, LogOut, UserPlus } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function Navbar() {
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/') // or landing page
    }

    return(
        <nav className="w-full px-4 py-3 bg-white border-b shadow-sm flex items-center justify-between">
            {/* Left: The logo name */}
            <Link href={"/"}>
                <div className="text-xl font-bold text-black">Recco</div>
            </Link>
            

            {/* Center: Nav Links on Desktop screen */}
            <div className="hidden md:flex space-x-4">
                <Button variant="ghost">About</Button>
                <Button variant="ghost">Features</Button>
                <Button variant="ghost">Pricing</Button>
            </div>

            {/* Right: Login and Hamburger */}
            <div className="flex items-center space-x-2"> 
                <Link href={"/login"}>
                    <Button variant="outline" className="hidden md:flex">
                        <LogIn/> Login
                    </Button>
                </Link>
                
                <Link href={"/signup"}>
                    <Button variant="default" className="hidden md:flex">
                        <UserPlus /> Signup
                    </Button>
                </Link>

                <Button variant="default" className="hidden md:flex" onClick={handleLogout}>
                    <LogOut /> LogOut
                </Button>


                {/* Mobile Hamburger Menu */}
                <div className="md:hidden"> 
                    <Popover>
                        {/* The dropdown menu */}
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>

                        {/* The contents of the dropdown menu */}
                        <PopoverContent className="w-40 flex flex-col space-y-1">
                            <Link href={"/signup"}>
                                <Button variant="ghost" className="w-full justify-start flex"> <UserPlus /> Signup</Button>
                            </Link>
                            <Link href={"/login"}>
                                <Button variant="ghost" className="w-full justify-start flex"> <LogIn />Login</Button>
                            </Link>
                            
                            
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

        </nav>
    )
}