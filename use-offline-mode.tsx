"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineData, setOfflineData] = useState<Record<string, any>>({})
  const { toast } = useToast()

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online!",
        description: "Syncing your data...",
      })

      // Simulate syncing data back to server
      setTimeout(() => {
        toast({
          title: "Data synced",
          description: "All your changes have been saved",
        })
      }, 1500)
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "Don't worry, you can still use the app",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  // Save data to localStorage when offline
  const saveOfflineData = (key: string, data: any) => {
    try {
      // Update state
      setOfflineData((prev) => ({
        ...prev,
        [key]: data,
      }))

      // Save to localStorage
      localStorage.setItem(`ketchup_offline_${key}`, JSON.stringify(data))

      return true
    } catch (error) {
      console.error("Failed to save offline data:", error)
      return false
    }
  }

  // Load data from localStorage
  const loadOfflineData = (key: string) => {
    try {
      // Check if we already have it in state
      if (offlineData[key]) {
        return offlineData[key]
      }

      // Try to get from localStorage
      const data = localStorage.getItem(`ketchup_offline_${key}`)
      if (data) {
        const parsedData = JSON.parse(data)

        // Update state
        setOfflineData((prev) => ({
          ...prev,
          [key]: parsedData,
        }))

        return parsedData
      }

      return null
    } catch (error) {
      console.error("Failed to load offline data:", error)
      return null
    }
  }

  // Clear offline data
  const clearOfflineData = (key?: string) => {
    try {
      if (key) {
        // Clear specific key
        localStorage.removeItem(`ketchup_offline_${key}`)
        setOfflineData((prev) => {
          const newData = { ...prev }
          delete newData[key]
          return newData
        })
      } else {
        // Clear all offline data
        Object.keys(offlineData).forEach((dataKey) => {
          localStorage.removeItem(`ketchup_offline_${dataKey}`)
        })
        setOfflineData({})
      }

      return true
    } catch (error) {
      console.error("Failed to clear offline data:", error)
      return false
    }
  }

  return {
    isOnline,
    saveOfflineData,
    loadOfflineData,
    clearOfflineData,
    offlineData,
  }
}
