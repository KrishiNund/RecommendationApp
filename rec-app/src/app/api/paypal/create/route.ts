// app/api/paypal/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, paypalBase } from "../_lib";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // pass from frontend
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const token = await getAccessToken();
    const base = paypalBase();

    const res = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "PayPal-Request-Id": crypto.randomUUID(), // idempotency
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "9.99",
            },
            description: "Recoards Pro Plan - one time payment",
            custom_id: userId, // <-- ties the order to your user
          },
        ],
        application_context: {
          brand_name: "Recoards",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${process.env.APP_URL}/upgrade/success`,
          cancel_url: `${process.env.APP_URL}/upgrade/cancel`,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    const approveUrl = data.links?.find((l: any) => l.rel === "approve")?.href;
    const orderID = data.id;

    if (!approveUrl) {
      return NextResponse.json({ error: "No approve link from PayPal" }, { status: 500 });
    }

    return NextResponse.json({ approveUrl, orderID });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
