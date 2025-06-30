// dashboard.tsx
"use client"

import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, LayoutGrid, List } from "lucide-react"
import { useState } from "react"
import Board from "../components/Board"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useAutoAnimate } from "@formkit/auto-animate/react"

const categoryColors = {
  anime: "bg-pink-100 text-pink-800",
  manga: "bg-purple-100 text-purple-800",
  games: "bg-blue-100 text-blue-800",
  music: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800"
}

export default function Dashboard() {
  const [boardName, setBoardName] = useState("")
  const [boardDescription, setBoardDescription] = useState("")
  const [boardCategory, setBoardCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [parent] = useAutoAnimate()
  
  const [boards, setBoards] = useState([
    {
      name: "Best Anime of 2023",
      description: "My personal picks for the top anime releases this year",
      category: "anime",
      items: 12,
      updatedAt: "2 days ago"
    },
    {
      name: "Gaming Recommendations",
      description: "Games I've enjoyed across different platforms",
      category: "games",
      items: 8,
      updatedAt: "1 week ago"
    },
    {
      name: "Music Playlist",
      description: "Songs I'm currently obsessed with",
      category: "music",
      items: 24,
      updatedAt: "3 days ago"
    }
  ])

  const addBoard = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    if (!boardName.trim()) return
    
    setBoards([
      ...boards,
      {
        name: boardName,
        description: boardDescription,
        category: boardCategory,
        items: 0,
        updatedAt: "Just now"
      }
    ])
    setBoardName("")
    setBoardDescription("")
    setBoardCategory("")
  }

  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
              <p className="text-gray-500 mt-1">Create and manage your recommendation boards</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search boards..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#bc6c25] hover:bg-[#a05a1f] shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Create Board
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Create New Board</DialogTitle>
                    <DialogDescription>
                      Share your recommendations with the world
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="boardName">Board Name *</Label>
                      <Input
                        id="boardName"
                        placeholder="e.g. Best Anime of 2023"
                        value={boardName}
                        onChange={e => setBoardName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="What's this board about?"
                        value={boardDescription}
                        onChange={e => setBoardDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Category *</Label>
                      <Select
                        value={boardCategory}
                        onValueChange={setBoardCategory}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="anime">Anime</SelectItem>
                            <SelectItem value="manga">Manga/Manhwa</SelectItem>
                            <SelectItem value="games">Games</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      onClick={addBoard}
                      disabled={!boardName.trim() || !boardCategory}
                    >
                      Create Board
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Showing {filteredBoards.length} {filteredBoards.length === 1 ? "board" : "boards"}
            </div>
            <Tabs 
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "grid" | "list")}
              className="hidden sm:block"
            >
              <TabsList className="grid grid-cols-2 w-24">
                <TabsTrigger value="grid">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Boards Display */}
          <div ref={parent}>
            {filteredBoards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="bg-[#f5ebe1] p-6 rounded-full mb-4">
                  <Plus className="h-8 w-8 text-[#bc6c25]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No boards found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery 
                    ? "Try adjusting your search query"
                    : "Create your first board to get started"}
                </p>
                <Button className="mt-4 bg-[#bc6c25] hover:bg-[#a05a1f]">
                  <Plus className="mr-2 h-4 w-4" /> Create Board
                </Button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoards.map((board, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Board {...board} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBoards.map((board, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Board {...board} variant="list" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}