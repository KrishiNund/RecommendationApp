import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useInsertUserOnAuth() {
  useEffect(() => {
    const insertUserIfNeeded = async (user: any) => {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          plan: "free",
        });

        if (insertError) {
          console.error("Failed to insert user:", insertError);
        } else {
          console.log("User inserted into users table.");
        }
      } else {
        console.log("User already exists in users table.");
      }
    };

    // 1. On mount, check current session (important for page reloads)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        insertUserIfNeeded(session.user);
      } else {
        console.log("No active session on page load.");
      }
    });

    // 2. Also listen for new sign-ins
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          insertUserIfNeeded(session.user);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
}
