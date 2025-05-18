"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Filter, Map, List, Coffee, Utensils, Beer, Music, BookOpen, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import MobileInput from "@/components/mobile-input"
import SwipeableCard from "@/components/swipeable-card"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import LoadingSkeleton from "@/components/loading-skeleton"

// Mock data for places
const placesData = [
  {
    id: 1,
    name: "Blue Bottle Coffee",
    category: "Coffee Shop",
    distance: "0.3 mi",
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.8,
    friends: 3,
    trending: true,
    vibe: "chill",
    color: "blue",
  },
  {
    id: 2,
    name: "Central Park",
    category: "Park",
    distance: "0.5 mi",
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.9,
    friends: 5,
    trending: true,
    vibe: "active",
    color: "green",
  },
  {
    id: 3,
    name: "The Reading Room",
    category: "Library",
    distance: "0.7 mi",
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.6,
    friends: 2,
    trending: false,
    vibe: "quiet",
    color: "purple",
  },
  {
    id: 4,
    name: "Shake Shack",
    category: "Restaurant",
    distance: "0.8 mi",
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.7,
    friends: 4,
    trending: true,
    vibe: "lively",
    color: "orange",
  },
  {
    id: 5,
    name: "The Alchemist",
    category: "Bar",
    distance: "1.0 mi",
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.5,
    friends: 6,
    trending: false,
    vibe: "social",
    color: "pink",
  },
]

// Mock data for friend activity
const friendActivity = [
  {
    id: 1,
    name: "Alex",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    place: "Blue Bottle Coffee",
    time: "20 min ago",
  },
  {
    id: 2,
    name: "Sam",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ST",
    place: "Central Park",
    time: "1 hour ago",
  },
]

interface ExplorePageProps {
  onSelectPlace?: (place: string) => void
  onKetchup?: () => void
}

