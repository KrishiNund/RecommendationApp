"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [msg, setMsg] = useState("Verifying your payment...");

  useEffect(() => {
    const orderID = params.get("token"); // PayPal sends ?token=<orderID>
    if (!orderID) {
      setStatus("error");
      setMsg("Missing order ID.");
      setTimeout(() => router.push("/dashboard"), 3000);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMsg("Payment verification failed.");
          console.error(data);
          // Redirect after a short delay
          setTimeout(() => router.push("/dashboard"), 3000);
          return;
        }
        setStatus("ok");
        setMsg("Payment successful! Your account has been upgraded to Pro.");
        // Redirect after a short delay
        setTimeout(() => router.push("/dashboard"), 3000);
      } catch (e) {
        setStatus("error");
        setMsg("Something went wrong verifying your payment.");
        console.error(e);
        setTimeout(() => router.push("/dashboard"), 3000);
      }
    })();
  }, [params, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="rounded-xl bg-white p-8 shadow text-center">
        <h1 className="text-2xl font-bold mb-2">
          {status === "ok"
            ? "Thank you! 🎉"
            : status === "loading"
            ? "Please wait…"
            : "Uh oh"}
        </h1>
        <p className="text-gray-600 mb-2">{msg}</p>
        {status !== "loading" && (
          <p className="text-sm text-gray-500">
            Redirecting you to your dashboard...
          </p>
        )}
      </div>
    </div>
  );
}
