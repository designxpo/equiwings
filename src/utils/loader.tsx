"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Component() {
  const [isLoading, setIsLoading] = useState(true)
  const [showTransition, setShowTransition] = useState(false)

  useEffect(() => {
    const handlePageLoad = () => {
      // Ensure minimum loading time of 1 second for better UX
      const minLoadTime = 1000
      const startTime = Date.now()

      const finishLoading = () => {
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, minLoadTime - elapsedTime)

        setTimeout(() => {
          setShowTransition(true)
          // Hide loader after transition animation (0.5s)
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        }, remainingTime)
      }

      // Check if page is already loaded
      if (document.readyState === "complete") {
        finishLoading()
      } else {
        // Wait for all resources to load
        window.addEventListener("load", finishLoading)

        // Fallback: if load event doesn't fire within 10 seconds
        const fallbackTimer = setTimeout(finishLoading, 10000)

        return () => {
          window.removeEventListener("load", finishLoading)
          clearTimeout(fallbackTimer)
        }
      }
    }

    handlePageLoad()
  }, [])

  return (
      <main>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            {/* Loading Screen */}
            <AnimatePresence>
              {!showTransition && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center space-y-6"
                >
                  {/* Large Logo */}
                  <motion.img
                    src="/assets/images/logo.png"
                    alt="Logo"
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    }}
                  />

                  {/* Welcome Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center"
                  >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome!</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Loading your experience...</p>
                  </motion.div>

                  {/* Loading Dots */}
                  <motion.div className="flex space-x-2">
                    {[0, 1, 2].map((index) => (
                      <motion.div
                        key={index}
                        className="w-2 h-2 bg-[#350D3C] rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
  )
}
