"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Settings,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Edit,
  Camera,
  MapPin,
  Clock,
  Shield,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const userData = {
  name: "Jamie Smith",
  username: "@jamiesmith",
  avatar: "/placeholder.svg?height=80&width=80",
  initials: "JS",
  bio: "Coffee enthusiast, always down for spontaneous adventures ✨",
  location: "New York, NY",
  status: "active", // active, away, offline
  statusMessage: "Looking to hang today!",
  stats: {
    ketchups: 24,
    friends: 86,
    places: 18,
  },
  preferences: {
    notifications: true,
    darkMode: false,
    locationSharing: true,
    autoAccept: false,
  },
}

// Mock activity data
const activityData = [
  {
    id: 1,
    type: "ketchup",
    title: "Coffee with Alex",
    location: "Blue Bottle Coffee",
    time: "Yesterday, 2:30 PM",
  },
  {
    id: 2,
    type: "place",
    title: "Visited Central Park",
    location: "Central Park",
    time: "Last week",
  },
  {
    id: 3,
    type: "friend",
    title: "Connected with Sam",
    time: "2 weeks ago",
  },
]

export default function ProfilePage() {
  const [preferences, setPreferences] = useState(userData.preferences)
  const [status, setStatus] = useState<"active" | "away" | "offline">(userData.status as any)
  const [statusMessage, setStatusMessage] = useState(userData.statusMessage)
  const [showStatusOptions, setShowStatusOptions] = useState(false)
  const { toast } = useToast()

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    })
    toast({
      title: "Preference updated",
      description: `${key} is now ${!preferences[key] ? "enabled" : "disabled"}`,
    })
  }

  const handleStatusChange = (newStatus: "active" | "away" | "offline") => {
    setStatus(newStatus)
    setShowStatusOptions(false)
    toast({
      title: "Status updated",
      description: `You're now ${newStatus}`,
    })
  }

  return (
    <div className="p-4">
      {/* Profile Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-ketchup-800">profile</h1>
          <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-cream-100">
              <Settings className="h-5 w-5 text-gray-500" />
            </Button>
          </motion.div>
        </div>

        <Card className="p-6 rounded-2xl border-0 shadow-md">
          <div className="flex items-center">
            <div className="relative">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Avatar className="h-20 w-20 border-4 border-cream-100">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback className="text-xl bg-cream-100 text-ketchup-700">{userData.initials}</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-ketchup-700 text-white hover:bg-ketchup-800 shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-gray-500">{userData.username}</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="rounded-full shadow-sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Status Selector */}
          <div className="mt-4">
            <div className="relative">
              <div
                className="flex items-center p-2 rounded-lg bg-cream-50 cursor-pointer"
                onClick={() => setShowStatusOptions(!showStatusOptions)}
              >
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    status === "active" ? "bg-green-500" : status === "away" ? "bg-yellow-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm font-medium capitalize">{status}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-600 flex-1">{statusMessage}</span>
                <ChevronRight
                  className={`h-4 w-4 text-gray-400 transition-transform ${showStatusOptions ? "rotate-90" : ""}`}
                />
              </div>

              <AnimatePresence>
                {showStatusOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border overflow-hidden"
                  >
                    <div
                      className="flex items-center p-3 hover:bg-cream-50 cursor-pointer"
                      onClick={() => handleStatusChange("active")}
                    >
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Active</span>
                      <span className="ml-2 text-xs text-gray-500">Ready to hang</span>
                    </div>
                    <div
                      className="flex items-center p-3 hover:bg-cream-50 cursor-pointer"
                      onClick={() => handleStatusChange("away")}
                    >
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="font-medium">Away</span>
                      <span className="ml-2 text-xs text-gray-500">Busy right now</span>
                    </div>
                    <div
                      className="flex items-center p-3 hover:bg-cream-50 cursor-pointer"
                      onClick={() => handleStatusChange("offline")}
                    >
                      <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>
                      <span className="font-medium">Offline</span>
                      <span className="ml-2 text-xs text-gray-500">Not available</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-4 text-gray-600">{userData.bio}</p>

          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {userData.location}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <motion.div whileHover={{ y: -5 }} className="text-center p-3 bg-cream-50 rounded-xl">
              <p className="text-2xl font-bold text-ketchup-700">{userData.stats.ketchups}</p>
              <p className="text-sm text-gray-500">Ketchups</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="text-center p-3 bg-cream-50 rounded-xl">
              <p className="text-2xl font-bold text-ketchup-700">{userData.stats.friends}</p>
              <p className="text-sm text-gray-500">Friends</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="text-center p-3 bg-cream-50 rounded-xl">
              <p className="text-2xl font-bold text-ketchup-700">{userData.stats.places}</p>
              <p className="text-sm text-gray-500">Places</p>
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-ketchup-800 mb-4">recent activity</h3>
        <Card className="rounded-2xl overflow-hidden border-0 shadow-md">
          <div className="divide-y">
            {activityData.map((activity) => (
              <motion.div
                key={activity.id}
                className="p-4 hover:bg-cream-50 cursor-pointer transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                      activity.type === "ketchup"
                        ? "bg-cream-100 text-ketchup-700"
                        : activity.type === "place"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activity.type === "ketchup" ? (
                      <span className="text-lg">🍅</span>
                    ) : activity.type === "place" ? (
                      <MapPin className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      {activity.location && (
                        <>
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="mr-2">{activity.location}</span>
                          <span className="mx-1">•</span>
                        </>
                      )}
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <div>
                    {activity.type === "ketchup" && (
                      <Button size="sm" variant="outline" className="h-8 rounded-full">
                        Repeat
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-ketchup-800 mb-4">preferences</h3>
        <Card className="rounded-2xl overflow-hidden border-0 shadow-md">
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <Bell className="h-5 w-5 text-ketchup-700" />
                </div>
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Get alerts for new ketchups</p>
                </div>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={() => handleTogglePreference("notifications")}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Moon className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch to dark theme</p>
                </div>
              </div>
              <Switch checked={preferences.darkMode} onCheckedChange={() => handleTogglePreference("darkMode")} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <MapPin className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="font-medium">Location Sharing</p>
                  <p className="text-sm text-gray-500">Share your location with friends</p>
                </div>
              </div>
              <Switch
                checked={preferences.locationSharing}
                onCheckedChange={() => handleTogglePreference("locationSharing")}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-pink-700" />
                </div>
                <div>
                  <p className="font-medium">Auto-Accept from Close Friends</p>
                  <p className="text-sm text-gray-500">Automatically accept ketchups from close friends</p>
                </div>
              </div>
              <Switch checked={preferences.autoAccept} onCheckedChange={() => handleTogglePreference("autoAccept")} />
            </div>
          </div>
        </Card>
      </div>

      {/* Account */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-ketchup-800 mb-4">account</h3>
        <Card className="rounded-2xl overflow-hidden border-0 shadow-md">
          <div className="divide-y">
            <motion.div whileHover={{ x: 5 }} className="p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <p className="font-medium">Account Settings</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </motion.div>

            <motion.div whileHover={{ x: 5 }} className="p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Bell className="h-5 w-5 text-yellow-700" />
                </div>
                <p className="font-medium">Notification Settings</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </motion.div>

            <motion.div whileHover={{ x: 5 }} className="p-4 flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-indigo-700" />
                </div>
                <p className="font-medium">Privacy Settings</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Logout */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          variant="outline"
          className="w-full rounded-xl border-ketchup-200 text-ketchup-700 hover:bg-ketchup-50 hover:text-ketchup-800 mb-8 shadow-sm"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </motion.div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500 mb-8">
        <p>Ketchup v1.0.0</p>
        <p className="mt-1">© 2025 Ketchup. All rights reserved.</p>
      </div>
    </div>
  )
}
