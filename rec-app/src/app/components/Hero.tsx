"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

 const icons =[
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" 
      d="M216 64h-68.69l34.35-34.34a8 8 0 1 0-11.32-11.32L128 60.69L85.66 18.34a8 8 0 0 
      0-11.32 11.32L108.69 64H40a16 16 0 0 0-16 16v120a16 16 0 0 0 16 16h176a16 16 0 0 
      0 16-16V80a16 16 0 0 0-16-16M40 80h104v120H40Zm176 120h-56V80h56zm-16-84a12 12 
      0 1 1-12-12a12 12 0 0 1 12 12m0 48a12 12 0 1 1-12-12a12 12 0 0 1 12 12"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" 
        d="M216 104H102.09L210 75.51a8 8 0 0 0 5.68-9.84l-8.16-30a15.93 15.93 0 0 
        0-19.42-11.13L35.81 64.74a15.75 15.75 0 0 0-9.7 7.4a15.5 15.5 0 0 0-1.55 
        12L32 111.56V200a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-88a8 8 0 0 0-8-8m-23.84-64l6 
        22.07l-22.62 6l-28.12-16.24Zm-66.69 17.6l28.12 16.24l-36.94 9.75l-28.12-16.22Zm-79.4 
        44.62l-6-22.08l26.5-7L94.69 89.4ZM208 200H48v-80h160z"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" 
      d="m231.65 194.55l-33.19-157.8a16 16 0 0 0-19-12.39l-46.81 
      10.06a16.08 16.08 0 0 0-12.3 19l33.19 157.8A16 16 0 0 0 169.16 224a16.3 
      16.3 0 0 0 3.38-.36l46.81-10.06a16.09 16.09 0 0 0 12.3-19.03M136 50.15v-.09l46.8-10l3.33 
      15.87L139.33 66Zm6.62 31.47l46.82-10.05l3.34 15.9L146 97.53Zm6.64 31.57l46.82-10.06l13.3 
      63.24l-46.82 10.06ZM216 197.94l-46.8 10l-3.33-15.87l46.8-10.07l3.33 15.85zM104 32H56a16 
      16 0 0 0-16 16v160a16 16 0 0 0 16 16h48a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M56 48h48v16H56Zm0 
      32h48v96H56Zm48 128H56v-16h48z"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" 
      d="M176 112h-24a8 8 0 0 1 0-16h24a8 8 0 0 1 0 16m-72-16h-8v-8a8 8 0 0 
      0-16 0v8h-8a8 8 0 0 0 0 16h8v8a8 8 0 0 0 16 0v-8h8a8 8 0 0 0 0-16m137.48 
      104.65a36 36 0 0 1-54.94 4.81c-.12-.12-.24-.24-.35-.37L146.48 160h-37l-39.67 
      45.09l-.35.37A36.08 36.08 0 0 1 44 216a36 36 0 0 1-35.44-42.25a.7.7 0 0 1 
      0-.14l16.37-84.09A59.88 59.88 0 0 1 83.89 40H172a60.08 60.08 0 0 1 59 49.25v.18l16.37 
      84.17a.7.7 0 0 1 0 .14a35.74 35.74 0 0 1-5.89 26.91M172 144a44 44 0 0 0 0-88H83.89a43.9 
      43.9 0 0 0-43.21 36.37v.13L24.3 176.59A20 20 0 0 0 58 194.3l41.92-47.59a8 8 0 0 1 
      6-2.71Zm59.7 32.59l-8.74-45A60 60 0 0 1 172 160h-4.2l30.2 34.31a20.09 20.09 0 0 0 
      17.46 5.39a20 20 0 0 0 16.23-23.11Z"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" 
      d="m210.3 56.34l-80-24A8 8 0 0 0 120 40v108.26A48 48 0 1 0 136 
      184V98.75l69.7 20.91A8 8 0 0 0 216 112V64a8 8 0 0 0-5.7-7.66M88 
      216a32 32 0 1 1 32-32a32 32 0 0 1-32 32m112-114.75l-64-19.2v-31.3L200 70Z"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" 
      d="M224 104h-8.37a88 88 0 0 0-175.26 0H32a8 8 0 0 0-8 8a104.35 104.35 0 0 0 56 
      92.28V208a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-3.72A104.35 104.35 0 0 0 232 
      112a8 8 0 0 0-8-8m-24.46 0h-51.42a71.84 71.84 0 0 1 41.27-29.57A71.45 71.45 0 
      0 1 199.54 104m-26.06-47.77q2.75 2.25 5.27 4.75a87.92 87.92 0 0 0-49.15 43h-29.5A72.26 72.26 
      0 0 1 168 56c1.83 0 3.66.09 5.48.23M128 40a72 72 0 0 1 19 2.57A88.36 88.36 0 0 0 83.33 
      104H56.46A72.08 72.08 0 0 1 128 40m36.66 152a8 8 0 0 0-4.66 7.3v8.7H96v-8.7a8 8 0 0 0-4.66-7.3a88.29 
      88.29 0 0 1-51-72h175.29a88.29 88.29 0 0 1-50.97 72"/>
    </svg>,
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256">
      <path fill="hsl(28,20%,55%)" d="m185.33 114.21l29.14-27.42l.17-.17a32 32 0 0 0-45.26-45.26c0 .06-.11.11-.17.17l-27.42 
      29.14l-83-30.2a8 8 0 0 0-8.39 1.86l-24 24a8 8 0 0 0 1.22 12.31l63.89 42.59L76.69 136H56a8 8 0 0 0-5.65 2.34l-24 
      24A8 8 0 0 0 29 175.42l36.82 14.73l14.7 36.75l.06.16a8 8 0 0 0 13.18 2.47l23.87-23.88A8 8 0 0 0 120 
      200v-20.69l14.76-14.76l42.59 63.89a8 8 0 0 0 12.31 1.22l24-24a8 8 0 0 0 1.86-8.39Zm-.07 97.23l-42.59-63.88a8 
      8 0 0 0-5.87-3.56h-.79a8 8 0 0 0-5.66 2.35l-24 24A8 8 0 0 0 104 176v20.69l-13.07 13.07L79.43 181a8 8 0 0 
      0-4.43-4.43l-28.74-11.5L59.32 152H80a8 8 0 0 0 5.66-2.34l24-24a8 8 0 0 0-1.22-12.32l-63.88-42.6l13.5-13.49l83.22 
      30.26a8 8 0 0 0 8.56-2l30.94-32.91a16 16 0 0 1 22.62 22.63l-32.87 30.93a8 8 0 0 0-2 8.56l30.26 83.22Z"/>
    </svg>
  ];

