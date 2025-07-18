"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Sparkles, Upload,Loader2, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Recommendation from "@/app/components/Recommendation";
import { supabase } from "@/lib/supabase";
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
import { Slider } from "@/components/ui/slider";
import { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

export default function BoardPage() {
    // types of a recommendation object
  type RecType = {
    id: string;
    board_id: string;
    name: string;
    description: string;
    comment: string;
    rating: number;
    thumbnail?: string;
    created_at: string;
  };
  const router = useRouter();
  const [boardName, setBoardName] = useState("Loading...");
  const { id } = useParams();
  const board_id = id;
  const [recName, setRecName] = useState("");
  const [recDesc, setRecDesc] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [thumbnail, setThumbnail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRec, setEditingRec] = useState<RecType | null>(null);
  const [recommendations, setRecommendations] = useState<RecType[]>([]);
  const [boardCreatedAt, setBoardCreatedAt] = useState<string>("");

  // getting current logged in user first
  useEffect(() => {
    async function getCurrentUserAndRecs() {
      setIsLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.user) {
        console.log("User not found:", sessionData.session);
        return;
      }

      // Set user for ownership check
      const currentUser = sessionData.session.user;
      setUser(currentUser);
    }

    getCurrentUserAndRecs();
  }, []);

  // check if the board is actually owned by the logged in user
  //  if not, redirect to landing page 
  useEffect(() => {
    if (!user || !board_id) return;

    async function fetchBoard() {
      const { data, error } = await supabase
        .from("boards")
        .select("name, user_id, created_at")
        .eq("id", board_id)
        .single();

      if (error || !data) {
        console.error("Board not found or error:", error?.message);
        router.replace("/");
        return;
      }

      if (data.user_id !== user?.id) {
        console.warn("Unauthorized access to this board.");
        router.replace("/");
        return;
      }

      setBoardName(data.name);
      setBoardCreatedAt(data.created_at)

      // Fetch recommendations only if authorized
      const { data: recs, error: recsError } = await supabase
        .from("recommendations")
        .select("*")
        .eq("board_id", board_id)
        .order("created_at", { ascending: false });

      if (recsError) {
        console.error("Error fetching the recommendations:", recsError.message);
      } else {
        setRecommendations(recs ?? []);
      }

      setIsLoading(false);
    }

    fetchBoard();
  }, [user, board_id]);
  

  // add a recommendation
  const addRec = async (e?: React.MouseEvent) => {
    setIsLoading(true);
    // prevent submitting of board details form
    if (e) e.preventDefault()
    
    // don't create board if no board name entered
    if (!recName.trim()) return

    if (user){
      // inserting board details into boards table
      const {data, error} = await supabase.from("recommendations").insert({
          id: uuidv4(),
          name: recName,
          description: recDesc,
          comment: comment,
          rating: rating,
          thumbnail: thumbnail,
          board_id: board_id, // foreign key --> rec is associated with the board id
          user_id: user.id
      })
      .select()
      .single()

      if (error) {
        console.error("Failed to insert board:", error.message);
        return;
      } else {
        console.log("Recommendation added successfully");
        setRecommendations(prev => {
          const newRecs = [...prev, data];
          updateNumItems(newRecs.length);
          return newRecs;
        });
      }

      // reset form when dialog is closed
      setRecName("");
      setRecDesc("");
      setComment("");
      setRating(0);
      setThumbnail("");
      setIsLoading(false);
      
      // close dialog after successful creation
      setIsDialogOpen(false); 
    } else {
      console.log("Error occurred! User couldn't be found!")

      // reset form when dialog is closed
      setRecName("");
      setRecDesc("");
      setComment("");
      setRating(0);
      setThumbnail("");
      setIsLoading(false);

      // close dialog after successful creation
      setIsDialogOpen(false); 
      return;
    }
  }

   // edit recommendation details
  const editRec = async (updatedRec: RecType) => {
    setIsLoading(true);
    // if (!editingRec.name.trim()) return
    // Update rec details in database
    const { error } = await supabase
      .from("recommendations")
      .update({
        name: updatedRec.name,
        description: updatedRec.description,
        comment: updatedRec.comment,
        rating: updatedRec.rating,
        thumbnail: updatedRec.thumbnail,
      })
      .eq("id", updatedRec.id);

    if (error) {
      console.error("Failed to update recommendation:", error.message);
      return;
    }

    //update recommendation visually
    setRecommendations(prevRecs =>
      prevRecs.map(rec =>
        rec.id === updatedRec.id ? updatedRec : rec
      ) 
    )
    setIsLoading(false);
    setEditingRec(null) // close the modal
  }

  // delete a recommendation
  const deleteRec = async(id:string) => {
    // remove rec from database itself
    const {error} = await supabase
      .from("recommendations")
      .delete()
      .eq("id", id);
      
    if (error){
      console.log("Failed to delete recommendation: ", error.message)
      return;
    } else {
      console.log("Recommendation deleted successfully");
      setRecommendations(prevRecs => {
        const newRecs = prevRecs.filter(rec => rec.id !== id);
        updateNumItems(newRecs.length);
        return newRecs;
      });
    }
  };

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

  // update num_items in boards table
  const updateNumItems = async (count: number) => {
    const {error} = await supabase
      .from("boards")
      .update({num_items: count})
      .eq("id", board_id);

    if (error) {
      console.error("Failed to update num_items:", error.message);
    }
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Header */}
          <div className="relative py-8 sm:py-16">
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#bc6c25]" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                      {boardName}
                    </h1>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Created on {boardCreatedAt.split('T')[0]}</span>
                    <span>•</span>
                    <span>{recommendations.length} {recommendations.length === 1 ? 'recommendation' : 'recommendations'}</span>
                  </div>
                </div>
                
                {/* Add Recommendation Button */}
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setRecName("");
                    setRecDesc("");
                    setComment("");
                    setRating(0);
                    setThumbnail("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="h-10 px-6 rounded-lg bg-[#bc6c25] hover:bg-[#a05a1f] text-white shadow-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Recommendation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold text-gray-900">New Recommendation</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Share what you love with others
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="recName" className="text-gray-700">Name *</Label>
                        <Input
                          id="recName"
                          maxLength={50}
                          value={recName}
                          onChange={e => setRecName(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-700">Description</Label>
                        <Input
                          id="description"
                          placeholder="Brief description (optional)"
                          maxLength={120}
                          value={recDesc}
                          onChange={e => setRecDesc(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comment" className="text-gray-700">Personal Note</Label>
                        <Input
                          id="comment"
                          placeholder="Your thoughts (optional)"
                          maxLength={40}
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rating" className="text-gray-700">Rating</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="rating"
                            min={0}
                            max={10}
                            step={0.1}
                            value={[rating]}
                            onValueChange={val => setRating(val[0])}
                            className="w-full"
                          />
                          <span className="text-sm font-medium text-gray-700 w-12">
                            {rating.toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thumbnail" className="text-gray-700">
                          Thumbnail
                        </Label>
                        <div
                          className="relative border-2 border-dashed border-gray-200 rounded-xl h-40 w-full flex items-center justify-center cursor-pointer hover:border-[#bc6c25] transition-colors bg-gray-50"
                          onClick={() => document.getElementById("thumbnailInput")?.click()}
                        >
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt="Thumbnail Preview"
                              className="h-full w-full object-cover rounded-lg"
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
                            onChange={(e) => handleThumbnailUpload(e, (base64) => setThumbnail(base64))}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded-lg">Cancel</Button>
                      </DialogClose>
                      <Button 
                        onClick={addRec}
                        disabled={!recName.trim() || isLoading}
                        className="bg-[#bc6c25] hover:bg-[#a05a1f] rounded-lg"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Recommendation"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* editing board dialog with pre filled details */}
                {editingRec && (
                  <Dialog open={true} onOpenChange={() => setEditingRec(null)}>
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
                            value={editingRec.name}
                            onChange={(e) =>
                              setEditingRec({ ...editingRec, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="editDescription">Description</Label>
                          <Input
                            id="editDescription"
                            value={editingRec.description}
                            onChange={(e) =>
                              setEditingRec({ ...editingRec, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comment" className="text-gray-700">Personal Note</Label>
                          <Input
                            id="comment"
                            placeholder="Your thoughts (optional)"
                            maxLength={40}
                            value={editingRec.comment}
                            onChange={(e) => 
                              setEditingRec({...editingRec, comment: e.target.value})
                            }
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rating" className="text-gray-700">Rating</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="rating"
                              min={0}
                              max={10}
                              step={0.1}
                              value={[editingRec.rating || 0]}
                              onValueChange={(val) =>
                                setEditingRec({ ...editingRec, rating: val[0] })
                              }
                              className="w-full"
                            />
                            <span className="text-sm font-medium text-gray-700 w-12">
                              {editingRec.rating.toFixed(1)}/10
                            </span>
                          </div>
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
                            {editingRec.thumbnail ? (
                              <img
                                src={editingRec.thumbnail}
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
                              onChange={(e) => {
                                handleThumbnailUpload(e, (base64) =>
                                  setEditingRec(prev=>
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
                        <Button onClick={() => editRec(editingRec)} disabled={!editingRec.name.trim() || isLoading}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 h-60 rounded-2xl"
                  ></div>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-20 space-y-2">
                <FolderOpen className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-lg font-medium text-gray-500">Your board is empty</p>
                <p className="text-sm text-gray-400">Add your first recommendation to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {recommendations.map((rec, idx) => (
                  <Recommendation
                    key={idx}
                    id={rec.id}
                    board_id={rec.board_id}
                    name={rec.name}
                    description={rec.description}
                    comment={rec.comment}
                    rating={rec.rating}
                    thumbnail={rec.thumbnail}
                    onEdit= {() => setEditingRec(rec)}
                    onDelete= {() => deleteRec(rec.id)}
                    isPublic= {false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
