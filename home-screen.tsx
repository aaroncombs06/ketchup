"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import LocationInput from "@/components/location-input"
import ActivityModal from "@/components/activity-modal"
import PendingKetchups from "@/components/pending-ketchups"
import SuggestedPlaces from "@/components/suggested-places"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Bell, Compass } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import ConfettiExplosion from "@/components/confetti-explosion"
import Image from "next/image"
import ExplorePage from "@/components/explore-page"
import SquadPage from "@/components/squad-page"
import ProfilePage from "@/components/profile-page"
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import LoadingSkeleton from "@/components/loading-skeleton"
import MobileOptimizedLayout from "@/components/mobile-optimized-layout"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for nearby friends
const nearbyFriends = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    status: "active",
    distance: "0.3 mi",
    lastActive: "Just now",
  },
  {
    id: 2,
    name: "Sam Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ST",
    status: "active",
    distance: "0.5 mi",
    lastActive: "5m ago",
  },
  {
    id: 3,
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    status: "away",
    distance: "0.7 mi",
    lastActive: "1h ago",
  },
  {
    id: 4,
    name: "Casey Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CW",
    status: "active",
    distance: "0.8 mi",
    lastActive: "Just now",
  },
  {
    id: 5,
    name: "Riley Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RB",
    status: "inactive",
    distance: "1.2 mi",
    lastActive: "3h ago",
  },
  {
    id: 6,
    name: "Jordan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JL",
    status: "active",
    distance: "0.4 mi",
    lastActive: "Just now",
  },
  {
    id: 7,
    name: "Taylor Reed",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TR",
    status: "away",
    distance: "0.9 mi",
    lastActive: "30m ago",
  },
  {
    id: 8,
    name: "Morgan Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MC",
    status: "active",
    distance: "0.6 mi",
    lastActive: "Just now",
  },
]

