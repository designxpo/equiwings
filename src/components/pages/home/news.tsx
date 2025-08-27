"use client"
import React, { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import Image from "next/image"
import { motion } from "framer-motion"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import axiosInstance from "@/lib/config/axios"

interface NewsItem {
  _id: string
  title: string
  description: string
  image: string
  createdAt: string
  isActive: boolean
}

const News: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default image path
  const defaultImage = "/assets/images/home/news/1.webp"

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/customers/news")
        setNewsData(response.data.news || [])
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).toUpperCase()
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
        <motion.h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-18 text-[#350D3C]" variants={headerVariants}>
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
        <motion.h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-18 text-[#350D3C]" variants={headerVariants}>
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
      className="py-20 px-4 bg-[url(/assets/images/bg-4.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header */}
      <motion.h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-18 text-[#350D3C]" variants={headerVariants}>
        News
      </motion.h2>

      {/* Swiper Slider */}
      <motion.div
        className="relative"
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
          loop={true}
          className="news-swiper"
        >
          {newsData.map((news) => (
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
                    <motion.button
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
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </motion.section>
  )
}

export default News