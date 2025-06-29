"use client"

import ProtectedRoute from "../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  SelectLabel
} from "@/components/ui/select"

import { useState } from "react"
import Board from "../components/Board"

export default function Dashboard(){
    const [boardName, setBoardName] = useState("");
    const [boardDescription, setBoardDescription] = useState("")
    const [boardCategory, setBoardCategory] = useState("")
     
    const [boards, setBoards] = useState<
        { name: string; description: string; category: string }[]
    >([]);

    const addBoard = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        setBoards([
            ...boards,
            {
                name: boardName,
                description: boardDescription,
                category: boardCategory,
            },
        ]);
        setBoardName("");
        setBoardDescription("");
        setBoardCategory("");
    };
    
    return(
        <ProtectedRoute>
            <div className="flex flex-col w-full min-h-screen p-8">
                {/* heading + add/remove board buttons */}
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-center text-xl font-semibold">My Boards</h1>

                    <div className="flex items-center space-x-4">
                        {/* add board button + dialog */}
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="cursor-pointer">
                                        <Plus />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create Board</DialogTitle>
                                        <DialogDescription>
                                        Add new board details here. Click save when you&apos;re
                                        done.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4">
                                        <div className="grid gap-3">
                                            <Label htmlFor="boardName">Name</Label>
                                            <Input 
                                                id="boardName" 
                                                name="name" 
                                                value={boardName}
                                                onChange={e => setBoardName(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="description">Description</Label>
                                            <Input 
                                                id="description" 
                                                name="description" 
                                                value={boardDescription}
                                                onChange={e => setBoardDescription(e.target.value)} 
                                            />
                                        </div>
                                    </div>

                                    <Select
                                        value={boardCategory}
                                        onValueChange={setBoardCategory}
                                    >
                                        <SelectTrigger className="w-[180px] cursor-pointer">
                                            <SelectValue placeholder="Select a category"/>
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

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="cursor-pointer">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" className="cursor-pointer" onClick={addBoard}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>

                        <Button variant="ghost" className="cursor-pointer">
                            <Trash2 />
                        </Button>
                    </div>
            </div>

            {/* the boards area where all boards are stored */}
            <div id="boardsArea" className="border border-gray-200 rounded-lg w-full h-screen flex items-start p-4 gap-4">
                {boards.map((board, idx) => (
                    <Board
                        key={idx}
                        name={board.name}
                        description={board.description}
                        category={board.category}
                    />
                ))}
            </div>
           
        </div>
    </ProtectedRoute>
        
    )
}