export default function HomeScreen() {
  const [location, setLocation] = useState("")
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [activeFriends, setActiveFriends] = useState<typeof nearbyFriends>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { triggerHaptic } = useHapticFeedback()
  const { isMobile } = useMobile()
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Pull to refresh implementation
  const handleRefresh = async () => {
    triggerHaptic("medium")
    // Simulate data refresh
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Shuffle active friends to simulate refresh
        setActiveFriends([...activeFriends].sort(() => Math.random() - 0.5))
        toast({
          title: "Refreshed!",
          description: "Latest updates loaded",
        })
        resolve()
      }, 1500)
    })
  }

  const { containerRef, PullToRefreshIndicator, isRefreshing } = usePullToRefresh({
    onRefresh: handleRefresh,
    pullingContent: (
      <div className="flex items-center">
        <span className="text-ketchup-700 mr-2">↓</span>
        <span className="text-sm text-gray-600">Pull to refresh</span>
      </div>
    ),
    refreshingContent: (
      <div className="flex items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mr-2 text-ketchup-700"
        >
          ⟳
        </motion.div>
        <span className="text-sm text-gray-600">Updating...</span>
      </div>
    ),
  })

  // Filter active friends
  useEffect(() => {
    setActiveFriends(nearbyFriends.filter((friend) => friend.status === "active"))

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleLocationSubmit = () => {
    triggerHaptic("medium")
    if (!location) {
      toast({
        title: "Hold up! 🍅",
        description: "Where you tryna go?",
        variant: "destructive",
      })
      return
    }
    setShowActivityModal(true)
  }

  const handleKetchupCreated = () => {
    triggerHaptic("heavy")
    setShowActivityModal(false)
    setLocation("")
    setIsSearching(true)

    // Show searching animation for 2 seconds before showing confetti
    setTimeout(() => {
      setIsSearching(false)
      setShowConfetti(true)
      toast({
        title: "Ketchup initiated! 🔥",
        description: "Finding your squad...",
      })
      setTimeout(() => setShowConfetti(false), 3000)
    }, 2000)
  }

  const handleQuickInvite = (friendId: number) => {
    triggerHaptic("medium")
    const friend = nearbyFriends.find((f) => f.id === friendId)
    if (friend) {
      toast({
        title: `Quick invite sent to ${friend.name}! 🚀`,
        description: "They'll get a notification right away",
      })
    }
  }

  const handleTabChange = (tab: string) => {
    triggerHaptic("light")
    setActiveTab(tab)
  }

  const detectCurrentLocation = () => {
    triggerHaptic("light")
    setIsDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Here you would typically use a reverse geocoding service
        // to turn the lat/lng into a human-readable address
        setLocation(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`)
        setIsDetectingLocation(false)
        toast({
          title: "Location Detected! 📍",
          description: "Using your current location",
        })
      },
      (error) => {
        console.error("Error detecting location:", error)
        setIsDetectingLocation(false)
        toast({
          title: "Couldn't get location 😢",
          description: "Please try again or enter manually",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLocationSubmit()
    }
  }

  const onChange = (value: string) => {
    setLocation(value)
  }

  const renderContent = () => (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-cream-50 to-white" ref={containerRef}>
      {showConfetti && <ConfettiExplosion />}
      <PullToRefreshIndicator />

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "home" && (
          <div className="px-4 pt-6 pb-4">
            {/* App Header - Familiar pattern from social apps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-10 h-10 rounded-xl overflow-hidden mr-2 shadow-lg"
                  >
                    <Image src="/images/ketchup-logo.png" alt="Ketchup Logo" width={40} height={40} priority />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-ketchup-700">Ketchup</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-100 text-ketchup-700"
                    onClick={() => triggerHaptic("light")}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Avatar
                      className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer"
                      onClick={() => handleTabChange("profile")}
                    >
                      <AvatarImage src="/placeholder.svg?height=36&width=36" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  </motion.div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2 text-ketchup-800">Who's Around? 👀</h2>
                <p className="text-gray-600 text-sm">Your friends are waiting to hang! Let's make it happen ✨</p>
              </div>
            </motion.div>

            {isLoading ? (
              <LoadingSkeleton type="friends" />
            ) : (
              <Card className="mb-6 p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Friends Nearby</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-ketchup-700 p-0 h-auto">
                    See all
                  </Button>
                </div>
                <div className="flex overflow-x-auto hide-scrollbar pb-2 -mx-1 px-1">
                  {activeFriends.map((friend) => (
                    <div key={friend.id} className="flex-shrink-0 w-16 mx-1">
                      <div className="flex flex-col items-center">
                        <div className="relative mb-1">
                          <Avatar className="h-14 w-14 border-2 border-white">
                            <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{friend.initials}</AvatarFallback>
                          </Avatar>
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                        </div>
                        <span className="text-xs text-center truncate w-full">{friend.name.split(" ")[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Main Action Card - Clearer call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="w-full rounded-3xl shadow-lg border-0 overflow-hidden mb-8 bg-white p-5 hover:shadow-xl transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-ketchup-800">Start a Ketchup 🍅</h3>
                    <Badge className="bg-cream-100 text-ketchup-700 hover:bg-cream-200 animate-pulse">Now</Badge>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <MapPin className="h-5 w-5 text-ketchup-500" />
                    </div>
                    <input
                      value={location}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Where do you want to go?"
                      className="w-full pl-10 pr-10 py-4 text-base border border-gray-200 bg-cream-50 focus:bg-white transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-ketchup-200"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={detectCurrentLocation}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ketchup-600 hover:text-ketchup-800 bg-white rounded-full p-1"
                      disabled={isDetectingLocation}
                      aria-label="Use current location"
                    >
                      {isDetectingLocation ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Compass className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <Compass className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button
                      className="w-full mt-2 bg-gradient-to-r from-ketchup-700 to-ketchup-600 hover:from-ketchup-800 hover:to-ketchup-700 text-white rounded-xl h-12 font-medium shadow-md"
                      onClick={handleLocationSubmit}
                    >
                      Let's Ketchup! 🍅
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Searching Animation */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8"
                >
                  <Card className="p-6 text-center border-2 border-cream-200 rounded-2xl bg-cream-50">
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-4 relative">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        >
                          <span className="text-2xl">🍅</span>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-ketchup-300 opacity-75"
                          animate={{
                            scale: [1, 1.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        ></motion.div>
                      </div>
                      <p className="font-medium text-ketchup-800">Searching for friends...</p>
                      <p className="text-sm mt-2 text-gray-500">Finding who's free to hang at {location}</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vibes Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ketchup-800">The Vibes RN ✨</h3>
                <Button variant="ghost" className="text-xs text-gray-500 p-0 hover:text-ketchup-700">
                  See all
                </Button>
              </div>

              {isLoading ? (
                <LoadingSkeleton type="vibes" />
              ) : (
                <div className="flex overflow-x-auto pb-2 space-x-3 hide-scrollbar">
                  {["Coffee vibes ☕", "Study grind 📚", "Dinner plans 🍽️", "Chill mode 😌"].map((vibe, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 bg-gradient-to-br from-cream-50 to-cream-100 p-3 rounded-2xl border border-cream-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                      <p className="whitespace-nowrap text-sm font-medium text-ketchup-800">{vibe}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Suggested Places */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ketchup-800">Popular Spots 🔥</h3>
                <Button
                  variant="ghost"
                  className="text-xs text-gray-500 p-0 hover:text-ketchup-700"
                  onClick={() => handleTabChange("explore")}
                >
                  See all
                </Button>
              </div>

              {isLoading ? <LoadingSkeleton type="places" /> : <SuggestedPlaces onSelectPlace={setLocation} />}
            </motion.div>

            {/* Pending Ketchups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ketchup-800">Your Ketchups 🍅</h3>
                <Button
                  variant="ghost"
                  className="text-xs text-gray-500 p-0 hover:text-ketchup-700"
                  onClick={() => handleTabChange("ketchup")}
                >
                  See all
                </Button>
              </div>

              {isLoading ? (
                <LoadingSkeleton type="ketchups" />
              ) : (
                <PendingKetchups
                  onAccept={() => {
                    setShowConfetti(true)
                    triggerHaptic("heavy")
                  }}
                />
              )}
            </motion.div>
          </div>
        )}

        {activeTab === "explore" && (
          <ExplorePage onSelectPlace={setLocation} onKetchup={() => handleTabChange("home")} />
        )}
        {activeTab === "ketchup" && (
          <div className="p-4">
            <Card className="w-full rounded-3xl shadow-lg border-0 overflow-hidden mb-8 bg-white p-5 hover:shadow-xl transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-ketchup-800">Where You Tryna Go? 🍅</h3>
                  <Badge className="bg-cream-100 text-ketchup-700 hover:bg-cream-200 animate-pulse">Now</Badge>
                </div>

                <LocationInput value={location} onChange={setLocation} onSubmit={handleLocationSubmit} />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    className="w-full mt-2 bg-gradient-to-r from-ketchup-700 to-ketchup-600 hover:from-ketchup-800 hover:to-ketchup-700 text-white rounded-xl h-12 font-medium shadow-md"
                    onClick={handleLocationSubmit}
                  >
                    Let's Ketchup! 🍅
                  </Button>
                </motion.div>
              </div>
            </Card>
            <PendingKetchups
              onAccept={() => {
                setShowConfetti(true)
                triggerHaptic("heavy")
              }}
            />
          </div>
        )}
        {activeTab === "squad" && <SquadPage onKetchup={(friendId) => handleQuickInvite(friendId)} />}
        {activeTab === "profile" && <ProfilePage />}
      </div>

      {showActivityModal && (
        <ActivityModal
          location={location}
          onClose={() => setShowActivityModal(false)}
          onSubmit={handleKetchupCreated}
        />
      )}
    </div>
  )

  // Use the mobile optimized layout for mobile devices
  if (isMobile) {
    return (
      <MobileOptimizedLayout activeTab={activeTab} onTabChange={handleTabChange}>
        {renderContent()}
      </MobileOptimizedLayout>
    )
  }

  // For desktop, render without the mobile optimized layout
  return renderContent()
}
