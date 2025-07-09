"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Recommendation from "@/app/components/Recommendation";
import { supabase } from "@/lib/supabase";

export default function BoardPage() {
  const [boardName, setBoardName] = useState("Loading...");
  const { id } = useParams();
  const board_id = id;

  useEffect(() => {
    const fetchBoard = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("name")
        .eq("id", board_id)
        .single();

      if (error) {
        console.error("Error fetching board:", error);
        setBoardName("Untitled Board");
      } else {
        setBoardName(data.name);
      }
    };

    if (board_id) {
      fetchBoard();
    }
  }, [board_id]);
  

  type RecType = {
    id: string;
    board_id: string;
    name: string;
    description: string;
    comment: string;
    rating: string;
    thumbnail?: string;
    created_at: string;
  };

  const [recommendations, setRecommendations] = useState<RecType[]>([
  {
    id: "1",
    board_id: board_id as string,
    name: "Your Name (Kimi no Na wa)",
    description: "A breathtaking anime about love, fate, and time travel.",
    comment: "It made me cry fr 😭 A must-watch!",
    rating: "9.5",
    thumbnail: "https://i.imgur.com/xN5Xm5J.jpeg",
    created_at: "2025-07-09T10:00:00Z",
  },
  {
    id: "2",
    board_id: board_id as string,
    name: "Nier: Automata",
    description: "An emotionally powerful game with deep themes and stylish combat.",
    comment: "One of the few games that made me feel existential 🥲",
    rating: "9.0",
    thumbnail: "https://i.imgur.com/1I4qYqF.jpeg",
    created_at: "2025-07-09T10:10:00Z",
  },
  {
    id: "3",
    board_id: board_id as string,
    name: "Kenshi Yonezu - Lemon",
    description: "A beautiful Japanese ballad full of sorrow and nostalgia.",
    comment: "I still get goosebumps every time 🍋",
    rating: "8.7",
    thumbnail: "https://i.imgur.com/s3U5wTJ.jpeg",
    created_at: "2025-07-09T10:20:00Z",
  },
  {
    id: "4",
    board_id: board_id as string,
    name: "Made in Abyss",
    description: "A dark fantasy anime with stunning visuals and worldbuilding.",
    comment: "Cute art style hides horrifying emotions. Loved it.",
    rating: "9.3",
    thumbnail: "https://i.imgur.com/1XQ3Zr1.jpeg",
    created_at: "2025-07-09T10:30:00Z",
  },
]);


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Header - More natural and aesthetic, no card */}
          <div className="relative py-12 sm:py-20 overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-indigo-500" />
                  {boardName}
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl">
                  Curated recommendations that reflect your taste. Explore. Share. Revisit.
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Created on July 9, 2025 • {recommendations.length} recommendations
                </div>
              </div>
              <div className="text-left sm:text-right">
                <Button className="text-base px-5 py-2.5 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recommendation
                </Button>
              </div>
            </div>
          </div>
          {/* Recommendations Area */}
          <div>
            {recommendations.length === 0 ? (
              <div className="text-center py-24 text-gray-500">
                <p className="text-xl font-medium">Nothing here yet...</p>
                <p className="text-sm mt-2">Start adding recommendations to make this board yours.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recommendations.map((rec, idx) => (
                  <Recommendation
                    key={rec.id}
                    id={rec.id}
                    board_id={rec.board_id}
                    name={rec.name}
                    description={rec.description}
                    comment={rec.comment}
                    rating={rec.rating}
                    thumbnail={rec.thumbnail}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
