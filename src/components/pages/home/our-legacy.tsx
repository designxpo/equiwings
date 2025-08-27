"use client"

import { useState, useRef, useEffect } from "react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

interface TimelineEvent {
  year: string
  title: string
  description: string
  videoUrl: string
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2010",
    title: "Foundation of Excellence",
    description:
      "Hosted Asian, International, and National Equestrian Tent Pegging Championships along with the U.P. Equestrian Championship, earning National Awards in Horse Sports.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2011",
    title: "School Sports Entry",
    description:
      "Successfully launched the first-ever NCR Inter School Sports Championship, setting the foundation for school-level sporting excellence.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2012",
    title: "Continued National & International Success",
    description:
      "Reinforced its presence with Asian, International, and National Equestrian Tent Pegging Championships, the U.P. Equestrian Championship, and recognition through National Awards.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2013",
    title: "Global Recognition",
    description:
      "Organized the World, Asian, and National Equestrian Tent Pegging Championships, the Haryana Horse Show, and NCR Inter School Sports Championship, achieving multiple National Awards.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2014",
    title: "Expanding Grassroots Sports",
    description:
      "Broadened reach with NCR Inter School Sports Championship and U.P. Horse Show, strengthening youth participation.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2015",
    title: "Championship Leadership",
    description:
      "Led International, Asian, and National Equestrian Tent Pegging Championships, U.P. State Equestrian Championship, and NCR Inter School Sports Championship, while earning National Awards.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2016",
    title: "Building Infrastructure",
    description:
      "Expanded infrastructure by establishing Horse Riding Academies in Chandigarh, Hisar & Noida, and Archery Academies in Ghaziabad & Hisar, alongside Asian & U.P. Equestrian Championships.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2017",
    title: "Diversification & School Focus",
    description:
      "Hosted NCR Inter School Sports & Archery Championships, Open International Equestrian Championship, Noida Horse Show, and launched School Sports Academies & Consultancies.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2018",
    title: "New Sporting Initiatives",
    description:
      "Introduced the Indigenous Horse Racing League, organized National & U.P. Equestrian Championships, and continued to receive National Sports Awards.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2019",
    title: "Regional League Expansion",
    description:
      "Launched Regional Equestrian Leagues, hosted NCR Inter School Sports & State Archery Championships, and placed a bid for the 2021 TP World Cup Qualifiers.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2020",
    title: "Innovation & International Conferences",
    description:
      "Strengthened presence with NCR Inter School Sports Championship, REL, Open International Championship, the launch of TheTentathlon & SYL, and hosted the first International Conference on Equestrian Tent Pegging.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
  {
    year: "2021 & 2022",
    title: "Global Stage & Polo Legacy",
    description:
      "Organized World Cup Qualifiers (ITPF), National & Regional Equestrian Championships, Equiwings Polo Cup, U.P. State Championship, and initiated Horse Riding Training in Schools.",
    videoUrl: "/assets/videos/home/hero/equiwings.mp4",
  },
]

