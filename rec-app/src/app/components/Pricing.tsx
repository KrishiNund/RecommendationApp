'use client'

import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Pricing() {
  const [userPlan, setUserPlan] = useState("")
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // fetch current user and plan on mount
    const getCurrentUserAndPlan = async () => {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("plan")
          .eq("id", currentUser.id)
          .single();

        if (!userError) {
          setUserPlan(userData?.plan || "free");
        } else {
          console.error("Error fetching user plan:", userError.message);
        }
      } else {
        setUserPlan("free");
      }
      setIsLoading(false);
    };

    getCurrentUserAndPlan(); // run once on mount

    // subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const currentUser = session?.user || null;
          setUser(currentUser);

          if (currentUser) {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("plan")
              .eq("id", currentUser.id)
              .single();

            if (!userError) {
              setUserPlan(userData?.plan || "free");
            }
          }
          // if logged set user null and plan to "free"
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserPlan("free");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="bg-white py-24 px-4 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={item} className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-[#bc6c25]">
            Pricing
          </span>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Pay once. Use forever. No subscriptions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            variants={item}
            className="border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-all flex flex-col bg-white group"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-500 mb-6">Perfect for trying out the platform</p>

              <div className="space-y-5 mb-8">
                <Feature text="Create up to 3 boards" />
                <Feature text="Unlimited recommendations" />
                <Feature text="Public sharing via link" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500"> forever</span>
              </div>
              {/* if not logged in, show default get started option */}
                {isLoading ? (
                  <Button
                      variant="outline"
                      className="w-full h-12 transition-colors"
                      disabled
                    >
                      Loading...
                    </Button>

                ):!user ? (
                  <Link href="/signup" passHref>
                    <Button
                      variant="outline"
                      className="w-full h-12 transition-colors hover:border-[#bc6c25] hover:text-[#bc6c25] hover:bg-white cursor-pointer"
                    >
                      Get Started
                    </Button>
                  </Link>
                ) : userPlan === "free" ? (
                  <Button
                    variant="outline"
                    className="w-full h-12 transition-colors"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-12 transition-colors"
                    disabled
                  >
                    Already Upgraded
                  </Button>
                )}
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            variants={item}
            className="relative rounded-xl p-8 flex flex-col bg-[#fff9f2] border border-[#ffe5cc] shadow-[0_10px_40px_-15px_rgba(188,108,37,0.15)]"
          >
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#bc6c25] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              Best value
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#bc6c25]/10">
                  <Zap className="text-[#bc6c25]" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Pro</h3>
                  <p className="text-gray-500">Everything unlocked, forever</p>
                </div>
              </div>

              <div className="space-y-5 mb-8 mt-6">
                <Feature text="Unlimited boards" emphasized />
                <Feature text="Early access to new features" emphasized />
                <Feature text="Everything in Free plan" />
              </div>
            </div>

            <div className="pt-6 border-t border-[#ffe5cc]">
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-500"> one-time payment</span>
              </div>
              {/* if not logged in, show default option */}
                {isLoading ? (
                  <Button
                      variant="outline"
                      className="w-full h-12 transition-colors"
                      disabled
                    >
                      Loading...
                    </Button>

                ): !user ? (
                    <Link href="/signup" passHref>
                      <Button
                        variant="outline"
                        className="w-full h-12 transition-colors hover:border-[#bc6c25] hover:text-[#bc6c25] hover:bg-white cursor-pointer"
                      >
                        Sign Up to upgrade
                      </Button>
                    </Link>
                  ) : userPlan === "free" ? (
                    // the paypal button to be added
                    <Button className="w-full h-12 cursor-pointer bg-gradient-to-r from-[#bc6c25] to-[#a05a1f] hover:from-[#a05a1f] hover:to-[#8a4e1a] text-white shadow-md hover:shadow-lg transition-all">
                      Upgrade now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-12 transition-colors"
                      disabled
                    >
                      Current Plan
                    </Button>
                  )}   
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function Feature({ text, emphasized = false }: { text: string; emphasized?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 
        className={`${emphasized ? 'text-[#bc6c25]' : 'text-gray-400'} mt-0.5 flex-shrink-0`} 
        size={18} 
      />
      <span className={`${emphasized ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );
}