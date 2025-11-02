// dashboard.tsx
"use client"

import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, LayoutGrid, List, CircleSlash2, Upload, AlertCircle, Loader2} from "lucide-react"
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
import { supabase } from '@/lib/supabase'
import { User } from "@supabase/supabase-js"
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useInsertUserOnAuth } from "../hooks/useInsertUserOnAuth"
import { toast } from "sonner"
import imageCompression from 'browser-image-compression';


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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [boards, setBoards] = useState<BoardType[]>([])
  const [userPlan, setUserPlan] = useState("")
  // const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);

  // on load add the user's plan to the users table
  useInsertUserOnAuth()

  // on page load, fetch the boards for the current logged in user
  useEffect(() => {
    async function getCurrentUserAndBoards() {
      setIsLoading(true);
      
      // get user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        console.log("User not found:", sessionData.session);
        return;
      }

      const currentUser = sessionData.session.user;
      setUser(currentUser);

      // Fetch user plan
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("plan")
        .eq("id", currentUser.id)
        .limit(1);

      if (userError) {
        console.error("Error fetching user plan:", userError.message);
        return;
      }

      setUserPlan(userData?.[0]?.plan || "free");

      // Fetch boards for current user
      const { data: boards, error: boardsError } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (boardsError) {
        console.error("Error fetching boards:", boardsError.message);
        setIsLoading(false);
        return;
      }

      // Get signed URLs for each thumbnail of each board
      const boardsWithThumbnails = await Promise.all(
        (boards ?? []).map(async (board) => {
          if (board.thumbnail) {
            const { data: signedUrlData, error: signedUrlError } = await supabase
              .storage
              .from("thumbnails") // replace with your actual bucket name
              .createSignedUrl(board.thumbnail, 60 * 60); // valid for 1 hour

            if (signedUrlError) {
              console.error(`Error getting signed URL for board ${board.id}:`, signedUrlError.message);
              return board;
            }

            return { ...board, thumbnail: signedUrlData.signedUrl };
          }
          return board;
        })
      );
      setBoards(boardsWithThumbnails);
      setIsLoading(false);
    }

    getCurrentUserAndBoards();
  }, []);

  // state to check if boards can be created or not
  const canCreateBoard = userPlan === "pro" || (userPlan === "free" && boards.length < 3);
  
  // board object properties
  type BoardType = {
    id: string;
    public_id: string;
    name: string;
    description: string;
    category: string;
    thumbnail?: string;
    user_id:string;
    num_items: number;
  }

  // add a recommendation board
  const addBoard = async (e?: React.MouseEvent) => {
    setIsLoading(true);
    if (e) e.preventDefault();
    if (!boardName.trim()) return;

    if (!user) {
      toast.error("User not found");
      setIsLoading(false);
      return;
    }

    let thumbnailPath = "";

    // Upload file only if a file is selected
    if (selectedFile) {
      // try compressing the file
      try{
        // Resize and convert
        const compressedFile = await imageCompression(selectedFile, {
          maxWidthOrHeight: 3000, // Resize while keeping aspect ratio
          maxSizeMB: 0.2,        // Target compressed size ~200KB
          fileType: 'image/webp', // Convert to WebP
          useWebWorker: true,
        });

        // setSelectedFile(compressedFile)
        // const fileExt = selectedFile.name.split('.').pop();
        const path = `boards/${uuidv4()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(path, compressedFile, {
            cacheControl: '3600',
            upsert: false, // prevent replacing
          });

        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          toast.error("Thumbnail upload failed");
          setIsLoading(false);
          return;
        }

        thumbnailPath = path;

      } catch (err){
        console.error("Image compression failed:", err);
        toast.error("Image processing failed.");
      }  
    }

    // Insert into boards table
    const { data, error } = await supabase
      .from("boards")
      .insert({
        id: uuidv4(),
        public_id: uuidv4(),
        name: boardName,
        description: boardDescription,
        category: boardCategory,
        thumbnail: thumbnailPath || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Board creation failed:", error.message);
      toast.error("Failed to create board!");
      setIsLoading(false);
      return;
    }

    // get signed url of uploaded thumbnail after uplaoding thumbnail
    if (thumbnailPath !== ""){
      const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from("thumbnails")
      .createSignedUrl(thumbnailPath, 60 * 60); // valid for 1 hour

      if (signedUrlError) {
        console.error(`Error getting signed URL for board ${data.id}:`, signedUrlError.message);
      }
      const thumbnailUrl = signedUrlData?.signedUrl || "";

      // Add board to UI
      setBoards([...boards, { ...data, thumbnail: thumbnailUrl }]);
    } else {
      // Add board to UI
      setBoards([...boards, data]);
    }
    
    console.log("Board added successfully");
    toast.success("Board added successfully!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    });
    // Reset
    setBoardName("");
    setBoardDescription("");
    setBoardCategory("");
    setBoardThumbnail("");
    setSelectedFile(null);
    setIsDialogOpen(false);
    setIsLoading(false);
  };
  
  // delete a board with its thumbnail as well
  const deleteBoard = async (id: string) => {
    setIsLoading(true);

    // Step 1: Get board's thumbnail path
    const { data: boardData, error: fetchBoardError } = await supabase
      .from("boards")
      .select("thumbnail")
      .eq("id", id)
      .single();

    if (fetchBoardError) {
      console.error("Failed to fetch board before delete:", fetchBoardError.message);
      setIsLoading(false);
      return;
    }

    const boardThumbnailPath = boardData?.thumbnail;

    // Step 2: Get recommendation thumbnail paths before board deletion
    const { data: recData, error: fetchRecsError } = await supabase
      .from("recommendations")
      .select("thumbnail")
      .eq("board_id", id);

    if (fetchRecsError) {
      console.error("Failed to fetch recommendations before delete:", fetchRecsError.message);
      setIsLoading(false);
      return;
    }

    const recommendationThumbnailPaths = (recData || [])
      .map(rec => rec.thumbnail)
      .filter(Boolean); // remove null/undefined

    // Step 3: Delete board (cascades recommendations)
    const { error: deleteBoardError } = await supabase
      .from("boards")
      .delete()
      .eq("id", id);

    if (deleteBoardError) {
      console.error("Failed to delete board:", deleteBoardError.message);
      setIsLoading(false);
      return;
    }

    // Step 4: Delete board thumbnail (if exists)
    if (boardThumbnailPath) {
      const { error: deleteBoardThumbError } = await supabase.storage
        .from("thumbnails")
        .remove([boardThumbnailPath]);

      if (deleteBoardThumbError) {
        console.warn("Board deleted but thumbnail not removed:", deleteBoardThumbError.message);
      }
    }

    // Step 5: Delete recommendation thumbnails (if any)
    if (recommendationThumbnailPaths.length > 0) {
      const { error: deleteRecsThumbsError } = await supabase.storage
        .from("thumbnails")
        .remove(recommendationThumbnailPaths);

      if (deleteRecsThumbsError) {
        console.warn("Some recommendation thumbnails not deleted:", deleteRecsThumbsError.message);
      }
    }

    // Step 6: Update UI
    setBoards(prevBoards => prevBoards.filter(board => board.id !== id));
    setIsLoading(false);
    toast.success("Board deleted!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    });
  };

  // edit board details
  const editBoard = async (updatedBoard: BoardType) => {
    setIsLoading(true);

    let oldThumbnailPath = "";
    let newThumbnailPath = "";
    
    // fetch the actual thumbnail path from DB 
    const { data: boardFromDB, error: fetchError } = await supabase
      .from("boards")
      .select("thumbnail")
      .eq("id", updatedBoard.id)
      .single();

    if (fetchError || !boardFromDB) {
      console.error("Error fetching original board:", fetchError?.message);
      toast.error("Error updating board");
      setIsLoading(false);
      return;
    }

    oldThumbnailPath = boardFromDB.thumbnail;
    newThumbnailPath = oldThumbnailPath;

    // upload new thumbnail if there's a new file
    if (selectedEditFile) {
      // try compressing the file
      try{
        // Resize and convert
        const compressedFile = await imageCompression(selectedEditFile, {
          maxWidthOrHeight: 3000, // Resize while keeping aspect ratio
          maxSizeMB: 0.2,        // Target compressed size ~200KB
          fileType: 'image/webp', // Convert to WebP
          useWebWorker: true,
        });

        // setSelectedEditFile(compressedFile)
        // const fileExt = selectedEditFile.name.split(".").pop();
        const filePath = `boards/${uuidv4()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("thumbnails")
          .upload(filePath, compressedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload failed:", uploadError.message);
          toast.error("Thumbnail upload failed");
          setIsLoading(false);
          return;
        }

        newThumbnailPath = filePath;

      } catch (err){
        console.error("Image compression failed:", err);
        toast.error("Image processing failed.");
      }

      // delete the old thumbnail (using real path)
      if (oldThumbnailPath && oldThumbnailPath !== newThumbnailPath) {
        const { error: deleteError } = await supabase.storage
          .from("thumbnails")
          .remove([oldThumbnailPath]);

        if (deleteError) {
          console.warn("Failed to delete old thumbnail:", deleteError.message);
        }
      }
    }

    // update board in DB
    const { data, error: updateError } = await supabase
      .from("boards")
      .update({
        name: updatedBoard.name,
        description: updatedBoard.description,
        category: updatedBoard.category,
        thumbnail: newThumbnailPath,
      })
      .eq("id", updatedBoard.id);

    if (updateError) {
      console.error("Update failed:", updateError.message);
      toast.error("Board update failed");
      setIsLoading(false);
      return;
    }

    // get signed URL for updated thumbnail (for UI)
    if (newThumbnailPath !== ""){
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("thumbnails")
      .createSignedUrl(newThumbnailPath, 60 * 60);

      const thumbnailUrl = signedUrlData?.signedUrl || "";

      // update local state
      setBoards(prev =>
        prev.map(b =>
          b.id === updatedBoard.id
            ? { ...updatedBoard, thumbnail: thumbnailUrl }
            : b
        )
      );
    } else {
      // update local state
      setBoards(prev =>
        prev.map(b =>
          b.id === updatedBoard.id
            ? { ...updatedBoard, data }
            : b
        )
      );
    }
    
    setIsLoading(false);
    setEditingBoard(null);
    toast.success("Board updated!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    });
  };

  // searching for board by name, description or category
  const filteredBoards = boards.filter(board => 
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // handle uploading of an image for the thumnail of the board when creating board
  // Updated thumbnail input handler (just previews and stores file)
  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // Store the file in state

    // For preview purposes (image appears as preview)
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setBoardThumbnail(reader.result); // still show preview
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(28,15%,15%)]">My Boards</h1>
              <p className="text-[hsl(28,12%,45%)] mt-1">Create and manage your recommendation boards</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(28,10%,70%)]"/>
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
                  <Button
                    onClick={() => {
                      if (canCreateBoard) setIsDialogOpen(true);
                    }}
                    disabled={!canCreateBoard || isLoading}
                    className={`bg-[hsl(28,70%,50%)] hover:bg-[hsl(28,70%,60%)] text-[hsl(28,20%,15%)] shadow-sm cursor-pointer ${
                      !canCreateBoard ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Board
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
                        placeholder="Enter a board name (e.g., Best Cozy Games)"
                        maxLength={30}
                        value={boardName}
                        onChange={e => setBoardName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Describe your board (e.g.,best games to play when it's raining outside)"
                        maxLength={80}
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
                            <SelectItem value="apps">Apps</SelectItem>
                            <SelectItem value="art">Art</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="collectibles">Collectibles</SelectItem>
                            <SelectItem value="comics">Comics</SelectItem>
                            <SelectItem value="diy">DIY</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="games">Games</SelectItem>
                            <SelectItem value="gear">Gear</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="manga">Manga</SelectItem>
                            <SelectItem value="movies">Movies</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="podcasts">Podcasts</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="tech">Tech</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="TV shows">TV shows</SelectItem>
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
                          <div className="text-center p-4">
                              <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                              <span className="text-gray-500 text-sm">Click to upload image</span>
                            </div>
                        )}
                        <Input
                          id="thumbnailInput"
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
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
                      disabled={!boardName.trim() || !boardCategory || isLoading}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Board"}
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
                          placeholder="Enter a board name (e.g., Best Cozy Games)"
                          maxLength={30}
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
                          placeholder="Describe your board (e.g.,best games to play when it's raining outside)"
                          maxLength={80}
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
                            <SelectGroup>
                              <SelectItem value="anime">Anime</SelectItem>
                              <SelectItem value="apps">Apps</SelectItem>
                              <SelectItem value="art">Art</SelectItem>
                              <SelectItem value="books">Books</SelectItem>
                              <SelectItem value="collectibles">Collectibles</SelectItem>
                              <SelectItem value="comics">Comics</SelectItem>
                              <SelectItem value="diy">DIY</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="fashion">Fashion</SelectItem>
                              <SelectItem value="fitness">Fitness</SelectItem>
                              <SelectItem value="food">Food</SelectItem>
                              <SelectItem value="games">Games</SelectItem>
                              <SelectItem value="gear">Gear</SelectItem>
                              <SelectItem value="lifestyle">Lifestyle</SelectItem>
                              <SelectItem value="manga">Manga</SelectItem>
                              <SelectItem value="movies">Movies</SelectItem>
                              <SelectItem value="music">Music</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="photography">Photography</SelectItem>
                              <SelectItem value="podcasts">Podcasts</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="tech">Tech</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="TV shows">TV shows</SelectItem>
                            </SelectGroup>
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
                            <div className="text-center p-4">
                              <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                              <span className="text-gray-500 text-sm">Click to upload image</span>
                            </div>
                          )}
                          <Input
                            id="thumbnailInput"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              setSelectedEditFile(file); // Store the file in state
                              
                              // For preview
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  setEditingBoard(prev =>
                                    prev ? { ...prev, thumbnail: reader.result as string } : null
                                  );
                                }
                              };
                              reader.readAsDataURL(file);
                              
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
                        onClick={async () => await editBoard(editingBoard)} 
                        disabled={!editingBoard.name.trim() || !editingBoard.category || isLoading}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

            </div>
          </div>

          {/* place alert here if cannot create boards anymore */}
          {(!canCreateBoard && !isLoading) && (
            <Alert>
              <AlertCircle />
                <AlertTitle>Board limit reached</AlertTitle>
                <AlertDescription>
                You've reached the limit of 3 boards on the free plan. Upgrade to Pro to create more boards.
                </AlertDescription>
            </Alert>
          )}

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
            {/* if boards are still being fetched show skeletons in their place */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 h-40 rounded-xl"
                    ></div>
                  ))}
                </div>
            // if no boards, display message
            ) : filteredBoards.length === 0 ? (
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
                      public_id={board.public_id}
                      name={board.name}
                      description={board.description}
                      category={board.category}
                      thumbnail={board.thumbnail}
                      onDelete={() => deleteBoard(board.id)}
                      onEdit={() => setEditingBoard(board)}
                      items={board.num_items}
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
                      public_id={board.public_id}
                      name={board.name}
                      description={board.description}
                      category={board.category}
                      thumbnail={board.thumbnail}
                      onDelete={() => deleteBoard(board.id)}
                      onEdit={() => setEditingBoard(board)}
                      variant="list" 
                      items={board.num_items}
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