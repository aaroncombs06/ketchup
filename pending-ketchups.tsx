"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, User, X, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import SwipeableCard from "@/components/swipeable-card"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

// Mock data
const mockPendingKetchups = [
  {
    id: "1",
    user: {
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    activity: "Coffee",
    location: "Blue Bottle",
    time: "20 min",
    status: "waiting",
    message: "need caffeine asap ☕",
  },
  {
    id: "2",
    user: {
      name: "Sam",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ST",
    },
    activity: "Lunch",
    location: "Shake Shack",
    time: "45 min",
    status: "pending",
    message: "burgers on me! 🍔",
  },
]

interface PendingKetchupsProps {
  onAccept?: () => void
}

export default function PendingKetchups({ onAccept }: PendingKetchupsProps) {
  const [pendingKetchups, setPendingKetchups] = useState(mockPendingKetchups)
  const { toast } = useToast()
  const { triggerHaptic } = useHapticFeedback()

  const handleAccept = (id: string) => {
    triggerHaptic("medium")
    toast({
      title: "yayyy! 🎉",
      description: "ketchup locked in!",
    })
    setPendingKetchups(pendingKetchups.filter((ketchup) => ketchup.id !== id))
    if (onAccept) onAccept()
  }

  const handleDecline = (id: string) => {
    triggerHaptic("light")
    toast({
      title: "Declined",
      description: "Maybe next time!",
    })
    setPendingKetchups(pendingKetchups.filter((ketchup) => ketchup.id !== id))
  }

  if (pendingKetchups.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed border-2 rounded-2xl bg-cream-50">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🍅</span>
          </div>
          <p className="font-medium text-ketchup-800">no ketchups yet!</p>
          <p className="text-sm mt-2 text-gray-500">start one to connect with your squad</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {pendingKetchups.map((ketchup) => (
          <motion.div
            key={ketchup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <SwipeableCard
              onSwipeLeft={() => handleDecline(ketchup.id)}
              onSwipeRight={() => handleAccept(ketchup.id)}
              leftLabel="Decline"
              rightLabel="Accept"
              leftColor="#ef4444"
              rightColor="#8b2323"
            >
              <Card className="p-4 rounded-2xl border-0 shadow-sm overflow-hidden">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3 border-2 border-cream-100">
                    <AvatarImage src={ketchup.user.avatar || "/placeholder.svg"} alt={ketchup.user.name} />
                    <AvatarFallback className="bg-cream-100 text-ketchup-700">{ketchup.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{ketchup.user.name}</h4>
                      <Badge
                        variant={ketchup.status === "pending" ? "outline" : "secondary"}
                        className={`text-xs ${
                          ketchup.status === "pending"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                            : "bg-green-50 text-green-600 border-green-100"
                        }`}
                      >
                        {ketchup.status === "pending" ? "pending" : "waiting for you"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{ketchup.message}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <div className="flex items-center mr-3">
                      <ActivityIcon activity={ketchup.activity} className="h-4 w-4 mr-1 text-ketchup-500" />
                      {ketchup.activity}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-ketchup-500" />
                      {ketchup.time}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-ketchup-500" />
                    {ketchup.location}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => handleDecline(ketchup.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      nah
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button
                      className="w-full bg-ketchup-700 hover:bg-ketchup-800 text-cream-100 rounded-xl"
                      onClick={() => handleAccept(ketchup.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      let's go!
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </SwipeableCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper component to show different activity icons
function ActivityIcon({ activity, className }: { activity: string; className?: string }) {
  switch (activity.toLowerCase()) {
    case "coffee":
      return <span className={className}>☕</span>
    case "lunch":
    case "dinner":
      return <span className={className}>🍽️</span>
    case "study":
      return <span className={className}>📚</span>
    case "walk":
      return <span className={className}>🚶</span>
    case "drinks":
      return <span className={className}>🍹</span>
    default:
      return <User className={className} />
  }
}
