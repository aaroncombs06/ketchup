"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseVirtualListOptions<T> {
  items: T[]
  itemHeight: number
  overscan?: number
}

interface UseVirtualListResult<T> {
  virtualItems: {
    index: number
    item: T
    offsetTop: number
  }[]
  totalHeight: number
  containerRef: React.RefObject<HTMLDivElement>
}

export function useVirtualList<T>({
  items,
  itemHeight,
  overscan = 3,
}: UseVirtualListOptions<T>): UseVirtualListResult<T> {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })

  const totalHeight = items.length * itemHeight

  const calculateVisibleRange = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = container.scrollTop
    const viewportHeight = container.clientHeight

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan)

    setVisibleRange({ start: startIndex, end: endIndex })
  }, [itemHeight, items.length, overscan])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    calculateVisibleRange()

    const handleScroll = () => {
      calculateVisibleRange()
    }

    container.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", calculateVisibleRange)

    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", calculateVisibleRange)
    }
  }, [calculateVisibleRange])

  const virtualItems = []

  for (let i = visibleRange.start; i <= visibleRange.end; i++) {
    if (i >= 0 && i < items.length) {
      virtualItems.push({
        index: i,
        item: items[i],
        offsetTop: i * itemHeight,
      })
    }
  }

  return {
    virtualItems,
    totalHeight,
    containerRef,
  }
}