export default function RoyalTimeline() {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  // Smooth scrolling via rAF
  const isPaused = useRef(false)
  const positionRef = useRef(0)
  const contentWidthRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const speedRef = useRef(40) // px/sec
  const directionRef = useRef<-1 | 1>(-1) // -1: left, 1: right

  const handleEventHover = (index: number) => {
    setHoveredEvent(index)
  }

  const handleEventLeave = () => {
    setHoveredEvent(null)
  }

  const handleMoveLeft = () => {
    isPaused.current = false
    directionRef.current = -1 // left: content moves to the left (negative X)
  }

  const handleMoveRight = () => {
    isPaused.current = false
    directionRef.current = 1 // right: content moves to the right (positive X)
  }

  useEffect(() => {
    const el = timelineRef.current
    if (!el) return

    // Measure full content width (single set width)
    const measure = () => {
      // The content is repeated 3x; divide to get one-set width
      const totalWidth = el.scrollWidth
      contentWidthRef.current = totalWidth / 3
    }

    measure()
    const resizeObs = new ResizeObserver(measure)
    resizeObs.observe(el)

    let lastTs = performance.now()
    const tick = (ts: number) => {
      const dt = (ts - lastTs) / 1000
      lastTs = ts

      if (!isPaused.current) {
        const delta = directionRef.current * speedRef.current * dt
        positionRef.current += delta

        // Wrap to create seamless loop
        const w = contentWidthRef.current
        if (w > 0) {
          if (positionRef.current <= -w) positionRef.current += w
          if (positionRef.current >= 0) positionRef.current -= w
        }

        el.style.transform = `translateX(${positionRef.current}px) translateY(-50%)`
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    animationRef.current = requestAnimationFrame(tick)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      resizeObs.disconnect()
    }
  }, [])

  return (
    <div className="relative py-20 bg-[url(/assets/images/bg-4.webp)] bg-center bg-no-repeat bg-cover overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(168,85,247,0.03)_50%,transparent_51%)] bg-[length:20px_20px]" />
      </div>

      {/* Header */}
      <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center text-[#350D3C]">Our Legacy</h2>

      {/* Navigation Controls - bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <button
          onClick={handleMoveLeft}
          className="bg-white/90 hover:bg-white border border-cardinal-pink-200 hover:border-cardinal-pink-400 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Scroll left"
        >
          <LuChevronLeft className="w-5 h-5 text-cardinal-pink-800 group-hover:text-cardinal-pink-900" />
        </button>
        <button
          onClick={handleMoveRight}
          className="bg-white/90 hover:bg-white border border-cardinal-pink-200 hover:border-cardinal-pink-400 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Scroll right"
        >
          <LuChevronRight className="w-5 h-5 text-cardinal-pink-800 group-hover:text-cardinal-pink-900" />
        </button>
      </div>

      {/* Timeline Container */}
      <div className="relative h-[380px] xs:h-[420px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cardinal-pink-800 to-transparent transform -translate-y-1/2 shadow-lg shadow-cardinal-pink-800/20" />

        {/* Sliding Timeline Events */}
        <div
          ref={timelineRef}
          className="absolute top-1/2 transform -translate-y-1/2 flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 will-change-transform"
          style={{ width: "max-content" }}
        >
          {/* Duplicate events for seamless loop */}
          {[...timelineEvents, ...timelineEvents, ...timelineEvents].map((event, index) => (
            <div
              key={`${event.year}-${index}`}
              className="relative flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80"
              onMouseEnter={() => { handleEventHover(index); isPaused.current = true; }}
              onMouseLeave={() => { handleEventLeave(); isPaused.current = false; }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-cardinal-pink-800 to-cardinal-pink-700 rounded-full border-2 border-white shadow-lg shadow-cardinal-pink-800/30 z-20 transition-all duration-300 hover:scale-125" />

              {/* Event Card */}
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                  index % 2 === 0 ? "-translate-y-full -mt-3 sm:-mt-4 md:-mt-6" : "mt-3 sm:mt-4 md:mt-6"
                } ${hoveredEvent === index ? "scale-105 z-30 shadow-2xl" : "z-10"} w-full`}
              >
                <div className="bg-white/95 backdrop-blur-sm border border-cardinal-pink-200/60 rounded-xl p-3 sm:p-4 md:p-5 shadow-xl shadow-cardinal-pink-900/10 hover:border-cardinal-pink-400/40 hover:shadow-cardinal-pink-800/10 transition-all duration-300">
                  <div className="inline-block bg-gradient-to-r from-cardinal-pink-800 to-cardinal-pink-700 text-white font-bold text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full mb-2 shadow-md">
                    {event.year}
                  </div>

                  {/* Content */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-cardinal-pink-900 mb-1.5 sm:mb-2 leading-tight line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-cardinal-pink-700/80 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light">
                    {event.description}
                  </p>

                  <div className="mt-2 sm:mt-3 flex items-center justify-center">
                    <div
                      className={`w-6 h-0.5 bg-gradient-to-r from-transparent via-cardinal-pink-800 to-transparent transition-all duration-300 ${
                        hoveredEvent === index ? "opacity-100 scale-x-100" : "opacity-50 scale-x-75"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}