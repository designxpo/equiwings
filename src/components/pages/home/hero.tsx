"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Link from "next/link"

export interface SlideData {
  id: number
  title: string
  description: string
  video: string
  thumbnail: string
  slug: string
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "School Equestrian Program",
    description: "Specialised Horse Riding Program for Schools",
    video: "/assets/videos/home/hero/equiwings.mp4",
    thumbnail: "/assets/images/home/hero/7.jpeg",
    slug: "school-equestrian-program",
  },
  {
    id: 2,
    title: "Equestrian and Polo Events",
    description: "Accelerates the growth, promotion, and commercialisation of equestrian sports and polo events across national and international arenas, by blending tradition with innovation, the company builds a world-class ecosystem for athletes, horses, fans, sponsors, and stakeholders.",
    video: "/assets/videos/home/hero/equiwings.mp4",
    thumbnail: "/assets/images/home/hero/slider2.png",
    slug: "equestrian-events",
  },
  {
    id: 3,
    title: "All Sports School Program",
    description: "Delivers a turnkey school sports outsourcing solution, enabling institutions to offer premium sports education and athlete training without maintaining an in-house department. It brings professional coaches, structured PE curricula, equipment provisioning, and end-to-end sports event management directly to campus.",
    video: "/assets/videos/home/hero/equiwings.mp4",
    thumbnail: "/assets/images/home/hero/slider3.webp",
    slug: "school-sports-outsourcing",
  },
  {
    id: 4,
    title: "Bike Pegging League",
    description: "A competitive motorbike sport inspired by traditional tent pegging showcasing precision riding, control, and tactical teamwork, the league turns motorbike culture into a skill-based spectacle for athletes and fans alike.",
    video: "/assets/videos/home/hero/equiwings.mp4",
    thumbnail: "/assets/images/home/hero/bike.png",
    slug: "bike-pegging-league",
  },
  {
    id: 5,
    title: "SYL",
    description: "Empowers school students to discover and develop their athletic potential through structured coaching and goal-based training. With regular performance tracking, the program fosters a culture of striving for personal bests, delivering monthly progress, confidence, and the joy of continuous achievement.",
    video: "/assets/videos/home/hero/equiwings.mp4",
    thumbnail: "/assets/images/home/hero/slider6.png",
    slug: "strech-your-limits",
  },
  {
    id: 6,
    title: "E-Sports",
    description: "A next-generation esports platform that brings players, fans, and brands together in one professional competitive-gaming ecosystem.It delivers organised tournaments, structured team development, and global online events, blending the high-energy spirit of traditional sports with the always-on accessibility of the digital arena.",
    video: "/assets/videos/home/hero/equiwings.mp4",
    thumbnail: "/assets/images/home/hero/slider1.png",
    slug: "e-sports",
  },
]

