// app/api/paypal/_lib.ts
const BASES = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
} as const;

export function paypalBase() {
  // If NODE_ENV is production, use live, else use sandbox
  const env = process.env.NODE_ENV === "production" ? "live" : "sandbox";
  return BASES[env];
}

export async function getAccessToken() {
  // Pick the correct credentials depending on environment
  const client =
    process.env.NODE_ENV === "production"
      ? process.env.PAYPAL_LIVE_CLIENT_ID!
      : process.env.PAYPAL_SANDBOX_CLIENT_ID!;

  const secret =
    process.env.NODE_ENV === "production"
      ? process.env.PAYPAL_LIVE_CLIENT_SECRET!
      : process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
      

  const base = paypalBase();

  const auth = Buffer.from(`${client}:${secret}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${t}`);
  }

  const data = await res.json();
  return data.access_token as string;
}
