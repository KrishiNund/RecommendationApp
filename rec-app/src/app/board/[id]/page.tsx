"use client"

import { useParams } from "next/navigation"

export default function BoardPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Board Details</h1>
      <p className="text-gray-500">Showing recommendations for board ID: {id}</p>
    </div>
  );
}
