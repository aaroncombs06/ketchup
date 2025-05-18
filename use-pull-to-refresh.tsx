"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  pullDownThreshold?: number
  maxPullDownDistance?: number
  backgroundColor?: string
  pullingContent?: React.ReactNode
  refreshingContent?: React.ReactNode
}

export function usePullToRefresh({
  onRefresh,
  pullDownThreshold = 80,
  maxPullDownDistance = 120,
  backgroundColor = "#ffffff",
  pullingContent = "Pull to refresh...",
  refreshingContent = "Refreshing...",
}: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useMobile()

  useEffect(() => {
    const container = containerRef.current
    if (!container || !isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull-to-refresh when at the top of the page
      if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return

      const touchY = e.touches[0].clientY
      const distance = touchY - touchStartY.current

      // Only allow pulling down, not up
      if (distance > 0 && window.scrollY === 0) {
        // Apply resistance to make it harder to pull as you go
        const newDistance = Math.min(distance * 0.5, maxPullDownDistance)
        setPullDistance(newDistance)

        // Prevent default scrolling behavior when pulling
        e.preventDefault()
      } else {
        setPullDistance(0)
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return

      if (pullDistance >= pullDownThreshold) {
        // Trigger refresh
        setIsRefreshing(true)
        setPullDistance(pullDownThreshold) // Snap to threshold

        try {
          await onRefresh()
        } catch (error) {
          console.error("Refresh failed:", error)
        }

        // Reset after refresh
        setTimeout(() => {
          setIsRefreshing(false)
          setPullDistance(0)
        }, 1000)
      } else {
        // Not pulled enough, reset
        setPullDistance(0)
      }

      setIsPulling(false)
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isPulling, pullDistance, pullDownThreshold, maxPullDownDistance, onRefresh, isMobile])

  // Component to render at the top of your page
  const PullToRefreshIndicator = () => {
    if ((pullDistance === 0 && !isRefreshing) || !isMobile) return null

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${pullDistance}px`,
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: isRefreshing ? "none" : "height 0.2s ease",
          overflow: "hidden",
          zIndex: 1000,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {isRefreshing ? refreshingContent : pullingContent}
      </div>
    )
  }

  return {
    containerRef,
    PullToRefreshIndicator,
    isRefreshing,
    pullDistance,
  }
}
