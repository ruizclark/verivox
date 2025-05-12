// File: components/RegisterNowButton.tsx
"use client"

// Import modules and components
import { useSession } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// Import icons
export default function RegisterNowButton() {
  const session = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Function to handle button click
  const handleClick = () => {
    if (session) {
      setOpen(true)
    } else {
      router.push("/signup")
    }
  }

  // Function to handle dialog close
  return (
    <>
      <Button
        size="lg"
        className="flex bg-white border border-gray-300 text-gray-700 hover:bg-white transition-colors"
        onClick={handleClick}
      >
        Register Now
      </Button>

      {/* Dialog for already registered users */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-harvard-crimson text-white max-w-sm mx-auto rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Already Registered
            </DialogTitle>
            <DialogDescription className="mt-2 text-white">
              Log out to register a new account. 
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="mt-4 w-full border-white text-harvard-crimson hover:bg-white hover:text-harvard-crimson transition-colors"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}