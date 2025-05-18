"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-cream-50 to-white">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className="w-20 h-20 mx-auto mb-4"
        >
          <Image src="/images/ketchup-logo.png" alt="Ketchup Logo" width={80} height={80} />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className="mt-4 text-lg font-medium text-ketchup-700"
        >
          loading the vibes...
        </motion.p>
      </div>
    </div>
  )
}
