"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axiosInstance from "@/lib/config/axios"

interface Announcement {
  id: string | number
  title: string
  description: string
  image: string
}

interface ApiResponse {
  announcement: {
    _id?: string
    title?: string
    description?: string
    image?: string
  }[]
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Default image fallback
  const defaultImage = "/assets/images/home/announcement/1.png"

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get<ApiResponse>('/customers/announcements')
        const fetchedAnnouncements = response.data.announcement || []

        // Map the data to match the expected structure
        const formattedAnnouncements: Announcement[] = fetchedAnnouncements.map((item, index) => ({
          id: item._id || index + 1,
          title: item.title || "Announcement",
          description: item.description || "No description available",
          image: item.image || defaultImage,
        }))

        setAnnouncements(formattedAnnouncements)
        setError(null)
      } catch (err) {
        setError("Failed to load announcements")
        // Fallback to empty array
        setAnnouncements([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-play functionality - only run when announcements exist
  useEffect(() => {
    if (announcements.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [announcements.length])

  const getImagePosition = (index: number): number => {
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

  // Loading state
  if (loading) {
    return (
      <section className="py-20 relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-2 md:mb-4 lg:mb-18 text-white">Announcements</h2>
        <div className="max-w-screen-xl mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <div className="text-white text-xl">Loading announcements...</div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-2 md:mb-4 lg:mb-18 text-white">Announcements</h2>
        <div className="max-w-screen-xl mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <div className="text-white text-xl text-center">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 border border-[#ffc84d] px-5 py-2 text-white rounded-lg hover:bg-[#ffc84d] hover:text-[#350D3C] transition duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  // No announcements available
  if (announcements.length === 0) {
    return (
      <section className="py-20 relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-2 md:mb-4 lg:mb-18 text-white">Announcements</h2>
        <div className="max-w-screen-xl mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <div className="text-white text-xl">No announcements available</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
      <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-2 md:mb-4 lg:mb-18 text-white">Announcements</h2>

      <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 px-4 lg:mb-5">
        {/* Content Section */}
        <div className="py-6 md:p-6 flex flex-col items-center justify-center h-full mt-2 lg:mt-5">

          <div className="flex flex-col uppercase justify-center items-center bg-[url('/assets/images/home/announcement/border.svg')] bg-center bg-no-repeat bg-contain h-32 md:h-40 lg:h-1/2 w-full">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-lg sm:text-xl md:text-3xl text-white">
                {announcements[currentSlide]?.title}
              </h3>
            </motion.div>
          </div>

          <div className="max-w-xl mx-auto space-y-4 my-4 lg:mt-4">
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center text-base md:text-lg text-white px-2 lg:px-6 min-h-[100px]"
            >
              {announcements[currentSlide]?.description}
            </motion.p>

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
                      src={announcement.image}
                      fill
                      alt={`${announcement.title} announcement`}
                      className="object-cover transition-all duration-300"
                      sizes={isActive ? "320px" : "260px"}
                      // onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      //   const target = e.target as HTMLImageElement
                      //   target.src = defaultImage
                      // }}
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