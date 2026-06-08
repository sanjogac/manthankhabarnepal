"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-16 md:py-24">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-block mb-4 px-4 py-1 bg-secondary/20 rounded-full"
            >
              <span className="text-secondary text-sm font-medium">
                दैनिक ब्रेकिङ न्यूज अपडेट
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
              <span className="text-secondary">मन्थन खबर</span>सँग{" "}
              जानकार रहनुहोस्
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              सही समाचार, गहन विश्लेषण, र महत्त्वपूर्ण घटनाहरूको व्यापक कभरेजको लागि तपाईंको भरपर्दो स्रोत।
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-48 h-48 md:w-64 md:h-64"
            >
              <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl" />
              <Image
                src="/images/logo.png"
                alt="Manthan Khabar"
                fill
                className="object-contain drop-shadow-2xl mix-blend-multiply"
                style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Ticker-like animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 overflow-hidden"
        >
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
            <span className="shrink-0 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded">
              लाइभ
            </span>
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: ["100%", "-100%"] }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="whitespace-nowrap text-white/90 text-sm"
              >
                मन्थन खबरमा स्वागत छ - दैनिक समाचार र अपडेटको लागि तपाईंको भरपर्दो स्रोत। ब्रेकिङ स्टोरीज, विश्लेषण, र थप कुराहरूको लागि हामीसँग रहनुहोस्।
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
