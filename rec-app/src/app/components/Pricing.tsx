'use client'

import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const [userPlan, setUserPlan] = useState("")
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
          .limit(1);

        if (!userError) {
          setUserPlan(userData[0]?.plan || "free");
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
      className="bg-[hsl(28,10%,98%)] py-24 px-4 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={item} className="text-center space-y-4 mb-16">
          {/* <span className="inline-flex items-center rounded-full bg-[#bc6c25]/10 text-[#bc6c25] px-4 py-1.5 text-sm font-medium ">
            Pricing
          </span> */}
          <h2 className="text-4xl font-bold text-[hsl(28,20%,15%)] tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-[hsl(28,15%,40%)] max-w-2xl mx-auto">
            Pay once. Use forever. No subscriptions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            variants={item}
            className="border border-[hsl(28,5%,90%)] rounded-xl p-8 transition-all flex flex-col bg-[hsl(28,20%,98%)] group"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-[hsl(28,25%,15%)] mb-2">Free</h3>
              <p className="text-[hsl(28,12%,40%)] mb-6">Perfect for trying out the platform</p>

              <div className="space-y-5 mb-8">
                <Feature text="Create up to 3 boards" />
                <Feature text="20 recommendations per board" />
                <Feature text="Public sharing via link" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="mb-6">
                <span className="text-4xl font-bold text-[hsl(28,20%,15%)]">$0</span>
                <span className="text-[hsl(28,15%,40%)]"> forever</span>
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
                      className="w-full h-12 bg-[hsl(28,70%,50%)] hover:bg-[hsl(28,70%,55%)] text-[hsl(28,20%,15%)] transition-colors rounded-md shadow-md font-medium cursor-pointer"
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
            className="relative rounded-xl p-8 flex flex-col bg-[hsl(28,10%,92%)] border border-[hsl(28,5%,85%)] shadow-[0_10px_40px_-15px_rgba(188,108,37,0.15)]"
          >
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-[hsl(29,45%,90%)] text-[hsl(28,15%,20%)] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              Best value
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#bc6c25]/10">
                  <Zap className="text-[hsl(28,45%,50%)]" size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[hsl(28,20%,15%)]">Pro</h3>
                  <p className="text-[hsl(28,12%,40%)]">Everything unlocked, forever</p>
                </div>
              </div>

              <div className="space-y-5 mb-8 mt-6">
                <Feature text="No limit on boards" emphasized />
                <Feature text="No limit on recommendations per board" emphasized />
                <Feature text="Early access to new features" emphasized />
                <Feature text="Everything in Free plan" />
              </div>
            </div>

            <div className="pt-6 border-t border-[hsl(28,2%,90%)]">
              <div className="mb-6">
                <span className="text-4xl font-bold text-[hsl(28,20%,15%)]">$9.99</span>
                <span className="text-[hsl(28,15%,40%)]"> one-time payment</span>
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
                    <Button
                      className="w-full h-12 cursor-pointer bg-gradient-to-r from-[#bc6c25] to-[#a05a1f] hover:from-[#a05a1f] hover:to-[#8a4e1a] text-white shadow-md hover:shadow-lg transition-all"
                      onClick={async () => {
                        try {
                          // You have `user` and `userPlan` already
                          const userId = user?.id;
                          if (!userId) {
                            return router.push("/signup");
                          }

                          const res = await fetch("/api/paypal/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId }),
                          });

                          const data = await res.json();
                          if (!res.ok || !data.approveUrl) {
                            console.error(data);
                            return alert("Could not start checkout. Please try again.");
                          }

                          // Full-page redirect to PayPal
                          window.location.href = data.approveUrl;
                        } catch (e) {
                          console.error(e);
                          alert("Something went wrong. Please try again.");
                        }
                      }}
                    >
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
        className={`${emphasized ? 'text-[hsl(28,20%,55%)]' : 'text-[hsl(28,10%,65%)]'} mt-0.5 flex-shrink-0`} 
        size={18} 
      />
      <span className={`${emphasized ? 'text-[hsl(28,45%,25%)] font-medium' : 'text-[hsl(28,35%,30%)]'}`}>
        {text}
      </span>
    </div>
  );
}