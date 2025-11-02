'use client'

import { Button } from "../../components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Menu, LogIn, LogOut, UserPlus, LayoutDashboard, ChevronDown, UserRoundCog, X} from "lucide-react"
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import { Skeleton } from "../../components/ui/skeleton"
import { Luckiest_Guy } from 'next/font/google'
import { useState } from "react"

const logo_font = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
})

export default function Navbar() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const currentPath = usePathname()
  const noDashboardPages = ['/']
  const isOnLandingPage = noDashboardPages.includes(currentPath)
  const [isOpen, setIsOpen] = useState(false);

  let navBgVar = 'bg-[hsl(28,10%,98%)]'
  const authPages = ['/signup', '/login']
  const useAuthBg = authPages.includes(currentPath)

  const policyPages = ['/terms-of-service', 'privacy-policy']
  const usePolicyBg = policyPages.includes(currentPath)

  const landingPage = ['/']
  const useLandingBg = landingPage.includes(currentPath)
  

  if (useAuthBg){
    navBgVar = 'bg-[hsl(28,10%,92%)]'
  } else if (useLandingBg){
    navBgVar = 'bg-[hsl(28,10%,90%)]'
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <nav className={`w-full px-6 py-4 border-b border-gray-100 ${navBgVar}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Skeleton className="h-8 w-32 rounded-md" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`w-full px-6 py-4 border-gray-100 ${navBgVar} backdrop-blur-sm sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-0.5">
          {/* <img src="/icon/favicon.png" alt="logo" className="w-10 h-10"/> */}
          <h1 className={`${logo_font.className} text-4xl text-[hsl(28,67%,44%)] font-bold tracking-normal group-hover:opacity-90 transition-opacity text-center`}>
            RECOARDS
          </h1>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-sm">
          {isOnLandingPage && (
            <div className="flex items-baseline justify-between space-x-8">
              <Link href="#features" className="text-[hsl(28,10%,15%)] cursor-pointer relative transition-transform duration-200 hover:scale-105
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[hsl(28,60%,50%)] after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out">
                <p className="">Features</p>
              </Link>
              <Link href="#how-it-works" className="text-[hsl(28,10%,15%)] cursor-pointer relative transition-transform duration-200 hover:scale-105
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[hsl(28,60%,50%)] after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out">
                  <p>How It Works</p>
              </Link>
              <Link href="#pricing" className="text-[hsl(28,10%,15%)] cursor-pointer relative transition-transform duration-200 hover:scale-105
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[hsl(28,60%,50%)] after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out">      
                  <p>Pricing</p>
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-8">
            {user ? (
              <>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-[hsl(28,60%,50%)] hover:bg-[hsl(28,50%,60%)] text-[hsl(28,20%,15%)] flex items-center space-x-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none group">
                      <Avatar className="h-9 w-9 border-2 border-[hsl(28,25%,85%)]  group-hover:border-[#bc6c25] cursor-pointer transition-colors">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-[#faedcd] text-[#bc6c25]">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-[hsl(28,15%,75%)] group-hover:text-[#bc6c25] transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 border border-gray-100 shadow-lg rounded-lg">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-gray-500">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem className="hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 cursor-pointer">
                      <UserRoundCog className="mr-2 h-4 w-4" />
                      <Link href="/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 hover:bg-red-50/50 focus:bg-red-50/50 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[hsl(28,10%,15%)] cursor-pointer relative transition-transform duration-200 hover:scale-105
                after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[hsl(28,60%,50%)] after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out">
                    Log in
                </Link>
                <Link href="/signup">
                  <Button className="bg-[hsl(28,65%,55%)] hover:bg-[hsl(28,65%,60%)] text-[hsl(28,20%,15%)] flex items-center -space-x-1 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <p>Get Started</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} viewBox="0 0 24 24">
                      <path fill="none" stroke="#3d3229" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M9 6s6 4.419 6 6s-6 6-6 6"></path>
                    </svg>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          {user ? (
            <>
              <Button 
                onClick={() => router.push('/dashboard')}
                size="sm"
                className="bg-[#bc6c25] hover:bg-[#a05a1f] text-white shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 border hover:border-[#d4a373] cursor-pointer">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-[#faedcd] text-[#bc6c25]">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border border-gray-100 shadow-lg rounded-lg mr-4">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem className="hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 cursor-pointer">
                    <UserRoundCog className="mr-2 h-4 w-4" />
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50/50 focus:bg-red-50/50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
           <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="relative h-auto w-auto transition-all flex items-center border-none border-0 outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? 
                  (
                    <X className="h-10 w-10 text-[hsl(28,15%,55%)] transition-all duration-200"/>
                  ):(
                    <Menu className="h-10 w-10 text-[hsl(28,15%,55%)] transition-all duration-200" /> 
                  )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 border border-gray-100 shadow-xl rounded-xl mr-4 p-2 bg-[hsl(28,36%,96%)] backdrop-blur-sm"
              align="end"
            >
              {/* Auth Section */}
              <div className="space-y-1 mb-2">
                <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                  <Link href="/login" className="w-full flex items-center space-x-3">
                    <div className="p-2 bg-[hsl(28,20%,80%)] rounded-lg">
                      <LogIn className="h-5 w-5 text-[hsl(28,20%,20%)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(28,20%,15%)]">Log in</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                  <Link href="/signup" className="w-full flex items-center space-x-3">
                    <div className="p-2 bg-[hsl(28,20%,80%)] rounded-lg">
                      <UserPlus className="h-5 w-5 text-[hsl(28,20%,20%)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(28,20%,15%)]">Sign up</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </div>
              {/* Navigation Links (only on landing page) */}
              {isOnLandingPage && (
                <>
                  <DropdownMenuSeparator className="bg-[hsl(28,20%,90%)] mx-3 my-1" />
                  <div className="space-y-1 mt-2">
                    <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                      <Link href="#features" className="w-full flex items-center space-x-3">
                        <div className="p-2 bg-[hsl(28,20%,80%)] rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(28,20%,20%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                          </svg>
                        </div>
                        <span className="font-medium text-[hsl(28,20%,15%)]">Features</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                      <Link href="#HIW" className="w-full flex items-center space-x-3">
                        <div className="p-2 bg-[hsl(28,20%,80%)] rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(28,20%,20%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                        </div>
                        <span className="font-medium text-[hsl(28,20%,15%)]">How It Works</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                      <Link href="#pricing" className="w-full flex items-center space-x-3">
                        <div className="p-2 bg-[hsl(28,20%,80%)] rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(28,20%,20%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                        <span className="font-medium text-[hsl(28,20%,15%)]">Pricing</span>
                      </Link>
                    </DropdownMenuItem>
 
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        </div>
      </div>
    </nav>
  )
}