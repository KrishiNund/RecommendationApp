// board.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { MoreHorizontal, ChevronRight, LinkIcon, FileHeart, Edit, Trash2 } from "lucide-react"
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

// // copies link to clipboard if possible else shows a dialog to allow manual copying
// function CopyLinkComponent({ public_id }: { public_id: string }) {
//   const { handleCopy, DialogFallback } = useCopyLinkHandler(public_id)

//   return (
//     <>
//       <Button
//         variant="ghost"
//         className="w-full h-8 flex items-center space-x-1 text-gray-800 justify-start cursor-pointer"
//         onClick={handleCopy}
//       >
//         <LinkIcon className="w-4 h-4 mr-1 text-gray-500" />
//         <span>Copy Link</span>
//       </Button>

//       <DialogFallback />
//     </>
//   )
// }
function CopyLinkComponent({ public_id, boardId }: { public_id: string, boardId: string }) {
  const { handleCopy, DialogFallback } = useCopyLinkHandler();

  const handleShareBoard = async () => {
    const link = `${window.location.origin}/public/${public_id}`;

    // 1. Fetch recommendations for the board
    const { data: recs, error: fetchError } = await supabase
      .from("recommendations")
      .select("id, thumbnail")
      .eq("board_id", boardId);

    if (fetchError) {
      console.error("Error fetching recommendations:", fetchError.message);
      toast.error("Failed to prepare link.");
      return;
    }

    // 2. Create signed URLs
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

    // 3. Batch update
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

    // 4. Copy the final link
    handleCopy(link);
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
      >
        <LinkIcon className="w-4 h-4 mr-1 text-gray-500" />
        <span>Copy Link</span>
      </Button>

      <DialogFallback />
    </>
  );
}
const categoryColors = {
  anime: "bg-pink-100 text-pink-800",
  manga: "bg-purple-100 text-purple-800",
  games: "bg-blue-100 text-blue-800",
  music: "bg-green-100 text-green-800",
  movies: "bg-yellow-100 text-yellow-800",
  books: "bg-orange-100 text-orange-800",
  podcasts: "bg-cyan-100 text-cyan-800",
  tech: "bg-slate-100 text-slate-800",
  food: "bg-red-100 text-red-800",
  travel: "bg-teal-100 text-teal-800",
  fitness: "bg-lime-100 text-lime-800",
  fashion: "bg-fuchsia-100 text-fuchsia-800",
  art: "bg-indigo-100 text-indigo-800",
  science: "bg-emerald-100 text-emerald-800",
  other: "bg-gray-100 text-gray-800"
}

// all parameters that can be passed to the board component
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
      <Card className="group hover:shadow-sm transition-all duration-300 rounded-lg overflow-hidden">
        <Link href={`/board/${id}`} className="block">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className={`flex-shrink-0 h-16 w-16 rounded-lg ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other} flex items-center justify-center mr-4`}>
                {thumbnail ? (
                  <img src={thumbnail} alt="Board Thumbnail" className="w-full h-full object-cover rounded-lg" />
                ): (
                  <span className="text-xl font-medium">
                    {category.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <CardTitle className="text-lg font-semibold truncate">{name}</CardTitle>
                <CardDescription className="text-gray-500 text-sm truncate">
                  {description}
                </CardDescription>
                <div className="flex items-center mt-1 space-x-4">
                  <Badge 
                    variant="outline" 
                    className={`px-2 py-0.5 text-xs ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other}`}
                  >
                    {category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FileHeart className="h-4 w-4 text-yellow-500" />
                    <span>{items}</span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 ml-4" />
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  // by default, if variant is not specified, grid display will be used
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="group h-82 flex flex-col hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden border border-gray-100 p-0">
        
          <CardHeader className="p-0">
            <div className={`h-40 ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other} flex items-center justify-center relative`}>
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
                      className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm cursor-pointer"
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

                    
                    {/* adds copy link to clipboard component */}
                    {/* <CopyLinkComponent public_id={public_id}/> */}
                    <CopyLinkComponent public_id={public_id} boardId={id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <Link href={`/board/${id}`} className="block flex-grow">
            <CardContent className="pl-4 pr-4 pb-2 flex-grow">
              <CardTitle className="text-lg font-semibold mb-1 truncate">{name}</CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2 mb-3">
                {description}
              </CardDescription>
              
              <div className="flex justify-between items-center mt-6">
                <Badge 
                  variant="outline" 
                  className={`px-2 py-0.5 text-xs ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other}`}
                >
                  {category}
                </Badge>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <FileHeart className="h-4 w-4 text-yellow-500" />
                  <span>{items}</span>
                </div>
              </div>
            </CardContent>
          </Link>
      </Card>
    </motion.div>
  )
}