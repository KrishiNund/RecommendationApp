"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Upload,Loader2, FolderOpen, AlertCircle } from "lucide-react";
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
import { toast } from "sonner"
import imageCompression from 'browser-image-compression';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const [boardDescription, setBoardDescription] = useState("");
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);
  const [userPlan, setUserPlan] = useState("")

  // getting current logged in user first
  useEffect(() => {
    async function getCurrentUser() {
      setIsLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.user) {
        console.log("User not found:", sessionData.session);
        return;
      }

      // Set user for ownership check
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
    }

    getCurrentUser();
  }, []);

  // check if the board is actually owned by the logged in user
  //  if not, redirect to landing page 
  useEffect(() => {
    if (!user || !board_id) return;

    async function fetchBoard() {
      // fetch board details
      const { data, error } = await supabase
        .from("boards")
        .select("name, description, user_id, created_at")
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
      setBoardDescription(data.description)

      // Fetch recommendations only if authorized
      const { data: recs, error: recsError } = await supabase
        .from("recommendations")
        .select("*")
        .eq("board_id", board_id)
        .order("created_at", { ascending: false });

      if (recsError) {
        console.error("Error fetching the recommendations:", recsError.message);
        toast.error("Error loading recommendations!");
        return;
      }

      // Get signed URLs for each thumbnail
      const recsWithThumbnails = await Promise.all(
        (recs ?? []).map(async (rec) => {
          if (rec.thumbnail) {
            const { data: signedUrlData, error: signedUrlError } = await supabase
              .storage
              .from("thumbnails") // replace with your actual bucket name
              .createSignedUrl(rec.thumbnail, 60 * 60); // valid for 1 hour

            if (signedUrlError) {
              console.error(`Error getting signed URL for recommendation ${rec.id}:`, signedUrlError.message);
              return rec;
            }

            return { ...rec, thumbnail: signedUrlData.signedUrl };
          }
          return rec;
        })
      );
      setRecommendations(recsWithThumbnails);
      setIsLoading(false);
    }

    fetchBoard();
  }, [user, board_id]);
  
  // state to check if recommendations can be created or not
  const canCreateRec = userPlan === "pro" || (userPlan === "free" && recommendations.length < 20);

  // add a recommendation
  const addRec = async (e?: React.MouseEvent) => {
    setIsLoading(true);
    // prevent submitting of rec details form
    if (e) e.preventDefault()
    
    // don't create rec if no rec name entered
    if (!recName.trim()) return

    if (!user){
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
        const path = `recommendations/${uuidv4()}.webp`;
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
    // inserting rec details into recommendations table
    const {data, error} = await supabase
    .from("recommendations")
    .insert({
        id: uuidv4(),
        name: recName,
        description: recDesc,
        comment: comment,
        rating: rating,
        thumbnail: thumbnailPath || null,
        board_id: board_id, // foreign key --> rec is associated with the board id
        user_id: user.id
    })
    .select()
    .single()

    if (error) {
      console.error("Failed to insert board:", error.message);
      toast.error("Failed to create recommendation!");
      setIsLoading(false);
      return;
    }

    // get signed url of uploaded thumbnail
    // after uploading thumbnail
    if (thumbnailPath !== ""){
      const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from("thumbnails") // replace with your actual bucket name
      .createSignedUrl(thumbnailPath, 60 * 60); // valid for 1 hour

      if (signedUrlError) {
        console.error(`Error getting signed URL for recommendation ${data.id}:`, signedUrlError.message);
      }
      const thumbnailUrl = signedUrlData?.signedUrl || "";

      // add rec to UI
      setRecommendations(prev => {
        const newRecs = [...prev, {...data, thumbnail: thumbnailUrl}];
        updateNumItems(newRecs.length);
        return newRecs;
      });
    } else {
      // add rec to UI
      setRecommendations(prev => {
        const newRecs = [...prev, data];
        updateNumItems(newRecs.length);
        return newRecs;
      })   
    }
    console.log("Recommendation added successfully");
    toast.success("Recommendation added successfully!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    });

    // reset form when dialog is closed
    setRecName("");
    setRecDesc("");
    setComment("");
    setRating(0);
    setThumbnail("");
    setIsLoading(false);
    setSelectedFile(null);
    
    // close dialog after successful creation
    setIsDialogOpen(false); 
  }

   // edit recommendation details
  const editRec = async (updatedRec: RecType) => {
    setIsLoading(true);
    // if (!editingRec.name.trim()) return
    let newThumbnailPath = "";
    let oldThumbnailPath = "";

    // fetch the actual thumbnail path from DB
    const { data: recFromDB, error: fetchError } = await supabase
      .from("recommendations")
      .select("thumbnail")
      .eq("id", updatedRec.id)
      .single();

    if (fetchError || !recFromDB) {
      console.error("Error fetching original recommendation:", fetchError?.message);
      toast.error("Error updating recommendation");
      setIsLoading(false);
      return;
    }

    oldThumbnailPath = recFromDB.thumbnail;
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
        const filePath = `recommendations/${uuidv4()}.webp`;

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

    // update rec in DB
    const {data, error: updateError } = await supabase
      .from("recommendations")
      .update({
        name: updatedRec.name,
        description: updatedRec.description,
        comment: updatedRec.comment,
        rating: updatedRec.rating,
        thumbnail: newThumbnailPath,
      })
      .eq("id", updatedRec.id);

    if (updateError) {
      console.error("Update failed:", updateError.message);
      toast.error("Recommendation update failed");
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
      setRecommendations(prev =>
        prev.map(r =>
          r.id === updatedRec.id
            ? { ...updatedRec, thumbnail: thumbnailUrl }
            : r
        )
      );
    } else {
       // update local state
      setRecommendations(prev =>
        prev.map(r =>
          r.id === updatedRec.id
            ? { ...updatedRec, data }
            : r
        )
      );
    }

    setIsLoading(false);
    setEditingRec(null);
    setSelectedEditFile(null);
    toast.success("Recommendation updated!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    });
  }

  // delete a recommendation
  const deleteRec = async(id:string) => {
    setIsLoading(true);

    // get the recommendation's thumbnail path
    const { data: recData, error: fetchError } = await supabase
      .from("recommendations")
      .select("thumbnail")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Failed to fetch recommendation before delete:", fetchError.message);
      setIsLoading(false);
      return;
    }

    const thumbnailPath = recData?.thumbnail;

    // delete the rec from the database
    const { error: deleteRecError } = await supabase
      .from("recommendations")
      .delete()
      .eq("id", id);

    if (deleteRecError) {
      console.error("Failed to delete recommendation:", deleteRecError.message);
      setIsLoading(false);
      return;
    }

    // delete the thumbnail from storage (if exists)
    if (thumbnailPath) {
      const { error: deleteThumbError } = await supabase.storage
        .from("thumbnails")
        .remove([thumbnailPath]);

      if (deleteThumbError) {
        console.warn("Board deleted but thumbnail not removed:", deleteThumbError.message);
      }
    }

    // update local UI state
    setRecommendations(prevRecs => {
      const newRecs = prevRecs.filter(rec => rec.id !== id);
      updateNumItems(newRecs.length);
      return newRecs;
    });
    setIsLoading(false);
    toast.success("Recommendation deleted!",{
      style: {
        background: "#fef6e4",
        color: "#4a2e00",
        border: "1px solid #fae1c3",
      },
    });
  };

  // handle uploading of an image for the thumnail of the board
  // either when creating a board or editing its contents
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // Store the file in state

    // For preview purposes
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setThumbnail(reader.result); // still show preview
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
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Hero Header */}
          <div className="relative py-8 sm:py-16">
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                      {boardName}
                    </h1>
                  </div>
                  {boardDescription && (
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                      {boardDescription}
                    </p>
                  )}
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
                    <Button 
                      className="h-10 px-6 rounded-lg bg-[#bc6c25] hover:bg-[#a05a1f] text-white shadow-sm"
                      disabled={!canCreateRec || isLoading}
                    >
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
                          placeholder="Enter a title (e.g., Spirited Away)"
                          onChange={e => setRecName(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-700">Description</Label>
                        <Input
                          id="description"
                          maxLength={120}
                          value={recDesc}
                          placeholder="Add a short note (e.g., A heartwarming fantasy adventure)"
                          onChange={e => setRecDesc(e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comment" className="text-gray-700">Personal Note</Label>
                        <Input
                          id="comment"
                          maxLength={90}
                          value={comment}
                          placeholder="Add a personal note (e.g., Watched this last summer, still a favorite)"
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
                            onChange={handleThumbnailChange}
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
                            placeholder="Enter a title (e.g., Spirited Away)"
                            maxLength={50}
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
                            placeholder="Add a short note (e.g., A heartwarming fantasy adventure)"
                            maxLength={120}
                            onChange={(e) =>
                              setEditingRec({ ...editingRec, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comment" className="text-gray-700">Personal Note</Label>
                          <Input
                            id="comment"
                            maxLength={90}
                            value={editingRec.comment}
                            placeholder="Add a personal note (e.g., Watched this last summer, still a favorite)"
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
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setSelectedEditFile(file); // save file for later upload

                                // For preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") {
                                    setEditingRec(prev =>
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
                        <Button onClick={() => editRec(editingRec)} disabled={!editingRec.name.trim() || isLoading}>
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                
              </div>
              {/* place alert here if cannot create boards anymore */}
              {(!canCreateRec && !isLoading) && (
                <Alert>
                  <AlertCircle />
                    <AlertTitle>Recommendation limit reached</AlertTitle>
                    <AlertDescription>
                    You've reached the limit of 20 recommendations per board on the free plan. Upgrade to Pro to add more recommendations.
                    </AlertDescription>
                </Alert>
              )}
            </div> 
          </div>
          
          {/* Recommendations Grid */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 h-64 rounded-2xl shadow-md"
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
