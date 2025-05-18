"use client"

import type React from "react"

import { useState, useRef, type InputHTMLAttributes, type ChangeEvent, type FocusEvent } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MobileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string
  icon?: React.ReactNode
  clearable?: boolean
  onChange?: (value: string) => void
  onClear?: () => void
  className?: string
  inputClassName?: string
  labelClassName?: string
  errorMessage?: string
}

export default function MobileInput({
  label,
  icon,
  clearable = false,
  onChange,
  onClear,
  className,
  inputClassName,
  labelClassName,
  errorMessage,
  ...props
}: MobileInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { triggerHaptic } = useHapticFeedback()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (props.onFocus) {
      props.onFocus(e)
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const handleClear = () => {
    triggerHaptic("light")
    if (inputRef.current) {
      inputRef.current.value = ""
      if (onChange) {
        onChange("")
      }
      if (onClear) {
        onClear()
      }
      // Focus the input after clearing
      inputRef.current.focus()
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={props.id} className={cn("block text-sm font-medium text-gray-700 mb-1", labelClassName)}>
          {label}
        </label>
      )}

      <div className="relative">
        <motion.div
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "relative rounded-xl overflow-hidden transition-all duration-200",
            isFocused ? "ring-2 ring-ketchup-200 shadow-md" : "",
            errorMessage ? "ring-2 ring-red-300" : "",
          )}
        >
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{icon}</div>}

          <input
            ref={inputRef}
            className={cn(
              "w-full py-4 px-4 text-base bg-cream-50 focus:bg-white border-gray-200 rounded-xl transition-colors",
              "focus:outline-none focus:ring-0",
              icon ? "pl-10" : "",
              clearable && props.value ? "pr-10" : "",
              inputClassName,
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {clearable && props.value && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
            >
              <span className="sr-only">Clear</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          )}
        </motion.div>

        {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
      </div>
    </div>
  )
}
