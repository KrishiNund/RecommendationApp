import Image from "next/image";
import { Star, MoreHorizontal, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Thumbnail area */}
      <div className="relative aspect-video rounded-t-xl overflow-hidden">
        {thumbnail ? (
          <>
            <Image
              src={thumbnail}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-102"
            />
            {isPublic !== true && (
              <div className="absolute top-3 right-3 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-white/80 p-2 rounded-full text-gray-600 hover:text-[#a05a1f] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-md border border-gray-100">
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
                    <button className="bg-white/80 p-2 rounded-full text-gray-600 hover:text-[#a05a1f] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-md border border-gray-100">
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
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#a05a1f] transition-colors">
            {name}
          </h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#bc6c25] text-[#bc6c25]" />
            <span className="text-xs font-medium text-[#a05a1f]">
              {rating}/10
            </span>
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
        
        {comment && (
          <div className="pt-2">
            <p className="text-sm text-gray-500 italic">
              "{comment}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}