// CopyLinkHandler.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

// export function useCopyLinkHandler(public_id: string) {
//   const [showDialog, setShowDialog] = useState(false)

//   const link = `${window.location.origin}/public/${public_id}`

//   const handleCopy = async (e: React.MouseEvent) => {
//     e.stopPropagation()
//     try {
//       await navigator.clipboard.writeText(link)
//       toast.success("Link copied to clipboard!", {
//         style: {
//           background: "#fef6e4",
//           color: "#4a2e00",
//           border: "1px solid #fae1c3",
//         },
//       })
//     } catch (err) {
//       setShowDialog(true)
//     }
//   }

//   const DialogFallback = () => (
//     <Dialog open={showDialog} onOpenChange={setShowDialog}>
//       <DialogContent className="sm:max-w-[400px]">
//         <DialogHeader>
//           <DialogTitle className="text-[#4a2e00] text-sm">Manual Copy</DialogTitle>
//         </DialogHeader>
//         <div className="bg-gray-100 p-2 rounded text-xs break-all select-all">{link}</div>
//       </DialogContent>
//     </Dialog>
//   )

//   return { handleCopy, DialogFallback }
// }

export function useCopyLinkHandler() {
  const [showDialog, setShowDialog] = useState(false);

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!", {
        style: {
          background: "#fef6e4",
          color: "#4a2e00",
          border: "1px solid #fae1c3",
        },
      });
    } catch (err) {
      setShowDialog(true);
    }
  };

  const DialogFallback = () => (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[#4a2e00] text-sm">Manual Copy</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-100 p-2 rounded text-xs break-all select-all">
          {typeof window !== "undefined" && window.location.origin + "/public/" + "BOARD_ID_HERE"}
        </div>
      </DialogContent>
    </Dialog>
  );

  return { handleCopy, DialogFallback };
}