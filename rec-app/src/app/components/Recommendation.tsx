import Image from "next/image";
import { Star, MoreHorizontal, MessageSquare, Trash2, Edit, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";

type RecProps = {
  id: string;
  board_id: string;
  name: string;
  description: string;
  comment: string;
  rating: number;
  thumbnail?: string;
  isPublic:boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function Recommendation({
  id,
  board_id,
  name,
  description,
  comment,
  rating,
  thumbnail,
  isPublic = false,
  onEdit,
  onDelete
}: RecProps) {
  const [showComment, setShowComment] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 6px 24px rgba(0,0,0,0.10)" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="relative flex flex-col bg-white/80 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group backdrop-blur-sm"
    >
      {/* Main content (variable height) */}
      <div className="flex flex-col">
        {/* Thumbnail area */}
        <div className="relative aspect-video rounded-t-2xl overflow-hidden">
          {thumbnail ? (
            <>
              <div className="h-full w-full">
                <img
                  src={thumbnail}
                  alt={name}
                  className="object-cover transition-transform duration-300 w-full h-full"
                  style={{ position: "absolute", inset: 0 }}
                />
              </div>
              {isPublic !== true && (
                <div className="absolute top-3 right-3 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button whileTap={{ scale: 0.96 }} className="bg-white/80 p-2 rounded-full text-gray-600 hover:text-[#a05a1f] transition-colors shadow border border-gray-200 cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-md border border-gray-100 animate-fade-in">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.();
                        }}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-amber-50"
                      >
                        <Edit className="w-4 h-4 mr-1 text-gray-500" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="flex items-center w-full text-red-600 cursor-pointer justify-start">
                              <Trash2 className="w-4 h-4 mr-1 ml-1 text-gray-500" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your recommendation.
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

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}   
            </>
          ) : (
            <div className="relative h-full bg-gradient-to-br from-amber-50 to-gray-100 flex items-center justify-center">
              {isPublic !== true && (
                <div className="absolute top-3 right-3 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button whileTap={{ scale: 0.96 }} className="bg-white/80 p-2 rounded-full text-gray-600 hover:text-[#a05a1f] transition-colors shadow border border-gray-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-md border border-gray-100 animate-fade-in">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.();
                        }}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-amber-50"
                      >
                        <Edit className="w-4 h-4 mr-1 text-gray-500" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="flex items-center w-full text-red-600 cursor-pointer justify-start">
                              <Trash2 className="w-4 h-4 mr-1 ml-1 text-gray-500" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your recommendation.
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

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              
                <div className="flex items-center justify-center mb-2">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ffe5b4] text-[#bc6c25] text-3xl font-bold shadow">
                    {name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-5 space-y-4 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#a05a1f] transition-colors">
              {name}
            </h2>
            <motion.div
              whileHover={{ boxShadow: "0 2px 8px #ffe5b4b0" }}
              className="flex items-center gap-1 px-3 py-1 bg-white/70 backdrop-blur border border-amber-100 rounded-full shadow-sm cursor-default min-w-[56px] justify-center"
              title={`Rating: ${rating}/10`}
            >
              <span className="text-base font-bold text-[#bc6c25]">{rating}</span>
              <Star className="w-4 h-4 ml-1 text-[#f5b342] fill-[#f5b342] drop-shadow-sm" />
            </motion.div>
          </div>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          )}
          {comment && (
            <div className="pt-1 mt-auto">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ backgroundColor: "#fff7e6" }}
                className="flex items-center gap-2 text-xs font-medium text-[#a05a1f] bg-white border border-amber-50 rounded-full px-2.5 py-1 shadow-sm transition-colors focus:outline-none cursor-pointer"
                onClick={() => setShowComment((v) => !v)}
                aria-expanded={showComment}
                aria-controls={`comment-${id}`}
              >
                <MessageSquare className="w-4 h-4" />
                {/* {showComment ? "Hide Comment" : "Show Comment"} */}
              </motion.button>
            </div>
          )}
        </div>
      </div>
      
      {/* Expandable comment section (absolute positioned) */}
      {comment && (
        <AnimatePresence>
          {showComment && (
            <motion.div
              id={`comment-${id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-100 rounded-b-2xl shadow-lg"
            >
              <div className="p-5">
                <div className="relative">
                  <button
                    onClick={() => setShowComment(false)}
                    className="absolute -top-2 -right-2 bg-white/90 border border-amber-100 shadow-md rounded-full p-1.5 text-gray-500 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-colors cursor-pointer"
                    aria-label="Close comment"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="bg-white/90 border border-[#fff7e6] rounded-xl px-4 py-3 shadow-sm text-sm text-gray-700">
                    {comment}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}