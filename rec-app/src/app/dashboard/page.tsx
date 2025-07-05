// dashboard.tsx
"use client"

import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, LayoutGrid, List, CircleSlash2 } from "lucide-react"
import { useState, useEffect } from "react"
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
import { supabase } from '@/lib/supabase'


export default function Dashboard() {
  const [boardName, setBoardName] = useState("")
  const [boardDescription, setBoardDescription] = useState("")
  const [boardCategory, setBoardCategory] = useState("")
  const [boardThumbnail, setBoardThumbnail] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [parent] = useAutoAnimate()
  const [editingBoard, setEditingBoard] = useState<BoardType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchBoards() {
      const boards = await getBoards();
      setBoards(boards ?? []); // ensure boards is never undefined
  }

   fetchBoards();
  }, []);
  
  // board object properties
  type BoardType = {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail?: string;
    created_at: string;
  }
  
  // array that contains board objects
  const [boards, setBoards] = useState<BoardType[]>([])

  // get boards
  const getBoards = async () => {
    // getting the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      // Optionally, show an error or return early
      alert("You must be logged in to create a board.");
      return;
    }

    const userId = user.id;

    // fetch boards where user_id = current user
    const { data: boards, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching boards:", error.message);
      return [];
    }

    return boards || [];
  }

  // add a recommendation board
  const addBoard = async (e?: React.MouseEvent) => {
    // prevent submitting of board details form
    if (e) e.preventDefault()
    
    // don't create board if no board name entered
    if (!boardName.trim()) return

    // getting the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      // Optionally, show an error or return early
      alert("You must be logged in to create a board.");
      return;
    }

    // inserting board details into boards table
    const {data, error} = await supabase.from("boards").insert(
      {
        name:boardName,
        description: boardDescription,
        category: boardCategory,
        thumbnail: boardThumbnail,
        user_id: user.id, // foreign key --> board is associated with the user logged in
      }
    )
    .select()
    .single()

    if (error) {
      console.error("Failed to insert board:", error.message);
      return;
    }

    // create new boards array with new board object added to it
    setBoards([...boards, data])

    // reset form when dialog is closed
    setBoardName("");
    setBoardDescription("");
    setBoardCategory("");
    setBoardThumbnail("");
    
    // close dialog after successful creation
    setIsDialogOpen(false); 
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

  // handle uploading of an image for the thumnail of the board
  // either when creating a board or editing its contents
  const handleThumbnailUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onThumbnailSet: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onThumbnailSet(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  // reset form when dialog is closed
                  setBoardName("");
                  setBoardDescription("");
                  setBoardCategory("");
                  setBoardThumbnail("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-[#bc6c25] hover:bg-[#a05a1f] shadow-sm">
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

                    {/* thumbnail image input */}
                    <div className="grid gap-2">
                      <Label htmlFor="thumbnail" className="text-sm font-medium text-gray-700">
                        Thumbnail
                      </Label>

                      <div
                        className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 w-full flex items-center justify-center cursor-pointer hover:border-[#bc6c25] transition"
                        onClick={() => document.getElementById("thumbnailInput")?.click()}
                      >
                        {boardThumbnail ? (
                          <img
                            src={boardThumbnail}
                            alt="Thumbnail Preview"
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">Click to upload thumbnail</span>
                        )}
                        <Input
                          id="thumbnailInput"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleThumbnailUpload(e, (base64) => setBoardThumbnail(base64))
                          }}
                          className="hidden"
                        />
                      </div>
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
                      {/* edit thumbnail image */}
                      <div className="grid gap-2">
                        <Label htmlFor="thumbnail" className="text-sm font-medium text-gray-700">
                          Thumbnail
                        </Label>

                        <div
                          className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 w-full flex items-center justify-center cursor-pointer hover:border-[#bc6c25] transition"
                          onClick={() => document.getElementById("thumbnailInput")?.click()}
                        >
                          {editingBoard.thumbnail ? (
                            <img
                              src={editingBoard.thumbnail}
                              alt="Thumbnail Preview"
                              className="h-full w-full object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">Click to upload thumbnail</span>
                          )}
                          <Input
                            id="thumbnailInput"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleThumbnailUpload(e, (base64) =>
                                setEditingBoard(prev=>
                                  prev? {...prev, thumbnail: base64}: null
                                )
                              )
                            }}
                            className="hidden"
                          />
                        </div>
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
            {/* if no boards, display message */}
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
              // if view mode is grid, display boards in grid layout
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
                      thumbnail={board.thumbnail}
                      onDelete={() => deleteBoard(board.id)}
                      onEdit={() => setEditingBoard(board)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              // else display in list layout
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
                      thumbnail={board.thumbnail}
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