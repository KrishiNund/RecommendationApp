// src/app/api/delete-user/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // --- Step 1: Fetch all thumbnails from boards and recommendations
    const [{ data: boardThumbs, error: boardErr }, { data: recThumbs, error: recErr }] = await Promise.all([
      supabase.from("boards").select("thumbnail").eq("user_id", userId),
      supabase.from("recommendations").select("thumbnail").eq("user_id", userId),
    ]);

    if (boardErr || recErr) {
      console.error("Error fetching thumbnails:", boardErr || recErr);
      return NextResponse.json({ error: "Error fetching thumbnails" }, { status: 500 });
    }

    // --- Step 2: Combine and filter out null/empty values
    const boardPaths = (boardThumbs ?? []).map((b) => b.thumbnail).filter(Boolean);
    const recPaths = (recThumbs ?? []).map((r) => r.thumbnail).filter(Boolean);
    const allPaths = [...boardPaths, ...recPaths];
    // console.log(allPaths)

    // --- Step 3: Delete all thumbnails from the bucket
    if (allPaths.length > 0) {
      const { error: deleteThumbError } = await supabase.storage
        .from("thumbnails")
        .remove(allPaths);

      if (deleteThumbError) {
        console.warn("Some thumbnails may not have been deleted:", deleteThumbError.message);
        // Continue deletion anyway — don’t block full account delete
      }
    }

    // --- Step 4: Delete the user (this will cascade delete boards/recommendations if configured)
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userId);

    if (userDeleteError) {
      return NextResponse.json({ error: userDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error during user deletion:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
