"use client"
import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, Navigation } from "swiper/modules"
import Image from "next/image"
import { motion } from "framer-motion"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import axiosInstance from "@/lib/config/axios"
import { LuX } from "react-icons/lu"

interface NewsItem {
  _id: string
  title: string
  description: string
  image: string
  readMoreButton: string
  createdAt: string
  newsDate: string
  newsType: "primary" | "secondary"
  isActive: boolean
}

const News: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalImage, setModalImage] = useState<NewsItem | null>(null)

  // Frame image path
  const frame = "/assets/images/home/news/frame.png"

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/customers/news")
        console.log("API Response:", response.data) // Debug log

        // Filter only active news items
        const activeNews = (response.data.news || []).filter((news: NewsItem) => news.isActive)
        setNewsData(activeNews)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching news:", err)
        setError(err.response?.data?.error || "Failed to fetch news")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Separate primary and secondary news based on newsType
  const primaryNews = newsData.filter(news => news.newsType === "primary")
  const secondaryNews = newsData.filter(news => news.newsType === "secondary")

  // Debug logs
  console.log("Total news data:", newsData)
  console.log("Primary news:", primaryNews)
  console.log("Secondary news:", secondaryNews)

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric"
    }).format(date).toUpperCase().replace(/ /g, " ")
  }

  // Handle modal open
  const openModal = (news: NewsItem) => {
    setModalImage(news)
  }

  // Handle modal close
  const closeModal = () => {
    setModalImage(null)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const slideVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  const textStaggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  const gridItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  // Loading state
  if (loading) {
    return (
      <motion.section
        className="py-20 px-4 bg-[url('/assets/images/bg-4.webp')] bg-no-repeat bg-center bg-cover"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#350D3C] text-center mb-18" variants={headerVariants}>
          News
        </motion.h2>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#350D3C] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news...</p>
          </div>
        </div>
      </motion.section>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.section
        className="py-20 px-4 bg-[url(/assets/images/bg-4.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-3xl font-semibold xl:text-5xl text-center mb-18 text-[#350D3C]" variants={headerVariants}>
          News
        </motion.h2>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#350D3C] text-white px-6 py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </motion.section>
    )
  }

  // No news state
  if (newsData.length === 0) {
    return (
      <motion.section
        className="py-20 px-4 bg-[url(/assets/images/bg-4.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-3xl font-semibold xl:text-5xl text-center mb-18 text-[#350D3C]" variants={headerVariants}>
          News
        </motion.h2>
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600 text-center">No news available at the moment.</p>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      id="news"
      className="py-20 px-4 bg-[url(/assets/images/bg-4.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header */}
      <motion.h2 className="text-3xl font-semibold xl:text-5xl text-center mb-18 text-[#350D3C]" variants={headerVariants}>
        News
      </motion.h2>

      {/* Primary News - Swiper Slider */}
      {primaryNews.length > 0 && (
        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={primaryNews.length > 1}
            className="news-swiper"
          >
            {primaryNews.map((news) => (
              <SwiperSlide key={news._id}>
                <motion.div
                  className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Image Section */}
                  <motion.div className="w-full lg:w-1/2 flex justify-center" variants={imageVariants}>
                    <motion.div
                      className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                      whileHover={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover shadow-2xl transition duration-300 ease-in-out hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </motion.div>

                  {/* Content Section */}
                  <motion.div className="w-full lg:w-1/2 text-center lg:text-left" variants={contentVariants}>
                    <motion.div className="space-y-6" variants={textStaggerVariants}>
                      <motion.p
                        className="text-sm sm:text-base font-medium text-gray-600 uppercase"
                        variants={textItemVariants}
                      >
                        {formatDate(news.createdAt)}
                      </motion.p>
                      <motion.h2
                        className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-cardinal-pink-800 leading-tight"
                        variants={textItemVariants}
                      >
                        {news.title}
                      </motion.h2>
                      <motion.p
                        className="text-base sm:text-lg text-gray-900 leading-relaxed max-w-lg mx-auto lg:mx-0"
                        variants={textItemVariants}
                      >
                        {news.description}
                      </motion.p>
                      <motion.a
                        href={news.readMoreButton}
                        target={news.readMoreButton !== "" ? "_blank" : undefined}
                        className="inline-block border-2 border-cardinal-pink-900 text-cardinal-pink-900 font-semibold hover:text-white transform mx-auto px-8 py-2.5 rounded-lg transition duration-300 ease-in-out hover:bg-cardinal-pink-900 hover:cursor-pointer"
                        variants={textItemVariants}
                        whileHover={{
                          scale: 1.08,
                          boxShadow: "0 10px 25px -5px rgba(53, 13, 60, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        Read More
                      </motion.a>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      )}

      {/* Secondary News - Swiper Slider with A4 size images */}
      {secondaryNews.length > 0 && (
        <motion.div
          className="max-w-7xl mx-auto p-5 md:-8 lg:-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >

          {/* Secondary News Slider */}
          <div className="relative secondary-news-slider">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              slidesPerGroup={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 32,
                },
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={secondaryNews.length > 4}
              className="secondary-news-swiper pb-12"
            >
              {secondaryNews.map((news, index) => (
                <SwiperSlide key={news._id}>
                  <motion.div
                    className="flex flex-col items-center h-full"
                    variants={gridItemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {/* Date on top for even index items */}
                    {index % 2 === 0 && (
                      <motion.div
                        className="mb-4"
                        variants={textItemVariants}
                      >
                        <p className="text-lg md:text-xl font-bold text-[#350D3C] text-center">
                          {formatDate(news.newsDate)}
                        </p>
                      </motion.div>
                    )}

                    {/* Framed News Image - A4 Size */}
                    <motion.div
                      className="relative w-full max-w-sm cursor-pointer p-5"
                      style={{ aspectRatio: '210/297' }} // A4 aspect ratio
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                      onClick={() => openModal(news)}
                    >
                      {/* Frame Container */}
                      <div className="relative w-full h-full">
                        {/* News Image - positioned behind the frame */}
                        <div className="absolute inset-0 z-10">
                          <div className="w-full h-full relative p-6">
                            <Image
                              src={news.image}
                              alt={news.title}
                              fill
                              className="object-cover rounded-lg p-3"
                              sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                              onError={(e) => {
                                console.error('Image failed to load:', news.image);
                              }}
                            />
                          </div>
                        </div>

                        {/* Frame Image - positioned on top */}
                        <div className="relative z-20 w-full h-full">
                          <Image
                            src={frame}
                            alt="News frame"
                            fill
                            className="object-contain pointer-events-none"
                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Date on bottom for odd index items */}
                    {index % 2 === 1 && (
                      <motion.div
                        className="mt-4"
                        variants={textItemVariants}
                      >
                        <p className="text-lg md:text-xl font-bold text-[#350D3C] text-center">
                          {formatDate(news.newsDate)}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </motion.div>
      )}

      {/* Modal for Secondary News Images with Frame */}
      {modalImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="relative max-w-lg w-full bg-white rounded-lg overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#350D3C] text-white p-4 flex justify-between items-center">
              {/* <h3 className="text-lg font-semibold">{formatDate(modalImage.newsDate)}</h3> */}
              <div></div>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded"
              >
                <LuX size={24} />
              </button>
            </div>

            {/* Optional: News Title at Bottom */}
            <div className="pt-6 px-4 md:px-8 bg-gray-50">
              <h4 className="text-[#350D3C] text-lg font-semibold">{formatDate(modalImage?.newsDate)}</h4>
            </div>

            {/* Modal Body with Framed Image */}
            <div className="px-4 pb-6 pt-2 flex justify-center items-center bg-gray-50">
              <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '210/297' }}>
                {/* Frame Container */}
                <div className="relative w-full h-full">
                  {/* News Image - positioned behind the frame */}
                  <div className="absolute inset-0 z-10 p-8">
                    <div className="w-full h-full relative">
                      <Image
                        src={modalImage.image}
                        alt={modalImage.title}
                        fill
                        className="object-cover rounded-sm"
                        sizes="(max-width: 768px) 90vw, 400px"
                      />
                    </div>
                  </div>

                  {/* Frame Image - positioned on top */}
                  <div className="relative z-20 w-full h-full">
                    <Image
                      src={frame}
                      alt="News frame"
                      fill
                      className="object-contain pointer-events-none"
                      sizes="(max-width: 768px) 90vw, 400px"
                    />
                  </div>
                </div>
              </div>
            </div>


          </motion.div>
        </motion.div>
      )}

      {/* Custom CSS for Swiper styling */}
      <style jsx global>{`
        .secondary-news-swiper .swiper-slide {
          height: auto;
        }
        
        .secondary-news-slider {
          padding: 0 10px;
        }
        
        @media (max-width: 768px) {
          .secondary-news-slider {
            padding: 0 30px;
          }
        }
        
        .news-swiper .swiper-pagination-bullet {
          background: #350D3C;
          opacity: 0.3;
        }
        
        .news-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </motion.section>
  )
}

export default News