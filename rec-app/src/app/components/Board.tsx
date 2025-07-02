// board.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Star, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"

const categoryColors = {
  anime: "bg-pink-100 text-pink-800",
  manga: "bg-purple-100 text-purple-800",
  games: "bg-blue-100 text-blue-800",
  music: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800"
}

// all parameters that can be passed to the board component
type BoardProps = {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  onDelete: () => void;
  onEdit: () => void;
  items?: number;
  updatedAt?: string;
  variant?: "grid" | "list";
};

export default function Board({
  id,
  name, 
  description, 
  category,
  thumbnail = "", 
  onDelete,
  onEdit,
  items = 0,
  updatedAt = "",
  variant = "grid" 
}: BoardProps) {
  if (variant === "list") {
    return (
      <Card className="group hover:shadow-sm transition-all duration-300 rounded-lg overflow-hidden">
        <Link href={`/board/${name.toLowerCase().replace(/\s+/g, '-')}`} className="block">
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
                  <span className="text-xs text-gray-500">{items} items</span>
                  <span className="text-xs text-gray-500">Updated {updatedAt}</span>
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
      <Card className="group h-90 flex flex-col hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden border border-gray-100">
        <Link href={`/board/${id}`} className="block flex-grow">
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
                      className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold mb-1 truncate">{name}</CardTitle>
            <CardDescription className="text-gray-600 text-sm line-clamp-2 mb-3">
              {description}
            </CardDescription>
            
            <div className="flex justify-between items-center">
              <Badge 
                variant="outline" 
                className={`px-2 py-0.5 text-xs ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other}`}
              >
                {category}
              </Badge>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Star className="h-3 w-3" />
                <span>{items}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0">
            <div className="w-full text-xs text-gray-500">
              Updated {updatedAt}
            </div>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  )
}