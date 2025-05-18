"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Search, MapPin, Users, User, Plus, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNavigation({ activeTab, onTabChange }: MobileNavigationProps) {
  const [showActions, setShowActions] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { isMobile } = useMobile()
  const { triggerHaptic } = useHapticFeedback()
  const router = useRouter()
  const pathname = usePathname()

  // Handle scroll direction to hide/show navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 10) {
        setIsScrollingUp(true)
      } else {
        setIsScrollingUp(currentScrollY < lastScrollY)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleTabClick = (tab: string) => {
    triggerHaptic("medium")
    onTabChange(tab)

    // Close actions menu if open
    if (showActions) {
      setShowActions(false)
    }
  }

  const handleActionClick = (action: string) => {
    triggerHaptic("medium")
    setShowActions(false)

    // Handle different quick actions
    switch (action) {
      case "new-ketchup":
        onTabChange("ketchup")
        break
      case "scan":
        // Placeholder for QR code scanner
        break
      case "share-location":
        // Placeholder for location sharing
        break
      default:
        break
    }
  }

  if (!isMobile) return null

  return (
    <>
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-20"
        initial={{ y: 0 }}
        animate={{ y: isScrollingUp ? 0 : 100 }}
        transition={{ duration: 0.3 }}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          touchAction: "none", // Prevent scrolling on the navigation bar
        }}
      >
        <div className="flex justify-around items-center p-3">
          <TabButton
            icon={<Home className="h-6 w-6" />}
            label="Home"
            isActive={activeTab === "home"}
            onClick={() => handleTabClick("home")}
          />
          <TabButton
            icon={<Search className="h-6 w-6" />}
            label="Explore"
            isActive={activeTab === "explore"}
            onClick={() => handleTabClick("explore")}
          />

          {/* Center Action Button - More prominent and familiar pattern */}
          <motion.button
            className={`relative flex items-center justify-center -mt-6 w-16 h-16 rounded-full shadow-lg ${
              showActions ? "bg-ketchup-800" : "bg-ketchup-700"
            } text-white`}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic("medium")
              setShowActions(!showActions)
            }}
            aria-label={showActions ? "Close menu" : "Create new Ketchup"}
          >
            <AnimatePresence mode="wait">
              {showActions ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-7 w-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="h-7 w-7" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <TabButton
            icon={<Users className="h-6 w-6" />}
            label="Squad"
            isActive={activeTab === "squad"}
            onClick={() => handleTabClick("squad")}
          />
          <TabButton
            icon={<User className="h-6 w-6" />}
            label="Profile"
            isActive={activeTab === "profile"}
            onClick={() => handleTabClick("profile")}
          />
        </div>
      </motion.div>

      {/* Quick Actions Menu */}
      <AnimatePresence>
        {showActions && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActions(false)}
            />

            <motion.div
              className="fixed bottom-24 left-0 right-0 z-20 flex flex-col items-center gap-3 px-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, staggerChildren: 0.1 }}
            >
              <ActionButton
                label="New Ketchup"
                icon={<MapPin className="h-5 w-5" />}
                onClick={() => handleActionClick("new-ketchup")}
                color="bg-ketchup-700"
              />

              <ActionButton
                label="Scan QR"
                icon={<Search className="h-5 w-5" />}
                onClick={() => handleActionClick("scan")}
                color="bg-cream-700"
              />

              <ActionButton
                label="Share Location"
                icon={<MapPin className="h-5 w-5" />}
                onClick={() => handleActionClick("share-location")}
                color="bg-green-600"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function TabButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={`flex flex-col items-center justify-center py-2 px-4 relative ${
        isActive ? "text-ketchup-700" : "text-gray-400"
      }`}
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 w-1.5 h-1.5 bg-ketchup-700 rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

function ActionButton({
  label,
  icon,
  onClick,
  color,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  color: string
}) {
  return (
    <motion.button
      className={`flex items-center gap-2 ${color} text-white py-3 px-6 rounded-full shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}
