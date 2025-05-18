"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Coffee, Utensils, Beer } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"

// Mock data for suggested places
const placesData = {
  coffee: [
    {
      id: 1,
      name: "Blue Bottle",
      address: "123 Main St",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "chill",
      friends: 3,
    },
    {
      id: 2,
      name: "Starbucks",
      address: "456 Oak Ave",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "busy",
      friends: 1,
    },
    {
      id: 3,
      name: "Philz",
      address: "789 Pine Blvd",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "study",
      friends: 2,
    },
  ],
  food: [
    {
      id: 1,
      name: "Shake Shack",
      address: "222 Burger Ave",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "lively",
      friends: 4,
    },
    {
      id: 2,
      name: "Chipotle",
      address: "333 Taco St",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "quick",
      friends: 0,
    },
  ],
  bars: [
    {
      id: 1,
      name: "The Alchemist",
      address: "666 Cocktail Ln",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "fancy",
      friends: 2,
    },
    {
      id: 2,
      name: "Hopworks",
      address: "777 Beer St",
      image: "/placeholder.svg?height=120&width=200",
      vibe: "chill",
      friends: 1,
    },
  ],
}

interface SuggestedPlacesProps {
  onSelectPlace: (place: string) => void
}

export default function SuggestedPlaces({ onSelectPlace }: SuggestedPlacesProps) {
  const [activeCategory, setActiveCategory] = useState("coffee")

  const handleSelectPlace = (name: string) => {
    onSelectPlace(name)
  }

  const categories = [
    { id: "coffee", icon: <Coffee className="h-4 w-4" />, label: "Coffee" },
    { id: "food", icon: <Utensils className="h-4 w-4" />, label: "Food" },
    { id: "bars", icon: <Beer className="h-4 w-4" />, label: "Drinks" },
  ]

  return (
    <div className="w-full">
      <div className="flex space-x-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm ${
              activeCategory === category.id
                ? "bg-ketchup-700 text-cream-100"
                : "bg-cream-100 text-ketchup-700 hover:bg-cream-200"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon}
            <span>{category.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {placesData[activeCategory as keyof typeof placesData]?.map((place) => (
          <motion.div
            key={place.id}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => handleSelectPlace(place.name)}
          >
            <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
              <div className="flex h-24">
                <div className="relative w-1/3">
                  <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
                </div>
                <div className="w-2/3 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{place.name}</h4>
                      <Badge variant="outline" className="text-xs bg-cream-50 text-ketchup-700 border-cream-200">
                        {place.vibe}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-xs">{place.address}</p>
                  </div>

                  {place.friends > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <AvatarGroup>
                        {Array(Math.min(place.friends, 3))
                          .fill(0)
                          .map((_, i) => (
                            <Avatar key={i} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                              <AvatarFallback className="text-[10px]">{String.fromCharCode(65 + i)}</AvatarFallback>
                            </Avatar>
                          ))}
                      </AvatarGroup>
                      <span className="text-xs text-gray-500">
                        {place.friends} {place.friends === 1 ? "friend" : "friends"} here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
