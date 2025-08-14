"use client";

import { Suspense } from "react";

// Import your existing client logic
import SuccessPageContent from "./SuccessPageContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-8">Loading…</p>}>
      <SuccessPageContent />
    </Suspense>
  );
}
