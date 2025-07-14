"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
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


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [boardCount, setBoardCount] = useState(0);
  const [recCount, setRecCount] = useState(0);
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

        const { data: recs, error: recsError } = await supabase
          .from("recommendations")
          .select("id")
          .eq("user_id", currentUser.id);

        if (boardsError || recsError) {
          setError("Failed to fetch user stats");
        } else {
          setBoardCount(boards?.length || 0);
          setRecCount(recs?.length || 0);
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
      await supabase.auth.signOut(); // immediately updates auth state
      router.push("/"); // go to landing
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
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
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
            <p className="text-sm text-gray-500">Manage your account and data</p>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Account Info</h2>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600 mt-1">
                Joined: {format(new Date(user.created_at), "PPP")}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Stats</h2>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>{boardCount} board{boardCount !== 1 && "s"} created</li>
                <li>{recCount} recommendation{recCount !== 1 && "s"} added</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Deleting your account will permanently remove all your data including boards and recommendations.
            </p>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-4 cursor-pointer">
                      Delete Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all data associated with it. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Confirm Deletion
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}