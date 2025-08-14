"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="rounded-xl bg-white p-8 shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Payment canceled</h1>
        <p className="text-gray-600 mb-2">
          No charges were made. You can try upgrading again anytime.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you to your dashboard...
        </p>
      </div>
    </div>
  );
}
