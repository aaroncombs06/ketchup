"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface NotificationProps {
  user: {
    name: string
    avatar: string
    initials: string
  }
  activity: string
  location: string
  time: string
  onAccept: () => void
  onDecline: () => void
}

export default function Notification({ user, activity, location, time, onAccept, onDecline }: NotificationProps) {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(true)

  // Countdown timer for 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          setTimeout(() => setVisible(false), 300)
          onDecline()
          return 0
        }
        return prev - 100 / 60
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDecline])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-slide-up">
      <Card className="p-4 shadow-lg border-red-100">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium">{user.name} wants to Ketchup!</h4>
            <p className="text-sm text-gray-500">
              {activity} at {location}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{time}</p>

        <Progress value={progress} className="h-1 mb-3" />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setVisible(false)
              onDecline()
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              setVisible(false)
              onAccept()
            }}
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </Button>
        </div>
      </Card>
    </div>
  )
}
