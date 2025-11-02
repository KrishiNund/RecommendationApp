import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { MoreHorizontal, ChevronRight, LinkIcon, FileHeart, Edit, Trash2, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"
import { useCopyLinkHandler } from "../../lib/CopyLinkHandler"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useState } from "react"

function CopyLinkComponent({ public_id, boardId }: { public_id: string, boardId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { handleCopy, DialogFallback } = useCopyLinkHandler();

  const handleShareBoard = async () => {
    setIsLoading(true);
    const link = `${window.location.origin}/public/${public_id}`;

    const { data: recs, error: fetchError } = await supabase
      .from("recommendations")
      .select("id, thumbnail")
      .eq("board_id", boardId);

    if (fetchError) {
      console.error("Error fetching recommendations:", fetchError.message);
      toast.error("Failed to prepare link.");
      return;
    }

    const updates = await Promise.all(
      recs.map(async (rec) => {
        if (!rec.thumbnail) return null;

        const { data, error } = await supabase
          .storage
          .from("thumbnails")
          .createSignedUrl(rec.thumbnail, 60 * 60 * 24 * 365); // valid 1 year

        if (error) {
          console.warn("Signed URL error for rec:", rec.id, error.message);
          return null;
        }

        return { id: rec.id, public_thumbnail: data?.signedUrl };
      })
    );

    const cleaned = updates.filter(Boolean);

    if (cleaned.length > 0) {
      for (const rec of cleaned) {
        const { error: updateError } = await supabase
          .from("recommendations")
          .update({ public_thumbnail: rec?.public_thumbnail })
          .eq("id", rec?.id);

        if (updateError) {
          console.error(`Error updating recommendation ${rec?.id}:`, updateError.message);
          toast.error("Failed to finalize share.");
          return;
        }
      }
    }

    handleCopy(link);
    setIsLoading(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full h-8 flex items-center space-x-1 text-gray-800 justify-start cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleShareBoard();
        }}
        disabled={isLoading}
      >
        {isLoading ? 
          <Loader2 className="w-4 h-4 animate-spin" /> 
        : 
          <>
            <LinkIcon className="w-4 h-4 mr-1 text-gray-500" />
            <span>Copy Link</span>
          </>
        }
      </Button>

      <DialogFallback />
    </>
  );
}

const categoryColors = {
  anime: "bg-pink-100 text-pink-800",
  apps: "bg-cyan-100 text-cyan-800",
  art: "bg-indigo-100 text-indigo-800",
  books: "bg-orange-100 text-orange-800",
  collectibles: "bg-amber-100 text-amber-800",
  comics: "bg-rose-100 text-rose-800",
  diy: "bg-emerald-100 text-emerald-800",
  education: "bg-violet-100 text-violet-800",
  fashion: "bg-fuchsia-100 text-fuchsia-800",
  fitness: "bg-lime-100 text-lime-800",
  food: "bg-red-100 text-red-800",
  games: "bg-blue-100 text-blue-800",
  gear: "bg-stone-100 text-stone-800",
  lifestyle: "bg-yellow-100 text-yellow-800",
  manga: "bg-purple-100 text-purple-800",
  movies: "bg-orange-200 text-orange-900",
  music: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800",
  photography: "bg-sky-100 text-sky-800",
  podcasts: "bg-teal-100 text-teal-800",
  science: "bg-emerald-200 text-emerald-900",
  tech: "bg-slate-100 text-slate-800",
  travel: "bg-cyan-200 text-cyan-900",
  "TV shows": "bg-violet-200 text-violet-900"
};

type BoardProps = {
  id: string;
  public_id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  onDelete: () => void;
  onEdit: () => void;
  items?: number;
  variant?: "grid" | "list";
};

export default function Board({
  id,
  public_id,
  name, 
  description, 
  category,
  thumbnail = "", 
  onDelete,
  onEdit,
  items = 0,
  variant = "grid" 
}: BoardProps) {
  if (variant === "list") {
    return (
      <Card className="group hover:shadow-sm transition-all duration-300 rounded-lg overflow-hidden p-0 bg-[hsl(28,20%,95%)]">
        <Link href={`/board/${id}`}>
          <CardContent className="p-0">
            <div className="flex items-center relative gap-x-4">
              <div className={`flex-shrink-0 h-30 w-30 ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other} flex items-center justify-center`}>
                {thumbnail ? (
                  <img src={thumbnail} alt="Board Thumbnail" className="w-full h-full object-cover" />
                ): (
                  <span className="text-xl font-medium">
                    {category.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-grow min-w-0 h-30 w-30">
                <div className="flex flex-col items-start justify-around h-full">
                  <div className="flex flex-col items-start mt-2">
                    <CardTitle className="text-lg font-semibold truncate pb-0.5 text-[hsl(28,30%,15%)]">{name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-3 text-[hsl(26,26%,45%)]">
                      {description}
                    </CardDescription>
                  </div>
                 
                  <div className="flex items-center mt-1 space-x-4">
                    <Badge 
                      variant="outline" 
                      className={`px-2 py-0.5 text-xs ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other} border-[hsl(28,21%,85%)]`}
                    >
                      {category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs">
                      <FileHeart className="h-4 w-4 text-[hsl(28,21%,60%)]" />
                      <span className="text-[hsl(28,23%,50%)]">{items}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-8 w-8 text-gray-400 group-hover:text-gray-600 mr-6" />
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="group h-82 flex flex-col hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden border-6 border-double border-[hsl(28,12%,80%)] p-0 gap-y-0">
        
          <CardHeader className="p-0 block relative h-44">
            <div className={`h-full ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other} flex items-center justify-center relative`}>
              {thumbnail ? (
                  <img src={thumbnail} alt="Board Thumbnail" className="w-full h-full object-cover" />
                ): (
                  <span className="text-4xl font-medium text-white/80">
                    {category.charAt(0).toUpperCase()}
                  </span>
                )}

              
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm cursor-pointer border-none hover:border-none"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1 ml-1 text-gray-500"/>
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="flex items-center w-full text-red-600 cursor-pointer justify-start">
                            <Trash2 className="w-4 h-4 mr-1 text-gray-500" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your board
                              and associated recommendations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>

                    <CopyLinkComponent public_id={public_id} boardId={id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <Link href={`/board/${id}`} className="block flex-grow bg-[hsl(28,20%,95%)] relative">
            <CardContent className="pt-2 pr-3 pl-3 pb-2 flex-grow">
              <CardTitle className="text-lg font-semibold truncate text-[hsl(28,30%,15%)]">{name}</CardTitle>
              <CardDescription className="text-[hsl(26,26%,45%)] text-sm line-clamp-2 pt-2">
                {description}
              </CardDescription>
            </CardContent>
            <div className="absolute bottom-2 w-full pl-2 pr-2">
              <div className="flex justify-between items-center">
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`px-2 py-0.5 text-xs ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other} border-[hsl(28,21%,85%)]`}
                    >
                      {category}
                    </Badge>
                  </div>
    
                  <div className="flex items-center space-x-1 text-xs">
                    <FileHeart className="h-4 w-4 text-[hsl(28,21%,60%)]" />
                    <span className="text-[hsl(28,23%,50%)]">{items}</span>
                  </div>
              </div>
            </div>
          </Link>
      </Card>
    </motion.div>
  )
}