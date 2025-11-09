"use client";
import { FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Recommendation from "@/app/components/Recommendation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function PublicBoardPage() {
    // types of a recommendation object
  type RecType = {
    id: string;
    board_id: string;
    name: string;
    description: string;
    comment: string;
    rating: number;
    thumbnail?: string;
    created_at: string;
    public_thumbnail: string;
  };

  const [boardName, setBoardName] = useState("Loading...");
  const [boardDescription, setBoardDescription] = useState("");
  const { public_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecType[]>([]);
  const [boardCreatedAt, setBoardCreatedAt] = useState<string>("");

  useEffect(() => {
    async function getCurrentRecs() {
        setIsLoading(true);
        //fetch board id using public id
        const { data: boardData, error: boardError } = await supabase
            .from("boards")
            .select("id")
            .eq("public_id", public_id)
            .single();

        if (boardError || !boardData) {
            console.error("Error fetching board id:", boardError?.message);
            setIsLoading(false);
            return;
        }

        const board_id = boardData.id;

        const { data, error: boardNameError } = await supabase
        .from("boards")
        .select("name, description, created_at")
        .eq("id", board_id)
        .single();

        if (boardNameError) {
            console.error("Error fetching board:", boardNameError);
            setBoardName("Untitled Board");
        } else {
            setBoardName(data.name);
            setBoardDescription(data.description || "");
            setBoardCreatedAt(data.created_at)
        }

        // fetch recs where board_id = current board id
        const { data: recs, error: recsError } = await supabase
            .from("recommendations")
            .select("*")
            .eq("board_id", board_id)
            .order("created_at", { ascending: false });

        if (recsError){
            console.error("Error fetching the boards: ", recsError.message)
            toast.error("Error loading recommendations!");
            return;
        }
        setRecommendations(recs || []);
        setIsLoading(false);
    }

    getCurrentRecs();
  }, []);
  
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Hero Header */}
        <div className="relative py-8 sm:py-16">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                              <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                      {boardName}
                    </h1>
                  </div>
                  {boardDescription && (
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                      {boardDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Created on {boardCreatedAt.split('T')[0]}</span>
                    <span>•</span>
                    <span>{recommendations.length} {recommendations.length === 1 ? 'recommendation' : 'recommendations'}</span>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 h-60 rounded-2xl"
                ></div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-20 space-y-2">
              <FolderOpen className="w-12 h-12 mx-auto text-gray-300" />
              <p className="text-lg font-medium text-gray-500">Your board is empty</p>
              <p className="text-sm text-gray-400">Add your first recommendation to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <Recommendation
                  key={idx}
                  id={rec.id}
                  board_id={rec.board_id}
                  name={rec.name}
                  description={rec.description}
                  comment={rec.comment}
                  rating={rec.rating}
                  thumbnail={rec.public_thumbnail}
                  isPublic={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>  
  );
}
