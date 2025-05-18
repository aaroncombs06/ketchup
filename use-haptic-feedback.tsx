"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

type HapticIntensity = "light" | "medium" | "heavy"

export function useHapticFeedback() {
  const [hapticSupported, setHapticSupported] = useState(false)
  const [hapticEnabled, setHapticEnabled] = useState(true)
  const { isMobile, isIOS, isAndroid } = useMobile()

  useEffect(() => {
    // Check if haptic feedback is supported
    if (typeof navigator !== "undefined") {
      // Check for vibration API support
      const hasVibration = "vibrate" in navigator

      // Check for iOS haptic support (no direct API, but we can detect iOS)
      const hasHaptics = hasVibration || isIOS

      setHapticSupported(hasHaptics)

      // Try to get user preference from localStorage
      try {
        const storedPreference = localStorage.getItem("hapticFeedback")
        if (storedPreference !== null) {
          setHapticEnabled(storedPreference === "true")
        }
      } catch (e) {
        console.error("Failed to read haptic preference:", e)
      }
    }
  }, [isIOS])

  const triggerHaptic = (intensity: HapticIntensity = "medium") => {
    if (!hapticSupported || !isMobile || !hapticEnabled) return

    // Different durations based on intensity
    const durations = {
      light: 10,
      medium: 25,
      heavy: 50,
    }

    try {
      // For Android and other devices that support the Vibration API
      if ("vibrate" in navigator) {
        navigator.vibrate(durations[intensity])
      }

      // For iOS, we can't directly trigger haptics, but the vibration API
      // might be partially supported or the user will feel the tap feedback
    } catch (error) {
      console.error("Haptic feedback failed:", error)
    }
  }

  const toggleHapticFeedback = () => {
    const newValue = !hapticEnabled
    setHapticEnabled(newValue)

    // Save preference to localStorage
    try {
      localStorage.setItem("hapticFeedback", String(newValue))
    } catch (e) {
      console.error("Failed to save haptic preference:", e)
    }

    // Provide feedback if enabling
    if (newValue) {
      triggerHaptic("light")
    }
  }

  return {
    triggerHaptic,
    hapticSupported,
    hapticEnabled,
    toggleHapticFeedback,
  }
}
