"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import MobileNavigation from "@/components/mobile-navigation"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { Wifi, Battery, Signal } from "lucide-react"

interface MobileOptimizedLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

function StatusBar() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-transparent text-black">
      <div className="font-medium text-sm">{time}</div>
      <div className="flex items-center space-x-1">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  )
}

export default function MobileOptimizedLayout({ children, activeTab, onTabChange }: MobileOptimizedLayoutProps) {
  const { isMobile, isIOS } = useMobile()
  const [safeAreaTop, setSafeAreaTop] = useState(0)
  const [safeAreaBottom, setSafeAreaBottom] = useState(0)
  const { triggerHaptic } = useHapticFeedback()

  // Handle safe area insets for iOS devices
  useEffect(() => {
    if (typeof window !== "undefined" && isIOS) {
      // Try to get safe area insets if available
      const safeAreaInsets = {
        top: Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat") || "0", 10),
        bottom: Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab") || "0", 10),
      }

      // If CSS variables aren't available, use reasonable defaults
      setSafeAreaTop(safeAreaInsets.top || 44) // Default iOS status bar height
      setSafeAreaBottom(safeAreaInsets.bottom || 34) // Default iOS home indicator height
    }
  }, [isIOS])

  // Handle back gesture for iOS-like behavior
  const handleBackGesture = () => {
    triggerHaptic("medium")
    // Could implement history back or custom back behavior
    console.log("Back gesture detected")
  }

  if (!isMobile) {
    // For desktop, just render children without mobile optimizations
    return <>{children}</>
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-background"
      style={{
        paddingTop: isIOS ? `${safeAreaTop}px` : 0,
        paddingBottom: `${safeAreaBottom}px`,
      }}
    >
      {/* Status bar for more native feel */}
      {isIOS && <StatusBar />}

      {/* Main content with proper padding for bottom navigation */}
      <motion.main className="flex-1 pb-16 overflow-x-hidden">{children}</motion.main>

      {/* Mobile navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
