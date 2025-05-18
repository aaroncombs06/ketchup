"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Compass } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { useMobile } from "@/hooks/use-mobile"

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function LocationInput({ value, onChange, onSubmit }: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const { triggerHaptic } = useHapticFeedback()
  const { isMobile } = useMobile()

  // Mock location suggestions
  useEffect(() => {
    if (value.length > 1) {
      const timer = setTimeout(() => {
        const mockSuggestions = [`${value} Coffee Shop`, `${value} Park`, `${value} Restaurant`, `${value} Library`]
        setSuggestions(mockSuggestions)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      triggerHaptic("medium")
      onSubmit()
    }
  }

  const detectCurrentLocation = () => {
    triggerHaptic("medium")
    setIsDetectingLocation(true)
    // Simulate location detection
    setTimeout(() => {
      onChange("Current Location")
      setIsDetectingLocation(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    triggerHaptic("light")
    onChange(suggestion)
    setSuggestions([])
    // On mobile, blur the input to hide keyboard
    if (isMobile) {
      document.activeElement instanceof HTMLElement && document.activeElement.blur()
    }
  }

  return (
    <div className="relative">
      <div
        className={`relative transition-all duration-200 ${isFocused ? "ring-2 ring-ketchup-200 rounded-xl shadow-md" : ""}`}
      >
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ketchup-500">
          <Search className="h-5 w-5" />
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder="Coffee shop, park, restaurant..."
          className="w-full pl-10 pr-10 py-4 text-base border border-gray-200 bg-cream-50 focus:bg-white transition-colors rounded-xl focus:outline-none"
          aria-label="Search for a location"
          role="combobox"
          aria-expanded={suggestions.length > 0 && isFocused}
          aria-autocomplete="list"
          aria-controls={suggestions.length > 0 ? "location-suggestions" : undefined}
        />

        <button
          type="button"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isDetectingLocation ? "bg-cream-100" : "hover:bg-cream-100"} text-ketchup-600 hover:text-ketchup-800 transition-colors`}
          onClick={detectCurrentLocation}
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
        </button>
      </div>

      <AnimatePresence>
        {suggestions.length > 0 && isFocused && (
          <motion.div
            id="location-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                role="option"
                aria-selected={false}
                className="px-4 py-3 cursor-pointer hover:bg-cream-50 flex items-center transition-colors"
                whileHover={{ x: 5, backgroundColor: "rgba(237, 194, 194, 0.2)" }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-4 w-4 mr-2 text-ketchup-500 flex-shrink-0" />
                <span className="truncate">{suggestion}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