export default function HeroCarousel() {
  const [slidePositions, setSlidePositions] = useState(() => {
    const positions: { [key: number]: number } = {}
    // Initialize first 5 slides in visible positions (-2, -1, 0, 1, 2)
    for (let i = 0; i < 5; i++) {
      positions[slides[i].id] = i - 2 // positions: -2, -1, 0, 1, 2
    }
    // Initialize 6th slide in hidden position (3)
    positions[slides[5].id] = 3 // hidden position
    return positions
  })

  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)

  // Get the slide that's currently at position 0 (center)
  const getCenterSlide = () => {
    const centerSlideId = Object.keys(slidePositions).find((id) => slidePositions[Number.parseInt(id)] === 0)
    return slides.find((slide) => slide.id === Number.parseInt(centerSlideId || "1"))
  }

  // Auto-rotation logic
  useEffect(() => {
    if (isAutoPlaying && !isAnimating) {
      intervalRef.current = setInterval(() => {
        rotateSlides("right")
      }, 10000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, isAnimating])

  // Handle video switching
  useEffect(() => {
    const centerSlide = getCenterSlide()
    if (videoRef.current && centerSlide) {
      // videoRef.current.load()
      // videoRef.current.play().catch(() => {
      //   // Handle autoplay restrictions
      // })
    }
  }, [slidePositions])

  const rotateSlides = (direction: "left" | "right") => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlidePositions((prev) => {
      const newPositions: { [key: number]: number } = {}
      Object.keys(prev).forEach((slideId) => {
        const currentPosition = prev[Number.parseInt(slideId)]
        let newPosition: number
        if (direction === "right") {
          // Circular rotation through all 6 positions: -2, -1, 0, 1, 2, 3 (hidden)
          switch (currentPosition) {
            case 0:
              newPosition = -1
              break
            case -1:
              newPosition = -2
              break
            case -2:
              newPosition = 3 // move to hidden position
              break
            case 3:
              newPosition = 2 // bring from hidden to visible
              break
            case 2:
              newPosition = 1
              break
            case 1:
              newPosition = 0
              break
            default:
              newPosition = currentPosition
          }
        } else {
          // Reverse circular rotation
          switch (currentPosition) {
            case 0:
              newPosition = 1
              break
            case 1:
              newPosition = 2
              break
            case 2:
              newPosition = 3 // move to hidden position
              break
            case 3:
              newPosition = -2 // bring from hidden to visible
              break
            case -2:
              newPosition = -1
              break
            case -1:
              newPosition = 0
              break
            default:
              newPosition = currentPosition
          }
        }
        newPositions[Number.parseInt(slideId)] = newPosition
      })
      return newPositions
    })
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Immediately center a clicked slide
  const centerSlideOnClick = (targetSlideId: number) => {
    if (isAnimating || isSwiping) return
    setIsAnimating(true)

    setSlidePositions((prev) => {
      const newPositions: { [key: number]: number } = {}
      const targetCurrentPosition = prev[targetSlideId]

      // Calculate the shift needed
      const shift = -targetCurrentPosition

      // Apply the shift to all slides
      Object.keys(prev).forEach((slideId) => {
        const currentPosition = prev[Number.parseInt(slideId)]
        let newPosition = currentPosition + shift

        // Handle wrapping around the circular positions (now including position 3)
        while (newPosition > 3) newPosition = newPosition - 6
        while (newPosition < -2) newPosition = newPosition + 6

        newPositions[Number.parseInt(slideId)] = newPosition
      })

      return newPositions
    })

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsSwiping(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.targetTouches[0].clientX
    const diff = touchStart - currentTouch

    // If user has moved more than 10px, consider it a swipe
    if (Math.abs(diff) > 10) {
      setIsSwiping(true)
      e.preventDefault() // Prevent scrolling
    }

    setTouchEnd(currentTouch)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 30 // Reduced threshold for better sensitivity
    const isRightSwipe = distance < -30

    if (isLeftSwipe || isRightSwipe) {
      if (!isAnimating) {
        setIsAutoPlaying(false)
        rotateSlides(isLeftSwipe ? "right" : "left")
        setTimeout(() => setIsAutoPlaying(true), 5000)
      }
    }

    // Reset swipe state
    setTimeout(() => {
      setIsSwiping(false)
    }, 100)
  }

  const handleNavigation = (navDirection: "left" | "right" | "sponsors") => {
    if (navDirection === "sponsors") {
      const sponsorsElement = document.getElementById("sponsors")
      if (sponsorsElement) {
        sponsorsElement.scrollIntoView({ behavior: "smooth" })
      }
      return
    }
    setIsAutoPlaying(false)
    rotateSlides(navDirection)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  // Function to toggle description expansion
  const toggleDescription = (slideId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedDescriptions(prev => ({
      ...prev,
      [slideId]: !prev[slideId]
    }))
  }

  // Function to truncate description and check if it needs "Read more"
  const getDisplayDescription = (description: string, slideId: number, maxLength = 100) => {
    const isExpanded = expandedDescriptions[slideId]
    const needsReadMore = description.length > maxLength

    if (!needsReadMore) {
      return { text: description, showToggle: false }
    }

    if (isExpanded) {
      return { text: description, showToggle: true }
    } else {
      return { text: description.substring(0, maxLength) + "...", showToggle: true }
    }
  }

  const getCardPosition = (position: number) => {
    // Get current screen width
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024

    // Determine how many cards to show based on screen size
    const isMobile = screenWidth < 640
    const isTablet = screenWidth >= 640 && screenWidth < 1024

    if (isMobile) {
      // Mobile: Show only 3 cards (-1, 0, 1) with bigger sizes
      const mobilePositions = {
        [-1]: {
          x: -180, // Closer positioning for bigger cards
          scale: 0.85, // Bigger scale for side cards
          zIndex: 20,
          opacity: 0.8,
        },
        [0]: {
          x: 0,
          scale: 1,
          zIndex: 30,
          opacity: 1,
        },
        [1]: {
          x: 180, // Closer positioning for bigger cards
          scale: 0.85, // Bigger scale for side cards
          zIndex: 20,
          opacity: 0.8,
        },
        [-2]: {
          x: -360, // Hidden off-screen
          scale: 0.6,
          zIndex: 10,
          opacity: 0,
        },
        [2]: {
          x: 360, // Hidden off-screen
          scale: 0.6,
          zIndex: 10,
          opacity: 0,
        },
        [3]: {
          x: 500, // Hidden off-screen (6th card)
          scale: 0.6,
          zIndex: 5,
          opacity: 0,
        },
      }
      return mobilePositions[position as keyof typeof mobilePositions] || mobilePositions[0]
    } else if (isTablet) {
      // Tablet: Show 5 cards but with adjusted positioning
      const tabletPositions = {
        [-2]: {
          x: -320,
          scale: 0.7,
          zIndex: 10,
          opacity: 0.6,
        },
        [-1]: {
          x: -180,
          scale: 0.85,
          zIndex: 20,
          opacity: 0.85,
        },
        [0]: {
          x: 0,
          scale: 1,
          zIndex: 30,
          opacity: 1,
        },
        [1]: {
          x: 180,
          scale: 0.85,
          zIndex: 20,
          opacity: 0.85,
        },
        [2]: {
          x: 320,
          scale: 0.7,
          zIndex: 10,
          opacity: 0.6,
        },
        [3]: {
          x: 500, // Hidden off-screen (6th card)
          scale: 0.6,
          zIndex: 5,
          opacity: 0,
        },
      }
      return tabletPositions[position as keyof typeof tabletPositions] || tabletPositions[0]
    } else {
      // Desktop: Original 5 card layout
      const desktopPositions = {
        [-2]: {
          x: -450,
          scale: 0.65,
          zIndex: 10,
          opacity: 0.7,
        },
        [-1]: {
          x: -250,
          scale: 0.8,
          zIndex: 20,
          opacity: 0.85,
        },
        [0]: {
          x: 0,
          scale: 1,
          zIndex: 30,
          opacity: 1,
        },
        [1]: {
          x: 250,
          scale: 0.8,
          zIndex: 20,
          opacity: 0.85,
        },
        [2]: {
          x: 450,
          scale: 0.65,
          zIndex: 10,
          opacity: 0.7,
        },
        [3]: {
          x: 650, // Hidden off-screen (6th card)
          scale: 0.6,
          zIndex: 5,
          opacity: 0,
        },
      }
      return desktopPositions[position as keyof typeof desktopPositions] || desktopPositions[0]
    }
  }

  const getVisibleSlides = () => {
    return slides
      .filter((slide) => {
        const position = slidePositions[slide.id]
        return position !== undefined && position >= -2 && position <= 2
      })
      .map((slide) => ({
        ...slide,
        position: slidePositions[slide.id] || 0,
      }))
  }

  const visibleSlides = getVisibleSlides()
  const centerSlideData = getCenterSlide()

  return (
    <div className="relative w-full h-[95vh] sm:h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        // key={centerSlideData?.id}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted loop playsInline>
          {/* {centerSlideData?.video} */}
          <source src="/assets/videos/home/hero/home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Cards Carousel */}
      <div className="relative z-10 flex items-center justify-center h-full px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          <div
            className="relative w-full h-full flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: "pan-y" }}
          >
            {visibleSlides.map((slide) => {
              const cardPosition = getCardPosition(slide.position)
              const isCenter = slide.position === 0
              const isHovered = hoveredCard === slide.id
              const displayDesc = getDisplayDescription(slide.description, slide.id)

              return (
                <motion.div
                  key={slide.id}
                  className={`absolute shadow-2xl select-none ${isCenter ? "cursor-pointer" : "cursor-pointer"}`}
                  animate={{
                    x: cardPosition.x,
                    scale: cardPosition.scale,
                    zIndex: cardPosition.zIndex,
                    opacity: cardPosition.opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.6,
                    duration: 0.6,
                  }}
                  whileHover={{
                    scale: slide.position === 0 ? 1.05 : cardPosition.scale * 1.08,
                    y: slide.position === 0 ? -10 : -5,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      duration: 0.2,
                    },
                  }}
                  onMouseEnter={() => {
                    if (isCenter) {
                      setHoveredCard(slide.id)
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredCard(null)
                  }}
                  onClick={() => {
                    if (slide.position !== 0 && !isAnimating && !isSwiping) {
                      setIsAutoPlaying(false)
                      centerSlideOnClick(slide.id)
                      setTimeout(() => setIsAutoPlaying(true), 5000)
                    }
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    zIndex: cardPosition.zIndex,
                    touchAction: "none",
                  }}
                >
                  {/* Only wrap center card with Link */}
                  {isCenter ? (
                    <Link href={`/${slide.slug}`} key={slide.id}>
                      <motion.div
                        className="relative 
                          w-56 h-80 
                          xs:w-64 xs:h-96 
                          sm:w-72 sm:h-[26rem] 
                          md:w-72 md:h-[20rem] 
                          lg:w-72 lg:h-[22rem] 
                          xl:w-80 xl:h-[28rem] 
                          2xl:w-84 2xl:h-[30rem]
                          rounded-xl sm:rounded-2xl 
                          overflow-hidden"
                        style={{
                          boxShadow:
                            slide.position === 0
                              ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                              : "0 20px 40px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -4px rgba(0, 0, 0, 0.4)",
                        }}
                        whileHover={{
                          boxShadow:
                            slide.position === 0
                              ? "0 35px 70px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                              : "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 10px 20px -4px rgba(0, 0, 0, 0.5)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          duration: 0.2,
                        }}
                      >
                        {/* Card Background Image */}
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${slide.thumbnail})` }}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                        {/* Card Content Container - now using flex layout */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 text-white flex flex-col justify-end"
                          style={{ height: "100%" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: 0.1,
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          {/* Content wrapper that animates position */}
                          <motion.div
                            className="flex flex-col"
                            animate={{
                              y: isCenter && isHovered ? -40 : 0,
                            }}
                            transition={{
                              duration: 0.4,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                          >
                            {/* Title */}
                            <motion.h3
                              className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 
                                font-bold mb-1 leading-tight"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{
                                delay: 0.3,
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                            >
                              {slide.title.split(" ").map((word, index) => (
                                <span key={index}>
                                  {word}
                                  <br />
                                </span>
                              ))}
                            </motion.h3>

                            {/* Description - slides in from bottom on hover (center card only) */}
                            {isCenter && (
                              <motion.div
                                className="text-gray-200 leading-relaxed mt-2"
                                initial={{ y: 20, opacity: 0, height: 0 }}
                                animate={{
                                  y: isHovered ? 0 : 20,
                                  opacity: isHovered ? 1 : 0,
                                  height: isHovered ? "auto" : 0,
                                }}
                                transition={{
                                  duration: 0.4,
                                  ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                style={{
                                  overflow: "hidden",
                                  marginTop: isHovered ? "0.5rem" : "0",
                                }}
                              >
                                <p className="text-sm sm:text-base">
                                  {displayDesc.text}
                                </p>
                                {displayDesc.showToggle && (
                                  <button
                                    onClick={(e) => toggleDescription(slide.id, e)}
                                    className="text-xs sm:text-sm text-cardinal-pink-400 hover:text-cardinal-pink-300 mt-1 underline focus:outline-none transition-colors duration-200 cursor-pointer"
                                  >
                                    {expandedDescriptions[slide.id] ? "Read less" : "Read more"}
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </Link>
                  ) : (
                    /* Non-center cards without Link */
                    <motion.div
                      className="relative 
                        w-56 h-80 
                        xs:w-64 xs:h-96 
                        sm:w-72 sm:h-[26rem] 
                        md:w-72 md:h-[20rem] 
                        lg:w-72 lg:h-[22rem] 
                        xl:w-80 xl:h-[28rem] 
                        2xl:w-84 2xl:h-[30rem]
                        rounded-xl sm:rounded-2xl 
                        overflow-hidden"
                      style={{
                        boxShadow:
                          slide.position === 0
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                            : "0 20px 40px -12px rgba(0, 0, 0, 0.6), 0 8px 16px -4px rgba(0, 0, 0, 0.4)",
                      }}
                      whileHover={{
                        boxShadow:
                          slide.position === 0
                            ? "0 35px 70px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                            : "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 10px 20px -4px rgba(0, 0, 0, 0.5)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        duration: 0.2,
                      }}
                    >
                      {/* Card Background Image */}
                      <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.thumbnail})` }}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                      {/* Card Content */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 text-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.1,
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        <motion.h3
                          className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 
                            font-semibold mb-1 leading-tight"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            delay: 0.3,
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          {slide.title.split(" ").map((word, index) => (
                            <span key={index}>
                              {word}
                              <br />
                            </span>
                          ))}
                        </motion.h3>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <motion.div
        className="absolute bottom-3 xs:bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: 0.6,
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
          {/* Left Arrow */}
          <motion.button
            onClick={() => handleNavigation("left")}
            disabled={isAnimating}
            className="w-8 h-6 xs:w-10 xs:h-8 sm:w-12 sm:h-8 md:w-14 md:h-10 
              rounded-full bg-white/20 backdrop-blur-sm border border-white/30 
              flex items-center justify-center text-white disabled:opacity-50 
              text-xs xs:text-sm sm:text-base"
            whileHover={{
              scale: isAnimating ? 1 : 1.1,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </motion.button>
          {/* Center Button (Sponsors) */}
          <motion.button
            onClick={() => handleNavigation("sponsors")}
            id="sponsors"
            className="w-8 h-6 xs:w-10 xs:h-8 sm:w-12 sm:h-8 md:w-14 md:h-10 
              rounded-full bg-white/30 backdrop-blur-sm border border-white/40 
              flex items-center justify-center text-white 
              text-xs xs:text-sm sm:text-base"
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Go to sponsors"
          >
            <FaChevronDown />
          </motion.button>
          {/* Right Arrow */}
          <motion.button
            onClick={() => handleNavigation("right")}
            disabled={isAnimating}
            className="w-8 h-6 xs:w-10 xs:h-8 sm:w-12 sm:h-8 md:w-14 md:h-10 
              rounded-full bg-white/20 backdrop-blur-sm border border-white/30 
              flex items-center justify-center text-white disabled:opacity-50 
              text-xs xs:text-sm sm:text-base"
            whileHover={{
              scale: isAnimating ? 1 : 1.1,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Next slide"
          >
            <FaChevronRight />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}