export default function Hero() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user || null;
      setUser(currentUser);

      setIsLoading(false);
    };

      getCurrentUser(); // run once on mount
  }, [])

  //duplicating the icons in a new array
  const loopedIcons = [...icons, ...icons];

  return (
    <section className="relative px-4 py-10 md:py-15 w-full h-full overflow-hidden bg-[hsl(28,10%,90%)]">
      <div className="max-w-7xl h-full mx-auto text-center relative z-10 bg-[url(/textures/texture.png)] p-4">
        <div className="md:flex items-center justify-center gap-x-4">
          {/* Headline */}
          <div className="w-full flex flex-col items-start max-w-sm h-full text-left px-0">
            <motion.h1
              className="text-5xl tracking-tight md:text-7xl font-bold text-[hsl(28,20%,15%)] leading-tight mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>Share</div>
              <div>what you</div>
              <div>personally</div>
              <div className="flex items-center justify-start">
                <span className="relative inline-block">
                  <span className="relative z-10 block">recommend.</span>
                  <motion.span
                    className="absolute left-0 w-full rounded-sm bg-[hsl(28,55%,60%)]"
                    style={{
                      height:'0.38em',
                      bottom: '0.08em',
                      transformOrigin: 'left',
                      zIndex: 0,
                    }}
                    initial={{scaleX: 0}}
                    animate={{scaleX: 1}}
                    transition={{duration: 0.7, ease: [0.25, 0.8, 0.25, 1], delay: 0.18 }}
                    aria-hidden="true"
                  />
                </span>
              </div>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              className="text-lg sm:text-xl text-left text-[hsl(28,20%,15%)] mx-auto mb-10" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your personal space for easily creating and sharing your recommendations about the things you love with the people that you cherish in your life.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              className="flex justify-left gap-4 mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  // Skeleton while loading
                  <div className="mt-8 space-y-4 animate-pulse text-center">
                    <div className="h-8 w-60 mx-auto rounded-md bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-4 w-72 mx-auto rounded-md bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-10 w-44 mx-auto rounded-xl bg-zinc-300 dark:bg-zinc-600" />
                  </div>
                ) : user ? (
                  // Logged-in welcome
                  <motion.div
                    className="mt-8 text-center space-y-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div>
                      <Link href="/dashboard">
                        <button className="bg-[hsl(28,70%,50%)] hover:bg-[hsl(28,70%,55%)] text-[hsl(28,20%,15%)] px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-medium shadow-lg cursor-pointer">
                          Go to Your Boards →
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  // Default "Start for free" CTA
                  <Link href="/signup">
                    <button className="relative bg-[hsl(28,70%,50%)] hover:bg-[hsl(28,70%,55%)] text-[hsl(28,20%,15%)] px-4 py-3 rounded-xl font-medium text-lg shadow-sm cursor-pointer flex items-center gap-x-0.5 overflow-hidden group">
                      <p>Start for free</p>
                      <span className="relative w-6 h-6 flex items-center mt-0.5">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24"
                          className="absolute inset-0 transition-opacity duration-50 opacity-100 group-hover:opacity-0 ease-in-out"
                        >
                          <path fill="#3d3229" d="m13.172 12l-4.95-4.95l1.414-1.413L16 12l-6.364 6.364l-1.414-1.415z" />
                        </svg>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24"
                          className="absolute inset-0 transition-opacity duration-50 opacity-0 group-hover:opacity-100 ease-in-out"
                        >
                          <path fill="#3d3229" d="m16.172 11l-5.364-5.364l1.414-1.414L20 12l-7.778 7.778l-1.414-1.414L16.172 13H4v-2z" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Benefit points with icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-5xl flex items-center"
          >
            <div className="hidden max-w-5xl md:flex justify-center items-center gap-4 text-base text-gray-600 rounded-lg shadow-lg">
              <div className="xl:hidden">
                <img src="screenshots/mockup3-transparent.png" alt="mockup" className="rounded-lg shadow-lg relative"/>
              </div>
              <div className="hidden xl:block">
                <img src="screenshots/desktop.png" alt="mockup" className="rounded-lg shadow-lg"/>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration:0.8, delay:1.2}}
          className="hidden w-full lg:flex lg:flex-col items-center justify-center text-xl text-[hsl(28,10%,30%)] font-regular px-4">
        
          <p className="italic">Create and share recommendation boards for your favorite things</p>
  
          <div className="flex items-center">
            <div className="-rotate-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 20 20">
                <g fill="hsl(28,20%,65%)" fillRule="evenodd" clipRule="evenodd">
                  <path d="M10.636 5.98a1 1 0 0 1 1.728 0l5.259 9.016a1 1 0 0 1-.864 1.504H6.24a1 1 0 0 1-.864-1.504z" opacity="0.2" />
                  <path d="M10 4a.5.5 0 0 1 .429.243l6 10A.5.5 0 0 1 16 15H4a.5.5 0 0 1-.429-.757l6-10A.5.5 0 0 1 10 4M4.883 14h10.234L10 5.472z" />
                </g>
              </svg>
            </div>

            <div className="marquee flex items-center right-3">
              <div className="track">
                <div className="flex items-center justify-center gap-11.5">
                    {loopedIcons.map((icon, i)=>(
                      <div key={i}>
                        {icon}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="rotate-90 relative right-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 20 20">
                <g fill="hsl(28,20%,65%)" fillRule="evenodd" clipRule="evenodd">
                  <path d="M10.636 5.98a1 1 0 0 1 1.728 0l5.259 9.016a1 1 0 0 1-.864 1.504H6.24a1 1 0 0 1-.864-1.504z" opacity="0.2" />
                  <path d="M10 4a.5.5 0 0 1 .429.243l6 10A.5.5 0 0 1 16 15H4a.5.5 0 0 1-.429-.757l6-10A.5.5 0 0 1 10 4M4.883 14h10.234L10 5.472z" />
                </g>
              </svg>
            </div>
          </div>
         
          <motion.div 
            initial={{opacity: 0}}
            animate={{opacity:1}}
            transition={{duration: 0.6, delay: 2.0}}
            className="w-full flex items-center justify-center space-x-1 px-4 ">
            <p className="italic">and more that matters to you </p>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path fill="hsl(28,40%,80%)" fillOpacity={0} d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z">
                <animate fill="freeze" attributeName="fill-opacity" begin="1.4s" dur="0.3s" values="0;0.3"></animate>
              </path>
              <path fill="none" stroke="#d19561" strokeDasharray={32} strokeDashoffset={32} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.4s" values="32;0"></animate>
              </path>
            </svg>
          </motion.div>        
        </motion.div>
      </div>
    </section>
  )
}