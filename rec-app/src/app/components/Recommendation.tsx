import Image from "next/image";
import { Star, MoreHorizontal, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
      className="h-full flex flex-col bg-white/80 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group backdrop-blur-sm"
    >
      {/* Main content (fills height) */}
      <div className="flex-1 flex flex-col">
        {/* Thumbnail area */}
        <div className="relative aspect-video rounded-t-2xl overflow-hidden">
          {thumbnail ? (
            <>
              <motion.div whileHover={{ scale: 1.02 }} className="h-full w-full">
                <Image
                  src={thumbnail}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.();
                        }} 
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-amber-50 text-[#bc6c25]"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}   
            </>
          ) : (
            <div className="relative h-full bg-gray-50">
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.();
                        }} 
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-amber-50 text-[#bc6c25]"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <MessageSquare className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium text-gray-400">No image</p>
              </div>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
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
      {/* Expandable comment section (outside flex-1) */}
      {comment && (
        <AnimatePresence>
          {showComment && (
            <motion.div
              id={`comment-${id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="mt-1 px-5 pb-4"
            >
              <div className="bg-white/90 border border-[#fff7e6] rounded-xl px-4 py-3 shadow-sm text-sm text-gray-700">
                {comment}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}