"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User2, Mail, BarChart2, Zap, ArrowRight} from "lucide-react";
import { format } from "date-fns";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { toast } from "sonner";


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [boardCount, setBoardCount] = useState(0);
  const [recCount, setRecCount] = useState(0);
  const [userPlan, setUserPlan] = useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        setLoading(true);
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          setError("Failed to fetch user data");
          setLoading(false);
          return;
        }

        const currentUser = userData.user;
        setUser(currentUser);

        const { data: boards, error: boardsError } = await supabase
          .from("boards")
          .select("id")
          .eq("user_id", currentUser.id);

        const {data: userPlanData, error: UserPlanError} = await supabase
          .from("users")
          .select("plan")
          .eq("id", currentUser.id)
          .limit(1)

        const { data: recs, error: recsError } = await supabase
          .from("recommendations")
          .select("id")
          .eq("user_id", currentUser.id);

        if (boardsError || recsError || UserPlanError) {
          setError("Failed to fetch user stats");
        } else {
          setBoardCount(boards?.length || 0);
          setRecCount(recs?.length || 0);
          setUserPlan(userPlanData[0]?.plan || "free")
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to delete:", data.error);
        return;
      }

      // Optional: redirect user after deletion
      console.log("Account deleted!");
      toast.success("Account deletion successful!",{
        style: {
          background: "#fef6e4",
          color: "#4a2e00",
          border: "1px solid #fae1c3",
        },
      });
      // wait 1–1.5s before redirecting
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/"); // go to landing
      }, 1200);
      
      // await supabase.auth.signOut(); // immediately updates auth state
      // router.push("/"); // go to landing
      // window.location.href = '/'
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred: Account could not be deleted.")
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <p className="text-center text-gray-700">You need to be logged in to view this page.</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account</h1>
                <p className="text-gray-500 mt-2">Manage your profile and settings</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#bc6c25]/10">
                <User2 className="w-5 h-5 text-[#bc6c25]" />
              </div>
            </div>
          </div>

          {/* Account Info & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-50">
                  <Mail className="w-4 h-4 text-[#bc6c25]" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Account Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-gray-800 mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member since</p>
                  <p className="text-gray-800 mt-1">
                    {format(new Date(user.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-50">
                  <BarChart2 className="w-4 h-4 text-[#bc6c25]" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Your Activity</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500">Boards</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{boardCount}</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500">Recommendations</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{recCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Deleting your account will permanently remove all your data including boards and recommendations.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                      Confirm Account Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      This action cannot be undone. All your data will be permanently removed from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 hover:bg-gray-50 cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-500 cursor-pointer"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );

}