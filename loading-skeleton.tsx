"use client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  type: "friends" | "vibes" | "places" | "ketchups" | "profile" | "explore"
}

export default function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  switch (type) {
    case "friends":
      return (
        <div className="flex items-center space-x-2 mb-4 bg-cream-50 p-3 rounded-xl border border-cream-100">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full border-2 border-white" />
            ))}
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      )

    case "vibes":
      return (
        <div className="flex overflow-x-auto pb-2 space-x-3 hide-scrollbar">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 h-10 w-32 rounded-2xl" />
          ))}
        </div>
      )

    case "places":
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-2xl border-0 shadow-sm">
              <div className="flex h-24">
                <Skeleton className="w-1/3 h-full" />
                <div className="w-2/3 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-10 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, j) => (
                          <Skeleton key={j} className="h-6 w-6 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-3 w-12 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )

    case "ketchups":
      return (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4 rounded-2xl border-0 shadow-sm">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-40 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      )

    case "profile":
      return (
        <div className="space-y-4">
          <div className="flex items-center">
            <Skeleton className="h-20 w-20 rounded-full mr-4" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      )

    case "explore":
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="flex-shrink-0 h-8 w-24 rounded-full" />
            ))}
          </div>
          <div className="space-y-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-2xl border-0 shadow-sm">
                <div className="flex h-24">
                  <Skeleton className="w-1/3 h-full" />
                  <div className="w-2/3 p-3">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32 mb-2" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}
