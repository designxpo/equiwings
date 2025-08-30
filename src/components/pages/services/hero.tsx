"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const announcements = [
  {
    id: 1,
    title: "EQUESTRIAN ACADEMY PROGRAMS",
    sub_title: 'Learn. Ride. Excel.',
    description:
      "Comprehensive riding programs for all ages and skill levels. From kids learning basic horsemanship to adults pursuing advanced riding sessions. Build confidence, earn certifications, and master the art of horsemanship with our expert instructors.",
    image: "/assets/images/services/school.jpg",
    quote: 'Build skills. Boost confidence.'
  },
  {
    id: 2,
    title: "COMPETITION & CORPORATE PROGRAMS",
    sub_title: 'Train Like Champions',
    description:
      "Professional competition coaching for show-jumping, dressage, and endurance events. Plus corporate wellness programs featuring team-building sessions and executive coaching through horsemanship. Elevate performance both in and out of the saddle.",
    image: "/assets/images/services/2.png",
    quote: 'Push your limits. Reach new heights.'
  }
]

const Announcements = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()                                     // run once on mount
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getImagePosition = (index: number) => {
    const totalImages = announcements.length
    const activeIndex = currentSlide

    // Calculate relative position
    const position = (index - activeIndex + totalImages) % totalImages

    return position
  }

  const getImageStyles = (position: number, mobile: boolean) => {
    if (mobile) {
      switch (position) {
        case 0: return { x: 0, scale: 1, opacity: 1, zIndex: 3 }
        case 1: return { x: 140, scale: 0.85, opacity: 0.8, zIndex: 2 }
        default: return { x: 280, scale: 0.7, opacity: 0, zIndex: 1 }
      }
    }

    // existing desktop logic
    switch (position) {
      case 0: return { x: -120, scale: 1, opacity: 1, zIndex: 3 }
      case 1: return { x: 180, scale: 0.85, opacity: 0.8, zIndex: 2 }
      default: return { x: 480, scale: 0.7, opacity: 0, zIndex: 1 }
    }
  }

  return (
    <section className="py-20 relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
      <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 px-4 lg:mb-5">
        {/* Content Section */}
        <div className="py-6 md:p-6 flex flex-col justify-center items-center h-full mt-2 lg:mt-5">

          <div className="flex flex-col uppercase justify-center w-full mb-4">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg sm:text-xl md:text-3xl text-cardinal-pink-400 font-bold">
                {announcements[currentSlide].title}
              </h3>
            </motion.div>
          </div>

          <div className="flex flex-col justify-center w-full">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-md sm:text-lg md:text-2xl text-white font-bold">
                {announcements[currentSlide].sub_title}
              </h3>
            </motion.div>
          </div>

          <div className="max-w-xl mx-auto space-y-4 my-4 lg:mt-4">
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-base md:text-lg text-white min-h-[100px]"
            >
              {announcements[currentSlide].description}
            </motion.p>

            <div className="flex flex-col justify-center w-full">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-md sm:text-lg md:text-2xl text-white font-bold">
                  {announcements[currentSlide].quote}
                </h3>
              </motion.div>
            </div>

            {/* <button className="flex mx-auto border border-[#ffc84d] px-5 py-1.5 text-sm md:text-base md:px-8 md:py-2.5 text-white rounded-lg transition duration-300 ease-in-out hover:bg-[#ffc84d] hover:cursor-pointer hover:text-[#350D3C] hover:scale-105">
              Read More
            </button> */}
          </div>
        </div>

        {/* Enhanced Rotating Carousel Section with Increased Gap and Height */}
        <div className="flex justify-center items-center relative overflow-hidden lg:mt-10">
          <div className="relative w-full h-[400px] sm:h-[450px]">
            {announcements.map((announcement, index) => {
              const position = getImagePosition(index)
              const styles = getImageStyles(position, isMobile)
              const isActive = position === 0

              return (
                <motion.div
                  key={announcement.id}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    x: styles.x,
                    scale: styles.scale,
                    opacity: styles.opacity,
                    zIndex: styles.zIndex,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${isActive ? "shadow-2xl shadow-black/30" : "shadow-lg shadow-black/20"
                      }`}
                    style={{
                      width: isActive ? (isMobile ? "300px" : "320px")
                        : (isMobile ? "240px" : "260px"),
                      height: isActive ? (isMobile ? "400px" : "450px")
                        : (isMobile ? "320px" : "400px"),
                    }}
                  >
                    <Image
                      src={announcement.image || "/placeholder.svg"}
                      fill
                      alt={`${announcement.title} announcement`}
                      className="object-cover transition-all duration-300"
                      sizes={isActive ? "320px" : "260px"}
                    />

                    {/* Gradient overlay for better visual appeal */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isActive ? "opacity-30" : "opacity-50"
                        }`}
                    />
                  </div>
                </motion.div>
              )
            })}

            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#ffc84d]/5 rounded-full blur-3xl transform -translate-y-1/2" />
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default Announcements