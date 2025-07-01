// dashboard.tsx
"use client"

import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, LayoutGrid, List, CircleSlash2 } from "lucide-react"
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
import { v4 as uuidv4 } from 'uuid'

export default function Dashboard() {
  const [boardName, setBoardName] = useState("")
  const [boardDescription, setBoardDescription] = useState("")
  const [boardCategory, setBoardCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [parent] = useAutoAnimate()
  const [editingBoard, setEditingBoard] = useState<BoardType | null>(null)

  
  // board object properties
  type BoardType = {
    id: string;
    name: string;
    description: string;
    category: string;
  }
  
  // array that contains board objects
  const [boards, setBoards] = useState<BoardType[]>([])

  // add a recommendation board
  const addBoard = (e?: React.MouseEvent) => {
    // prevent submitting of board details form
    if (e) e.preventDefault()
    
    // don't create board if no board name entered
    if (!boardName.trim()) return

    // new board component details
    const newBoard = {
      id:uuidv4(),
      name: boardName,
      description: boardDescription,
      category: boardCategory
    }
    
    // create new boards array with new board object added to it
    setBoards([...boards, newBoard])
    
    // reset form
    setBoardName("")
    setBoardDescription("")
    setBoardCategory("")
  }
  
  // delete a board
  const deleteBoard = (id:string) => {
    setBoards(prevBoards => prevBoards.filter(board => board.id !== id));
  }

  // edit board details
  const editBoard = (updatedBoard: BoardType) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.id === updatedBoard.id ? updatedBoard : board
      )
    )
    setEditingBoard(null) // close the modal
  }

  // searching for board by name, description or category
  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
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
              {/* create board dialog to enter details of board to be created */}
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
                        maxLength={50}
                        value={boardName}
                        onChange={e => setBoardName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="What's this board about?"
                        maxLength={120}
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

              {/* editing board dialog with pre filled details */}
              {editingBoard && (
                <Dialog open={true} onOpenChange={() => setEditingBoard(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Board</DialogTitle>
                      <DialogDescription>Update your board details</DialogDescription>
                    </DialogHeader>

                    {/* Form pre-filled with editingBoard */}
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="editName">Name</Label>
                        <Input
                          id="editName"
                          value={editingBoard.name}
                          onChange={(e) =>
                            setEditingBoard({ ...editingBoard, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editDescription">Description</Label>
                        <Input
                          id="editDescription"
                          value={editingBoard.description}
                          onChange={(e) =>
                            setEditingBoard({ ...editingBoard, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select
                          value={editingBoard.category}
                          onValueChange={(value) =>
                            setEditingBoard({ ...editingBoard, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="anime">Anime</SelectItem>
                            <SelectItem value="manga">Manga/Manhwa</SelectItem>
                            <SelectItem value="games">Games</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => editBoard(editingBoard)}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

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
                  <CircleSlash2 className="h-8 w-8 text-[#bc6c25]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No boards found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery 
                    ? "Try adjusting your search query"
                    : "Create your first board to get started"}
                </p>
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
                    <Board
                      key={board.id}
                      id={board.id}
                      name={board.name}
                      description={board.description}
                      category={board.category}
                      onDelete={() => deleteBoard(board.id)}
                      onEdit={() => setEditingBoard(board)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBoards.map((board, idx) => (
                  <motion.div
                    key= {idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Board
                      key={board.id}
                      id={board.id}
                      name={board.name}
                      description={board.description}
                      category={board.category}
                      onDelete={() => deleteBoard(board.id)}
                      onEdit={() => setEditingBoard(board)}
                      variant="list" 
                    />
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