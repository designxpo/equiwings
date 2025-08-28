"use client"
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Slider from '@/components/ui/slider';
import axiosInstance from "@/lib/config/axios";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import PAST_EVENTS_DATA from '@/utils/events.json'

// ========== TYPES ==========
interface ProgramCard {
  id: string | number;
  date?: string;
  title: string;
  description: string;
  pastPrograms?: boolean;
  location?: string;
  image?: string;
}

interface ApiResponse {
  announcement: {
    _id?: string;
    title?: string;
    description?: string;
    image?: string;
    date?: string;
  }[];
}

interface SwiperConfiguration {
  spaceBetween: number;
  slidesPerView: number;
  loop: boolean;
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
  };
  breakpoints: Record<number, {
    slidesPerView: number;
    spaceBetween: number;
  }>;
}

// ========== CONSTANTS ==========
const ANIMATION_VARIANTS = {
  card: {
    initial: {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20
      }
    }
  },
  icon: {
    initial: { rotate: 0 },
    hover: {
      rotate: 360,
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const
      }
    }
  },
  title: {
    initial: { color: '#7C3AED' },
    hover: {
      color: '#5B21B6',
      transition: { duration: 0.3 }
    }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  }
} as const;

const SWIPER_CONFIG: SwiperConfiguration = {
  spaceBetween: 30,
  slidesPerView: 1,
  loop: false, // Changed to false for better handling with dynamic data
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 15 },
    480: { slidesPerView: 1, spaceBetween: 20 },
    640: { slidesPerView: 1, spaceBetween: 20 },
    768: { slidesPerView: 2, spaceBetween: 25 },
    1024: { slidesPerView: 2, spaceBetween: 30 },
    1280: { slidesPerView: 2, spaceBetween: 30 },
  },
};


// ========== CUSTOM HOOKS ==========
const useAnimationVariants = () => useMemo(() => ANIMATION_VARIANTS, []);
const useSwiperConfig = () => useMemo(() => SWIPER_CONFIG, []);

// ========== ENHANCED SLIDER COMPONENT ==========
const EnhancedSlider: React.FC<{
  program: ProgramCard;
  onCardClick: (program: ProgramCard) => void;
  variants: typeof ANIMATION_VARIANTS;
}> = ({ program, onCardClick, variants }) => {
  const defaultImage = "/assets/images/services/school.jpg";

  return (
    <motion.div
      variants={variants.card}
      initial="initial"
      whileHover="hover"
      onClick={() => onCardClick(program)}
      className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer h-72 group"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
        style={{
          backgroundImage: `url(${program.image || defaultImage})`
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
        {program.date && (
          <motion.p
            className="text-sm font-semibold text-cardinal-pink-400 mb-2 uppercase tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {program.date}
          </motion.p>
        )}

        <motion.h3
          className="text-xl font-bold mb-3 leading-tight text-white transition-colors duration-300"
        >
          {program.title}
        </motion.h3>

        <motion.p
          className="text-gray-200 text-sm leading-relaxed line-clamp-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {program.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// ========== SLIDER SECTION COMPONENT ==========
const SliderSection: React.FC<{
  title: string;
  data: ProgramCard[];
  variants: typeof ANIMATION_VARIANTS;
  swiperConfig: SwiperConfiguration;
  onCardClick: (program: ProgramCard) => void;
  loading: boolean;
}> = ({ title, data, variants, swiperConfig, onCardClick, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 pt-8 md:pt-12 lg:pt-16 xl:pt-20">
        <div className="text-center mb-8 md:mb-10">
          <div className="h-8 md:h-10 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 pt-8 md:pt-12 lg:pt-16 xl:pt-20">
        <motion.div
          variants={variants.fadeInDown}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-cardinal-pink-800 mb-4 px-4">
            {title}
          </h2>
        </motion.div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No programs available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 pt-8 md:pt-12 lg:pt-16 xl:pt-20">
      <motion.div
        variants={variants.fadeInDown}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-10"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-cardinal-pink-800 mb-4 px-4 font-bold">
          {title}
        </h2>
      </motion.div>

      <motion.div
        variants={variants.fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Swiper
          modules={[Autoplay]}
          {...swiperConfig}
          loop={data.length > 3} // Enable loop only if we have more than 3 items
          className="!py-8 !px-2 md:!px-4"
        >
          {data.map((program) => (
            <SwiperSlide key={program.id}>
              <EnhancedSlider
                program={program}
                onCardClick={onCardClick}
                variants={variants}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const ProgramCards: React.FC = () => {
  const [upcomingPrograms, setUpcomingPrograms] = useState<ProgramCard[]>([]);
  const [pastPrograms, setPastPrograms] = useState<ProgramCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const variants = useAnimationVariants();
  const swiperConfig = useSwiperConfig();

  // Default image fallback
  const defaultImage = "/assets/images/services/school.jpg";

  // Fetch upcoming programs from API and set past programs from static data
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/customers/announcements');
        const fetchedPrograms = response.data.announcement || [];

        // Map the API data for upcoming events
        const formattedUpcomingPrograms: ProgramCard[] = fetchedPrograms.map((item: any, index: number) => ({
          id: item._id || `upcoming-${index + 1}`,
          title: item.title || "Upcoming Event",
          description: item.description || "No description available",
          image: item.image || defaultImage,
          date: item.date ? new Date(item.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).toUpperCase() : undefined,
          pastPrograms: false,
        }));

        // Set the formatted programs for upcoming events
        setUpcomingPrograms(formattedUpcomingPrograms);

        // Set past programs from static data
        setPastPrograms(PAST_EVENTS_DATA.pastEvents as ProgramCard[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError("Failed to load programs");
        setUpcomingPrograms([]);
        // Still set past programs even if API fails
        setPastPrograms(PAST_EVENTS_DATA.pastEvents as ProgramCard[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Event handlers
  const handleCardClick = useCallback((program: ProgramCard) => {
    const title = program.title.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    const eventType = program.pastPrograms ? 'past' : 'upcoming';
    router.push(`/sports-and-events/${eventType}-${title}`);
  }, [router]);

  if (error && upcomingPrograms.length === 0 && pastPrograms.length === 0) {
    return (
      <div className="w-full bg-white my-16 md:my-20">
        <div className="w-full max-w-screen-xl mx-auto px-4 pt-8 md:pt-12 lg:pt-16 xl:pt-20">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-cardinal-pink-500 text-white px-6 py-2 rounded-lg hover:bg-cardinal-pink-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Upcoming Events Section */}
      <div className="w-full bg-white">
        <div className="bg-[url(/assets/images/bg-4.webp)] bg-cover bg-center bg-no-repeat">
          <SliderSection
            title="Upcoming Events"
            data={upcomingPrograms}
            variants={variants}
            swiperConfig={swiperConfig}
            onCardClick={handleCardClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Past Events Section */}
      <div className="w-full bg-white mb-16">
        <div className="bg-[url(/assets/images/bg-4.webp)] bg-cover bg-center bg-no-repeat">
          <SliderSection
            title="Past Events"
            data={pastPrograms}
            variants={variants}
            swiperConfig={swiperConfig}
            onCardClick={handleCardClick}
            loading={false} // Past events are static, no loading needed
          />
        </div>
      </div>
    </>
  );
};

export default ProgramCards;