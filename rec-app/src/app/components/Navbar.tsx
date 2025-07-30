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
import { Menu, LogIn, LogOut, UserPlus, LayoutDashboard, ChevronDown, UserRoundCog } from "lucide-react"
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import { Skeleton } from "../../components/ui/skeleton"
import { Bebas_Neue } from 'next/font/google'

const logo_font = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
})

export default function Navbar() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const currentPath = usePathname()
  const noDashboardPages = ['/']
  const isOnLandingPage = noDashboardPages.includes(currentPath)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <nav className="w-full px-6 py-4 border-b border-gray-100 bg-white">
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
    <nav className="w-full px-6 py-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group flex items-center">
          <h1 className={`${logo_font.className} text-3xl text-[#bc6c25] tracking-wide group-hover:opacity-90 transition-opacity`}>
            Recoards
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isOnLandingPage && (
            <div className="flex space-x-6">
              <Link href="#features">
                <Button variant="ghost" className="text-gray-700 hover:text-[#bc6c25] hover:bg-[#faedcd]/50 cursor-pointer">
                  Features
                </Button>
              </Link>
              <Link href="#HIW">
                <Button variant="ghost" className="text-gray-700 hover:text-[#bc6c25] hover:bg-[#faedcd]/50 cursor-pointer">
                  How It Works
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="ghost" className="text-gray-700 hover:text-[#bc6c25] hover:bg-[#faedcd]/50 cursor-pointer">
                  Pricing
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#bc6c25] hover:bg-[#a05a1f] text-white flex items-center space-x-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none group">
                      <Avatar className="h-9 w-9 border  group-hover:border-[#bc6c25] transition-colors">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-[#faedcd] text-[#bc6c25]">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-[#bc6c25] transition-colors" />
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
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#bc6c25] hover:bg-[#faedcd]/50 cursor-pointer">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#bc6c25] hover:bg-[#a05a1f] text-white shadow-sm hover:shadow-md transition-all cursor-pointer">
                    Get Started
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
                  <Avatar className="h-9 w-9 border border-[#d4a373] cursor-pointer">
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
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-700 hover:text-[#bc6c25] hover:bg-[#faedcd]/30 rounded-full h-10 w-10 transition-all"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 border border-gray-100 shadow-xl rounded-xl mr-4 p-2 bg-white/95 backdrop-blur-sm"
              align="end"
            >
              {/* Auth Section */}
              <div className="space-y-1 mb-2">
                <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                  <Link href="/login" className="w-full flex items-center space-x-3">
                    <div className="p-2 bg-[#f5ebe1] rounded-lg">
                      <LogIn className="h-5 w-5 text-[#bc6c25]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Log in</p>
                      <p className="text-xs text-gray-500">Access your account</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                  <Link href="/signup" className="w-full flex items-center space-x-3">
                    <div className="p-2 bg-[#f5ebe1] rounded-lg">
                      <UserPlus className="h-5 w-5 text-[#bc6c25]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sign up</p>
                      <p className="text-xs text-gray-500">Create new account</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </div>

              {/* Navigation Links (only on landing page) */}
              {isOnLandingPage && (
                <>
                  <DropdownMenuSeparator className="bg-gray-100 mx-3 my-1" />
                  <div className="space-y-1 mt-2">
                    <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                      <Link href="#features" className="w-full flex items-center space-x-3">
                        <div className="p-2 bg-[#f5ebe1] rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc6c25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">Features</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                      <Link href="#HIW" className="w-full flex items-center space-x-3">
                        <div className="p-2 bg-[#f5ebe1] rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc6c25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                        </div>
                        <span className="font-medium text-gray-900">How It Works</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="px-3 py-2 rounded-lg hover:bg-[#faedcd]/50 focus:bg-[#faedcd]/50 transition-colors">
                      <Link href="#pricing" className="w-full flex items-center space-x-3">
                        <div className="p-2 bg-[#f5ebe1] rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc6c25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">Pricing</span>
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