export default function ExplorePage({ onSelectPlace, onKetchup }: ExplorePageProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { triggerHaptic } = useHapticFeedback()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate map loading
  useEffect(() => {
    if (viewMode === "map" && !mapLoaded) {
      const timer = setTimeout(() => {
        setMapLoaded(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [viewMode, mapLoaded])

  const categories = [
    { id: "all", icon: <Filter className="h-4 w-4" />, label: "All" },
    { id: "coffee", icon: <Coffee className="h-4 w-4" />, label: "Coffee" },
    { id: "food", icon: <Utensils className="h-4 w-4" />, label: "Food" },
    { id: "drinks", icon: <Beer className="h-4 w-4" />, label: "Drinks" },
    { id: "study", icon: <BookOpen className="h-4 w-4" />, label: "Study" },
    { id: "fun", icon: <Music className="h-4 w-4" />, label: "Fun" },
  ]

  const filteredPlaces = placesData.filter((place) => {
    if (activeCategory !== "all" && !place.category.toLowerCase().includes(activeCategory.toLowerCase())) {
      return false
    }
    if (
      searchQuery &&
      !place.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !place.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const handleSelectPlace = (name: string) => {
    triggerHaptic("medium")
    if (onSelectPlace) {
      onSelectPlace(name)
      if (onKetchup) onKetchup()
    }
  }

  const handleSwipeRight = (placeId: number) => {
    triggerHaptic("medium")
    const place = placesData.find((p) => p.id === placeId)
    if (place && onSelectPlace) {
      onSelectPlace(place.name)
      if (onKetchup) onKetchup()
    }
  }

  const handleSwipeLeft = (placeId: number) => {
    triggerHaptic("light")
    // Could implement "hide this place" functionality
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ketchup-800 mb-2">Explore</h1>
        <p className="text-gray-600 text-sm">Discover new spots & see where your friends hang</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <MobileInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search places, categories, vibes..."
          icon={<Search className="h-5 w-5" />}
          clearable={true}
          className="mb-4"
        />
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              viewMode === "list" ? "bg-white text-ketchup-700 shadow-sm" : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => {
              triggerHaptic("light")
              setViewMode("list")
            }}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              viewMode === "map" ? "bg-white text-ketchup-700 shadow-sm" : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => {
              triggerHaptic("light")
              setViewMode("map")
            }}
          >
            <Map className="h-4 w-4 mr-1" />
            Map
          </motion.button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-4 py-2 rounded-md ${
            showFilters ? "bg-ketchup-700 text-white" : "bg-cream-100 text-ketchup-700 hover:bg-cream-200"
          }`}
          onClick={() => {
            triggerHaptic("light")
            setShowFilters(!showFilters)
          }}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
        </motion.button>
      </div>

      {/* Categories */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm ${
                    activeCategory === category.id
                      ? "bg-ketchup-700 text-cream-100 shadow-md"
                      : "bg-cream-100 text-ketchup-700 hover:bg-cream-200"
                  }`}
                  onClick={() => {
                    triggerHaptic("light")
                    setActiveCategory(category.id)
                  }}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <Tabs defaultValue="places" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-cream-50">
          <TabsTrigger
            value="places"
            className="data-[state=active]:bg-white data-[state=active]:text-ketchup-700 data-[state=active]:shadow-sm"
            onClick={() => triggerHaptic("light")}
          >
            Places
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            className="data-[state=active]:bg-white data-[state=active]:text-ketchup-700 data-[state=active]:shadow-sm"
            onClick={() => triggerHaptic("light")}
          >
            Friend Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="places">
          {isLoading ? (
            <LoadingSkeleton type="explore" />
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {filteredPlaces.map((place) => (
                <SwipeableCard
                  key={place.id}
                  onSwipeLeft={() => handleSwipeLeft(place.id)}
                  onSwipeRight={() => handleSwipeRight(place.id)}
                  leftLabel="Skip"
                  rightLabel="Ketchup Here"
                  leftColor="#64748b"
                  rightColor="#8b2323"
                >
                  <PlaceCard place={place} onSelect={handleSelectPlace} />
                </SwipeableCard>
              ))}
            </div>
          ) : (
            <div className="relative h-[400px] rounded-xl overflow-hidden bg-gray-100">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Map className="h-8 w-8 text-gray-400" />
                  </motion.div>
                  <p className="ml-2 text-gray-500">Loading map...</p>
                </div>
              )}
              <div
                ref={mapRef}
                className={`absolute inset-0 bg-[#f2efe9] ${mapLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
              >
                {mapLoaded && (
                  <>
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        size="sm"
                        className="bg-white text-ketchup-700 shadow-md hover:bg-cream-50"
                        onClick={() => triggerHaptic("light")}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Center Map
                      </Button>
                    </div>
                    {filteredPlaces.map((place) => (
                      <motion.div
                        key={place.id}
                        className="absolute cursor-pointer"
                        style={{
                          top: `${Math.random() * 80}%`,
                          left: `${Math.random() * 80}%`,
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSelectPlace(place.name)}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`bg-ketchup-700 text-white rounded-full p-2 shadow-lg`}>
                                {place.category.includes("Coffee") ? (
                                  <Coffee className="h-4 w-4" />
                                ) : place.category.includes("Restaurant") ? (
                                  <Utensils className="h-4 w-4" />
                                ) : place.category.includes("Bar") ? (
                                  <Beer className="h-4 w-4" />
                                ) : place.category.includes("Library") ? (
                                  <BookOpen className="h-4 w-4" />
                                ) : (
                                  <MapPin className="h-4 w-4" />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="p-1">
                                <p className="font-medium">{place.name}</p>
                                <div className="flex items-center text-xs">
                                  <span>{place.category}</span>
                                  <span className="mx-1">•</span>
                                  <span>{place.distance}</span>
                                </div>
                                {place.friends > 0 && (
                                  <div className="flex items-center mt-1 text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    <span>{place.friends} friends here</span>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="friends">
          <div className="space-y-4">
            {friendActivity.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="p-4 rounded-2xl overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 border-2 border-cream-100">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
                      <AvatarFallback className="bg-cream-100 text-ketchup-700">{activity.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{activity.name}</p>
                        <span className="mx-2 text-gray-400">•</span>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <p className="text-sm">
                        Visited <span className="font-medium text-ketchup-700">{activity.place}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      className="bg-ketchup-700 hover:bg-ketchup-800 text-white"
                      onClick={() => {
                        triggerHaptic("medium")
                        if (onSelectPlace) onSelectPlace(activity.place)
                        if (onKetchup) onKetchup()
                      }}
                    >
                      Ketchup Here
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Trending Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-ketchup-800 mb-4">Trending Now 🔥</h3>
        <div className="flex overflow-x-auto hide-scrollbar pb-2 space-x-4">
          {placesData
            .filter((place) => place.trending)
            .map((place) => (
              <motion.div
                key={place.id}
                className="flex-shrink-0 w-60"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => handleSelectPlace(place.name)}
              >
                <Card className="overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-32">
                    <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-ketchup-700 text-white shadow-sm">{place.vibe}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center bg-white px-2 py-1 rounded-full shadow-md">
                        <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="text-xs font-medium">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{place.name}</h4>
                        <p className="text-xs text-gray-500">{place.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{place.distance}</span>
                      {place.friends > 0 && (
                        <div className="flex items-center">
                          <AvatarGroup>
                            {Array(Math.min(place.friends, 3))
                              .fill(0)
                              .map((_, i) => (
                                <Avatar key={i} className="h-5 w-5 border-2 border-white">
                                  <AvatarFallback className="text-[8px]">{String.fromCharCode(65 + i)}</AvatarFallback>
                                </Avatar>
                              ))}
                          </AvatarGroup>
                          <span className="text-xs text-gray-500 ml-1">+{place.friends}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}

function PlaceCard({ place, onSelect }: { place: (typeof placesData)[0]; onSelect?: (name: string) => void }) {
  // Get color based on category
  const getCategoryColor = (category: string) => {
    if (category.includes("Coffee")) return "bg-blue-100 text-blue-700"
    if (category.includes("Restaurant")) return "bg-orange-100 text-orange-700"
    if (category.includes("Bar")) return "bg-purple-100 text-purple-700"
    if (category.includes("Library")) return "bg-green-100 text-green-700"
    if (category.includes("Park")) return "bg-emerald-100 text-emerald-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex h-24">
        <div className="relative w-1/3">
          <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
          {place.trending && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-ketchup-700 text-white shadow-sm">Trending</Badge>
            </div>
          )}
        </div>
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{place.name}</h4>
              <div className="flex items-center bg-cream-100 px-2 py-1 rounded-full shadow-sm">
                <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                <span className="text-xs font-medium text-ketchup-700">{place.rating}</span>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Badge variant="outline" className={`text-xs mr-2 py-0 px-1.5 ${getCategoryColor(place.category)}`}>
                {place.category}
              </Badge>
              <span>{place.distance}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <Badge variant="outline" className="text-xs bg-cream-50 text-ketchup-700 border-cream-200 shadow-sm">
              {place.vibe}
            </Badge>
            {place.friends > 0 && (
              <div className="flex items-center">
                <AvatarGroup>
                  {Array(Math.min(place.friends, 3))
                    .fill(0)
                    .map((_, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-white">
                        <AvatarFallback className="text-[10px]">{String.fromCharCode(65 + i)}</AvatarFallback>
                      </Avatar>
                    ))}
                </AvatarGroup>
                <span className="text-xs text-gray-500 ml-1">
                  {place.friends} {place.friends === 1 ? "friend" : "friends"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
