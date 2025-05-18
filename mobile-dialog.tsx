"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MobileDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  position?: "bottom" | "center"
  fullScreen?: boolean
  closeOnBackdropClick?: boolean
}

export default function MobileDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  position = "bottom",
  fullScreen = false,
  closeOnBackdropClick = true,
}: MobileDialogProps) {
  const [isVisible, setIsVisible] = useState(isOpen)
  const { triggerHaptic } = useHapticFeedback()

  useEffect(() => {
    setIsVisible(isOpen)

    if (isOpen) {
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = "hidden"
    } else {
      // Restore scrolling when dialog is closed
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleClose = () => {
    triggerHaptic("light")
    setIsVisible(false)
    onClose()
  }

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      handleClose()
    }
  }

  const getPositionAnimation = () => {
    if (position === "bottom") {
      return {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
      }
    }
    return {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
    }
  }

  const positionAnimation = getPositionAnimation()

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with familiar blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Dialog */}
          <div
            className={`absolute inset-0 flex ${position === "bottom" ? "items-end" : "items-center"} justify-center p-4`}
          >
            <motion.div
              initial={positionAnimation.initial}
              animate={positionAnimation.animate}
              exit={positionAnimation.exit}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full ${fullScreen ? "h-full" : "max-h-[90vh]"} ${
                position === "center" ? "max-w-md" : ""
              } bg-white ${
                fullScreen ? "rounded-none" : position === "center" ? "rounded-3xl" : "rounded-t-3xl"
              } overflow-hidden shadow-xl`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "dialog-title" : undefined}
              aria-describedby={description ? "dialog-description" : undefined}
            >
              {/* Handle for bottom sheet - familiar pattern from iOS */}
              {position === "bottom" && !fullScreen && (
                <div className="w-full flex justify-center pt-2 pb-1">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>
              )}

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <div>
                    {title && (
                      <h2 id="dialog-title" className="text-lg font-semibold">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p id="dialog-description" className="text-sm text-gray-500">
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                      onClick={handleClose}
                      aria-label="Close dialog"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={`overflow-auto ${fullScreen ? "h-[calc(100%-60px)]" : "max-h-[60vh]"}`}>{children}</div>

              {/* Footer */}
              {footer && <div className="px-4 py-3 border-t bg-white">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
