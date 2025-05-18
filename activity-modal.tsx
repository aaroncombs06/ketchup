"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"
import MobileDialog from "@/components/mobile-dialog"
import { DatePickerTrigger } from "@/components/mobile-date-picker"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import { ChevronRight } from "lucide-react"

interface ActivityModalProps {
  location: string
  onClose: () => void
  onSubmit: () => void
}

export default function ActivityModal({ location, onClose, onSubmit }: ActivityModalProps) {
  const [step, setStep] = useState(1)
  const [time, setTime] = useState("")
  const [activity, setActivity] = useState("")
  const [friendGroup, setFriendGroup] = useState("")
  const [message, setMessage] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { triggerHaptic } = useHapticFeedback()

  const times = ["15 min", "30 min", "45 min", "60 min"]
  const activities = ["Coffee ☕", "Lunch 🍽️", "Dinner 🍽️", "Study 📚", "Walk 🚶", "Drinks 🍹"]
  const friendGroups = [
    { name: "Close Friends", count: 5 },
    { name: "Study Buddies", count: 3 },
    { name: "Work Friends", count: 4 },
    { name: "Random", count: 10 },
  ]

  const messages = [
    "need caffeine asap ☕",
    "starving, let's eat! 🍔",
    "study grind time 📚",
    "need a break, who's free?",
    "vibes check ✨",
  ]

  const handleNext = () => {
    triggerHaptic("medium")
    if (step < 3) {
      setStep(step + 1)
    } else {
      onSubmit()
    }
  }

  const handleBack = () => {
    triggerHaptic("light")
    if (step > 1) {
      setStep(step - 1)
    } else {
      onClose()
    }
  }

  const isNextDisabled = () => {
    if (step === 1 && !time) return true
    if (step === 2 && !activity) return true
    if (step === 3 && !friendGroup) return true
    return false
  }

  const renderFooter = () => (
    <div className="flex space-x-3">
      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
        <Button type="button" variant="outline" className="w-full rounded-xl border-gray-200 h-12" onClick={handleBack}>
          {step === 1 ? "Cancel" : "Back"}
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
        <Button
          type="button"
          className={`w-full rounded-xl h-12 flex items-center justify-center ${
            isNextDisabled() ? "bg-gray-300 text-gray-500" : "bg-ketchup-700 hover:bg-ketchup-800 text-cream-100"
          }`}
          disabled={isNextDisabled()}
          onClick={handleNext}
        >
          {step === 3 ? (
            <>Send it! 🚀</>
          ) : (
            <>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )

  return (
    <MobileDialog isOpen={true} onClose={onClose} title="Let's Ketchup! 🍅" position="bottom" footer={renderFooter()}>
      <div className="p-4">
        {/* Progress indicator - familiar step indicator pattern */}
        <div className="flex items-center justify-between mb-6 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${
                  s < step
                    ? "bg-ketchup-700 text-white"
                    : s === step
                      ? "bg-ketchup-100 text-ketchup-700 border-2 border-ketchup-700"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              <div className={`text-xs ${s === step ? "font-medium text-ketchup-700" : "text-gray-500"}`}>
                {s === 1 ? "When" : s === 2 ? "What" : "Who"}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                <div className="bg-cream-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Where</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-ketchup-700" />
                    {location}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 text-ketchup-800">When You Free? ⏰</h3>

                  <div className="mb-4">
                    <DatePickerTrigger value={date} onChange={setDate} placeholder="Select a date" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {times.map((t) => (
                      <motion.div key={t} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full h-12 rounded-xl text-base ${
                            time === t ? "bg-cream-50 border-cream-200 text-ketchup-700" : "border-gray-200"
                          }`}
                          onClick={() => {
                            triggerHaptic("light")
                            setTime(t)
                          }}
                        >
                          {t}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-ketchup-800">What's the Vibe? 🌈</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {activities.map((a) => (
                      <motion.div key={a} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full h-12 rounded-xl text-base ${
                            activity === a ? "bg-cream-50 border-cream-200 text-ketchup-700" : "border-gray-200"
                          }`}
                          onClick={() => {
                            triggerHaptic("light")
                            setActivity(a)
                          }}
                        >
                          {a}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 text-ketchup-800">Add a Message</h3>
                  <div className="flex flex-wrap gap-2">
                    {messages.map((m) => (
                      <Badge
                        key={m}
                        variant="outline"
                        className={`cursor-pointer text-sm py-1.5 px-3 ${
                          message === m ? "bg-cream-50 border-cream-200 text-ketchup-700" : "bg-gray-50 border-gray-200"
                        }`}
                        onClick={() => {
                          triggerHaptic("light")
                          setMessage(m)
                        }}
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-ketchup-800">Who's Invited? 👀</h3>
                  <div className="space-y-3">
                    {friendGroups.map((group) => (
                      <motion.div
                        key={group.name}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-xl border cursor-pointer ${
                          friendGroup === group.name
                            ? "bg-cream-50 border-cream-200"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          triggerHaptic("light")
                          setFriendGroup(group.name)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{group.name}</span>
                          <Badge variant="outline" className="bg-white">
                            {group.count} people
                          </Badge>
                        </div>

                        <div className="mt-2 flex items-center">
                          <AvatarGroup>
                            {Array(Math.min(group.count, 3))
                              .fill(0)
                              .map((_, i) => (
                                <Avatar key={i} className="h-8 w-8 border-2 border-white">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                                  <AvatarFallback className="text-xs">{String.fromCharCode(65 + i)}</AvatarFallback>
                                </Avatar>
                              ))}
                            {group.count > 3 && (
                              <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                                  +{group.count - 3}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </AvatarGroup>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileDialog>
  )
}
