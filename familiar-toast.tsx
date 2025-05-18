"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface FamiliarToastProps {
  message: string
  description?: string
  type?: "success" | "error" | "info"
  duration?: number
  onClose: () => void
}

export default function FamiliarToast({
  message,
  description,
  type = "success",
  duration = 3000,
  onClose,
}: FamiliarToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { triggerHaptic } = useHapticFeedback()

  useEffect(() => {
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow exit animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    triggerHaptic("light")
    setIsVisible(false)
    setTimeout(onClose, 300) // Allow exit animation to complete
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-green-50 border-green-200"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-safe-area left-0 right-0 z-50 px-4 pt-2"
          role="alert"
          aria-live="assertive"
        >
          <div className={`rounded-lg shadow-md border p-3 ${getBgColor()}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{message}</p>
                {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
              </div>
              <button
                type="button"
                className="ml-2 flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500"
                onClick={handleClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast container to manage multiple toasts
export function FamiliarToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; props: Omit<FamiliarToastProps, "onClose"> }>>([])

  const addToast = (props: Omit<FamiliarToastProps, "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, props }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <>
      {toasts.map(({ id, props }) => (
        <FamiliarToast key={id} {...props} onClose={() => removeToast(id)} />
      ))}
    </>
  )
}

// Hook to use the toast
export function useFamiliarToast() {
  const [toastContainer, setToastContainer] = useState<FamiliarToastContainer | null>(null)

  useEffect(() => {
    // Create toast container if it doesn't exist
    if (!document.getElementById("familiar-toast-container")) {
      const containerDiv = document.createElement("div")
      containerDiv.id = "familiar-toast-container"
      document.body.appendChild(containerDiv)

      // Create a new FamiliarToastContainer and set it to the state
      const newToastContainer = new FamiliarToastContainerManager()
      setToastContainer(newToastContainer)
    }
  }, [])

  const toast = (props: Omit<FamiliarToastProps, "onClose">) => {
    if (toastContainer) {
      return toastContainer.addToast(props)
    }
    return null
  }

  return { toast }
}

// Manager class to hold the addToast and removeToast methods
class FamiliarToastContainerManager {
  private toasts: Array<{ id: string; props: Omit<FamiliarToastProps, "onClose"> }> = []

  public addToast(props: Omit<FamiliarToastProps, "onClose">): string {
    const id = Math.random().toString(36).substring(2, 9)
    this.toasts = [...this.toasts, { id, props }]
    this.renderToasts()
    return id
  }

  public removeToast(id: string): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.renderToasts()
  }

  private renderToasts(): void {
    const container = document.getElementById("familiar-toast-container")
    if (container) {
      container.innerHTML = "" // Clear existing toasts
      this.toasts.forEach(({ id, props }) => {
        const toastElement = document.createElement("div")
        // Render the FamiliarToast component to a string
        const toastHTML = renderToString(<FamiliarToast key={id} {...props} onClose={() => this.removeToast(id)} />)
        toastElement.innerHTML = toastHTML
        container.appendChild(toastElement)
      })
    }
  }
}

import { renderToString } from "react-dom/server"
