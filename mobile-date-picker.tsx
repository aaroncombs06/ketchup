"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"

interface MobileDatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  onClose?: () => void
  minDate?: Date
  maxDate?: Date
  title?: string
  isOpen?: boolean
}

export default function MobileDatePicker({
  value,
  onChange,
  onClose,
  minDate,
  maxDate,
  title = "Select Date",
  isOpen = false,
}: MobileDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date())
  const [isVisible, setIsVisible] = useState(isOpen)
  const { triggerHaptic } = useHapticFeedback()

  useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setCurrentMonth(value)
    }
  }, [value])

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  const handleDayClick = (day: Date) => {
    triggerHaptic("light")
    setSelectedDate(day)
    onChange(day)
  }

  const handlePrevMonth = () => {
    triggerHaptic("light")
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    triggerHaptic("light")
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  const handleConfirm = () => {
    triggerHaptic("medium")
    onChange(selectedDate)
    handleClose()
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Total days in the month
    const daysInMonth = lastDay.getDate()

    // Array to hold all calendar days
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true

    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) {
      return true
    }

    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) {
      return true
    }

    return false
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const calendarDays = generateCalendarDays()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="rounded-3xl overflow-hidden border-0 shadow-xl">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={handleClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h3 className="text-base font-medium">{formatMonth(currentMonth)}</h3>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <motion.div
                      key={index}
                      whileTap={{ scale: day ? 0.9 : 1 }}
                      className={`
                        aspect-square flex items-center justify-center rounded-full text-sm
                        ${!day ? "invisible" : ""}
                        ${isDateDisabled(day) ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
                        ${isSelected(day) ? "bg-ketchup-700 text-white" : ""}
                        ${isToday(day) && !isSelected(day) ? "border border-ketchup-700 text-ketchup-700" : ""}
                        ${!isDateDisabled(day) && !isSelected(day) && !isToday(day) ? "hover:bg-cream-100" : ""}
                      `}
                      onClick={() => day && !isDateDisabled(day) && handleDayClick(day)}
                    >
                      {day?.getDate()}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 border-t flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button className="bg-ketchup-700 text-white hover:bg-ketchup-800" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DatePickerTrigger({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: {
  value?: Date
  onChange: (date: Date) => void
  placeholder?: string
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { triggerHaptic } = useHapticFeedback()

  const handleOpen = () => {
    triggerHaptic("light")
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const formatDate = (date?: Date) => {
    if (!date) return placeholder
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className={cn(
          "w-full justify-start text-left font-normal py-6 rounded-xl bg-cream-50 border-gray-200",
          !value && "text-gray-500",
          className,
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDate(value)}
      </Button>

      <MobileDatePicker value={value} onChange={onChange} onClose={handleClose} isOpen={isOpen} />
    </>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
