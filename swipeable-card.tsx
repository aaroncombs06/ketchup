"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftLabel?: string
  rightLabel?: string
  leftColor?: string
  rightColor?: string
  threshold?: number
  className?: string
  disabled?: boolean
}

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = "Decline",
  rightLabel = "Accept",
  leftColor = "#ef4444",
  rightColor = "#8b2323",
  threshold = 100,
  className = "",
  disabled = false,
}: SwipeableCardProps) {
  const controls = useAnimation()
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { triggerHaptic } = useHapticFeedback()

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return

    const { offset, velocity } = info

    // Check if swipe was fast enough regardless of distance
    const isFastSwipe = Math.abs(velocity.x) > 500

    if (offset.x < -threshold || (offset.x < 0 && isFastSwipe)) {
      // Swiped left
      triggerHaptic("medium")
      setDirection("left")
      controls
        .start({
          x: "-100%",
          opacity: 0,
          transition: { duration: 0.2 },
        })
        .then(() => {
          if (onSwipeLeft) onSwipeLeft()
        })
    } else if (offset.x > threshold || (offset.x > 0 && isFastSwipe)) {
      // Swiped right
      triggerHaptic("medium")
      setDirection("right")
      controls
        .start({
          x: "100%",
          opacity: 0,
          transition: { duration: 0.2 },
        })
        .then(() => {
          if (onSwipeRight) onSwipeRight()
        })
    } else {
      // Not enough to trigger action, reset position
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      })
      setDirection(null)
    }
  }

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return

    // Calculate opacity based on drag distance
    const maxOpacity = 0.8
    const opacity = Math.min(Math.abs(info.offset.x) / (threshold * 2), maxOpacity)

    if (info.offset.x < 0) {
      // Dragging left
      setDirection("left")
    } else if (info.offset.x > 0) {
      // Dragging right
      setDirection("right")
    } else {
      setDirection(null)
    }
  }

  return (
    <div className="relative">
      {/* Background indicators with directional arrows for clearer affordance */}
      <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
        <div
          className={`flex items-center justify-center h-full transition-opacity duration-200 ${
            direction === "left" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="rounded-full px-4 py-2 text-white font-medium text-sm flex items-center"
            style={{ backgroundColor: leftColor }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {leftLabel}
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-full transition-opacity duration-200 ${
            direction === "right" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="rounded-full px-4 py-2 text-white font-medium text-sm flex items-center"
            style={{ backgroundColor: rightColor }}
          >
            {rightLabel}
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>

      {/* Swipeable card with hint animation on first render */}
      <motion.div
        ref={cardRef}
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        animate={controls}
        initial={{ x: 0 }}
        whileHover={{ scale: 1.01 }}
        className={`relative z-10 touch-none ${className}`}
        aria-label={`Swipeable card. Swipe left to ${leftLabel}, swipe right to ${rightLabel}`}
      >
        {children}

        {/* Subtle hint overlay to indicate swipeable functionality */}
        <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-3 opacity-0 hover:opacity-30 transition-opacity">
          <div className="bg-red-500 h-full w-1 rounded-l-full"></div>
          <div className="bg-green-500 h-full w-1 rounded-r-full"></div>
        </div>
      </motion.div>
    </div>
  )
}
