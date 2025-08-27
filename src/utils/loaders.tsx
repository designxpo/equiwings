"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function PageLoader() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          {/* Loading Screen */}
          <AnimatePresence>
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
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[85vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )
}

// Table Skeleton Component - Only for table rows
export const ItemSkeleton = () => {
  return (
    <>
      {/* Desktop Table Skeleton Rows */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array(4).fill(null).map((_, index) => (
                <th
                  key={`header-skeleton-${index}`}
                  className="h-10 w-40 gap-6 bg-gray-200 rounded animate-pulse px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                >
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(8)].map((_, index) => (
              <tr key={`skeleton-${index}`}>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards Skeleton */}
      <div className="lg:hidden space-y-4 p-4">
        {[...Array(6)].map((_, index) => (
          <div key={`mobile-skeleton-${index}`} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
