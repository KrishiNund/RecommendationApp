"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function AppLayout({children}:{children: React.ReactNode}){
    const pathname = usePathname()
    const hideNavbarOn = ['/signup', '/login']
    const showNavbar = !hideNavbarOn.includes(pathname)

    return(
        <>
            {showNavbar && <Navbar />}
            {children}
        </>
    )
}