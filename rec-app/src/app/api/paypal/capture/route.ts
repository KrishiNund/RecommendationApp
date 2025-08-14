// app/api/paypal/capture/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, paypalBase } from "../_lib";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json();
    if (!orderID) return NextResponse.json({ error: "Missing orderID" }, { status: 400 });

    const token = await getAccessToken();
    const base = paypalBase();

    const res = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    const status = data.status; // "COMPLETED" expected
    const unit = data?.purchase_units?.[0];
    const customId = unit?.payments?.captures?.[0]?.custom_id || unit?.custom_id; // depending on response shape

    if (status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed", details: data }, { status: 400 });
    }

    if (!customId) {
      // fallback if custom_id not bubbled: you could store orderID -> userId before redirect
      return NextResponse.json({ error: "Missing custom_id (userId)" }, { status: 500 });
    }

    // Upgrade the user securely on the server
    const { error } = await supabase
      .from("users") // <-- your table
      .update({ plan: "pro" })
      .eq("id", customId);

    if (error) {
      return NextResponse.json({ error: "DB update failed", details: error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status, orderID });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
