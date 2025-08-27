// "use client"
// import React, { useMemo, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
// import Slider from '@/components/ui/slider';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import Link from 'next/link';

// // ========== TYPES ==========
// interface ProgramCard {
//   id: number;
//   date: string;
//   title: string;
//   description: string;
//   image?: string;
// }

// interface SwiperConfiguration {
//   spaceBetween: number;
//   slidesPerView: number;
//   loop: boolean;
//   autoplay: {
//     delay: number;
//     disableOnInteraction: boolean;
//   };
//   breakpoints: Record<number, {
//     slidesPerView: number;
//     spaceBetween: number;
//   }>;
// }

// interface SliderSection {
//   title: string;
//   data: ProgramCard[];
// }

// // ========== CONSTANTS ==========
// const ANIMATION_VARIANTS = {
//   card: {
//     initial: {
//       scale: 1,
//       y: 0,
//       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//     },
//     hover: {
//       scale: 1.05,
//       y: -8,
//       boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//       transition: {
//         type: 'spring' as const,
//         stiffness: 300,
//         damping: 20
//       }
//     }
//   },
//   icon: {
//     initial: { rotate: 0 },
//     hover: {
//       rotate: 360,
//       transition: {
//         duration: 0.6,
//         ease: 'easeInOut' as const
//       }
//     }
//   },
//   title: {
//     initial: { color: '#7C3AED' },
//     hover: {
//       color: '#5B21B6',
//       transition: { duration: 0.3 }
//     }
//   },
//   fadeInUp: {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 }
//   },
//   fadeInDown: {
//     initial: { opacity: 0, y: -20 },
//     animate: { opacity: 1, y: 0 }
//   }
// } as const;

// const SWIPER_CONFIG: SwiperConfiguration = {
//   spaceBetween: 30,
//   slidesPerView: 1,
//   loop: true,
//   autoplay: {
//     delay: 4000,
//     disableOnInteraction: false,
//   },
//   breakpoints: {
//     320: { slidesPerView: 1, spaceBetween: 15 },
//     480: { slidesPerView: 1, spaceBetween: 20 },
//     640: { slidesPerView: 1, spaceBetween: 20 },
//     768: { slidesPerView: 2, spaceBetween: 25 },
//     1024: { slidesPerView: 3, spaceBetween: 30 },
//     1280: { slidesPerView: 3, spaceBetween: 30 },
//   },
// };

// // ========== DATA VARIABLES ==========
// const EQUESTRIAN_PROGRAM_DATA: ProgramCard[] = [
//   {
//     id: 1,
//     date: '6 JUNE, 2025',
//     title: 'Beginner Riding Fundamentals',
//     description: 'Perfect introduction to equestrian sports for new riders',
//   },
//   {
//     id: 2,
//     date: '8 JUNE, 2025',
//     title: 'Horse Care & Grooming Workshop',
//     description: 'Learn essential horse care techniques and grooming skills',
//   },
//   {
//     id: 3,
//     date: '10 JUNE, 2025',
//     title: 'Jumping Techniques Masterclass',
//     description: 'Advanced jumping techniques for experienced riders',
//   },
//   {
//     id: 4,
//     date: '12 JULY, 2025',
//     title: 'Dressage Training Session',
//     description: 'Professional dressage training for competitive riders',
//   },
//   {
//     id: 5,
//     date: '15 JULY, 2025',
//     title: 'Trail Riding Adventure',
//     description: 'Scenic trail riding experience for all skill levels',
//   }
// ];

// const SPORTS_OUTSOURCING_DATA: ProgramCard[] = [
//   {
//     id: 1,
//     date: '20 JUNE, 2025',
//     title: 'Football Training Camp',
//     description: 'Professional football training for school teams',
//   },
//   {
//     id: 2,
//     date: '25 JUNE, 2025',
//     title: 'Basketball Skills Development',
//     description: 'Enhance basketball skills with expert coaches',
//   },
//   {
//     id: 3,
//     date: '30 JUNE, 2025',
//     title: 'Swimming Championship Prep',
//     description: 'Intensive swimming training for competitions',
//   },
//   {
//     id: 4,
//     date: '5 JULY, 2025',
//     title: 'Athletic Field Day',
//     description: 'Multi-sport event for all age groups',
//   },
//   {
//     id: 5,
//     date: '10 JULY, 2025',
//     title: 'Tennis Academy Session',
//     description: 'Professional tennis coaching and practice',
//   }
// ];

// const SYL_DATA: ProgramCard[] = [
//   {
//     id: 1,
//     date: '1 AUGUST, 2025',
//     title: 'Youth Leadership Workshop',
//     description: 'Develop leadership skills for young athletes',
//   },
//   {
//     id: 2,
//     date: '5 AUGUST, 2025',
//     title: 'Team Building Activities',
//     description: 'Fun team building exercises and challenges',
//   },
//   {
//     id: 3,
//     date: '10 AUGUST, 2025',
//     title: 'Sports Psychology Session',
//     description: 'Mental training for peak performance',
//   },
//   {
//     id: 4,
//     date: '15 AUGUST, 2025',
//     title: 'Fitness & Nutrition Class',
//     description: 'Learn about proper nutrition and fitness',
//   },
//   {
//     id: 5,
//     date: '20 AUGUST, 2025',
//     title: 'Youth Sports Festival',
//     description: 'Celebration of youth sports achievements',
//   }
// ];

// const BIKE_PEGGING_DATA: ProgramCard[] = [
//   {
//     id: 1,
//     date: '3 SEPTEMBER, 2025',
//     title: 'Beginner Bike Pegging',
//     description: 'Introduction to bike pegging techniques',
//   },
//   {
//     id: 2,
//     date: '7 SEPTEMBER, 2025',
//     title: 'Advanced Pegging Skills',
//     description: 'Master advanced bike pegging maneuvers',
//   },
//   {
//     id: 3,
//     date: '12 SEPTEMBER, 2025',
//     title: 'Safety & Equipment Workshop',
//     description: 'Learn about safety gear and bike maintenance',
//   },
//   {
//     id: 4,
//     date: '17 SEPTEMBER, 2025',
//     title: 'Pegging Championship',
//     description: 'Competitive bike pegging tournament',
//   },
//   {
//     id: 5,
//     date: '22 SEPTEMBER, 2025',
//     title: 'Team Pegging Challenge',
//     description: 'Group challenges and team competitions',
//   }
// ];

// const EQUESTRIAN_EVENTS_DATA: ProgramCard[] = [
//   {
//     id: 1,
//     date: '1 OCTOBER, 2025',
//     title: 'Show Jumping Competition',
//     description: 'Elite show jumping event for all levels',
//   },
//   {
//     id: 2,
//     date: '5 OCTOBER, 2025',
//     title: 'Dressage Championship',
//     description: 'Elegant dressage competition and showcase',
//   },
//   {
//     id: 3,
//     date: '10 OCTOBER, 2025',
//     title: 'Cross Country Challenge',
//     description: 'Thrilling cross country riding event',
//   },
//   {
//     id: 4,
//     date: '15 OCTOBER, 2025',
//     title: 'Horse & Rider Expo',
//     description: 'Exhibition of horses and riding equipment',
//   },
//   {
//     id: 5,
//     date: '20 OCTOBER, 2025',
//     title: 'Polo Match Tournament',
//     description: 'Exciting polo matches and demonstrations',
//   }
// ];

// const ESPORTS_DATA: ProgramCard[] = [
//   {
//     id: 1,
//     date: '2 NOVEMBER, 2025',
//     title: 'FIFA Tournament',
//     description: 'Competitive FIFA gaming championship',
//   },
//   {
//     id: 2,
//     date: '6 NOVEMBER, 2025',
//     title: 'League of Legends Cup',
//     description: 'MOBA gaming competition for teams',
//   },
//   {
//     id: 3,
//     date: '10 NOVEMBER, 2025',
//     title: 'Fortnite Battle Royale',
//     description: 'Solo and team battle royale competitions',
//   },
//   {
//     id: 4,
//     date: '15 NOVEMBER, 2025',
//     title: 'Counter-Strike Tournament',
//     description: 'Tactical FPS gaming championship',
//   },
//   {
//     id: 5,
//     date: '20 NOVEMBER, 2025',
//     title: 'Gaming Skills Workshop',
//     description: 'Learn professional gaming techniques',
//   }
// ];

// // ========== SLIDER SECTIONS CONFIG ==========
// const SLIDER_SECTIONS: SliderSection[] = [
//   {
//     title: 'School Equestrian Program',
//     data: EQUESTRIAN_PROGRAM_DATA
//   },
//   {
//     title: 'School Sports Outsourcing',
//     data: SPORTS_OUTSOURCING_DATA
//   },
//   {
//     title: 'SYL',
//     data: SYL_DATA
//   },
//   {
//     title: 'Bike Pegging League',
//     data: BIKE_PEGGING_DATA
//   },
//   {
//     title: 'Equestrian Events',
//     data: EQUESTRIAN_EVENTS_DATA
//   },
//   {
//     title: 'E-Sports',
//     data: ESPORTS_DATA
//   }
// ];

// // ========== CUSTOM HOOKS ==========
// const useAnimationVariants = () => useMemo(() => ANIMATION_VARIANTS, []);
// const useSwiperConfig = () => useMemo(() => SWIPER_CONFIG, []);

// // ========== SLIDER SECTION COMPONENT ==========
// const SliderSection: React.FC<{
//   title: string;
//   data: ProgramCard[];
//   variants: typeof ANIMATION_VARIANTS;
//   swiperConfig: SwiperConfiguration;
//   onCardClick: (program: ProgramCard) => void;
// }> = ({ title, data, variants, swiperConfig, onCardClick }) => (
//   <Link href={`/sports-and-events/test`} className="w-full max-w-screen-xl mx-auto px-4 pt-8 md:pt-12 lg:pt-16 xl:pt-20">
//     <motion.div
//       variants={variants.fadeInDown}
//       initial="initial"
//       animate="animate"
//       transition={{ duration: 0.6 }}
//       className="text-center mb-8 md:mb-10"
//     >
//       <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-cardinal-pink-800 mb-4 px-4">
//         {title}
//       </h2>
//     </motion.div>

//     <motion.div
//       variants={variants.fadeInUp}
//       initial="initial"
//       animate="animate"
//       transition={{ duration: 0.8, delay: 0.2 }}
//     >
//       <Swiper
//         modules={[Autoplay]}
//         {...swiperConfig}
//         className="!py-8 !px-2 md:!px-4"
//       >
//         {data.map((program) => (
//           <SwiperSlide key={program.id}>
//             <Slider
//               program={program}
//               onCardClick={onCardClick}
//               variants={variants}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </motion.div>
//   </Link>
// );

// // ========== MAIN COMPONENT ==========
// const ProgramCards: React.FC = () => {
//   const variants = useAnimationVariants();
//   const swiperConfig = useSwiperConfig();

//   // Event handlers
//   const handleCardClick = useCallback((program: ProgramCard) => {
//     console.log(`Clicked on program: ${program.title}`);
//     // Add your click logic here
//   }, []);

//   return (
//     <div className="w-full bg-white my-16 md:my-20">
//       {/* <div className="bg-[url(/assets/images/bg-4.webp)] bg"> */}
//         {SLIDER_SECTIONS.map((section, index) => (
//         <SliderSection
//           key={index}
//           title={section.title}
//           data={section.data}
//           variants={variants}
//           swiperConfig={swiperConfig}
//           onCardClick={handleCardClick}
//         />
//       ))}
//       {/* </div> */}
//     </div>
//   );
// };

// export default ProgramCards;

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

// ========== TYPES ==========
interface ProgramCard {
  id: string | number;
  date?: string;
  title: string;
  description: string;
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
    1024: { slidesPerView: 3, spaceBetween: 30 },
    1280: { slidesPerView: 3, spaceBetween: 30 },
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
      className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer h-80 group"
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
          className="text-xl font-bold mb-3 leading-tight group-hover:text-cardinal-pink-200 transition-colors duration-300"
          variants={variants.title}
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

        {/* Hover Effect Arrow */}
        {/* <motion.div
          className="absolute top-4 right-4 w-8 h-8 bg-cardinal-pink-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          variants={variants.icon}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div> */}
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
  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const variants = useAnimationVariants();
  const swiperConfig = useSwiperConfig();

  // Default image fallback
  const defaultImage = "/assets/images/services/school.jpg";

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/customers/announcements');
        const fetchedPrograms = response.data.announcement || [];

        // Map the data to match the expected structure
        const formattedPrograms: ProgramCard[] = fetchedPrograms.map((item: any, index: number) => ({
          id: item._id || index + 1,
          title: item.title || "School Program",
          description: item.description || "No description available",
          image: item.image || defaultImage,
          date: item.date ? new Date(item.date).toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).toUpperCase() : undefined,
        }));

        setPrograms(formattedPrograms);
        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError("Failed to load programs");
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Event handlers
  const handleCardClick = useCallback((program: ProgramCard) => {
    console.log(`Clicked on program: ${program.title}`);
    // Add your click logic here - navigate to program details, open modal, etc.
  }, []);

  if (error) {
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
    <div className="w-full bg-white my-16 md:my-20">
      <div className="bg-[url(/assets/images/bg-4.webp)] bg-cover bg-center bg-no-repeat">
        <SliderSection
          title="School Equestrian Program"
          data={programs}
          variants={variants}
          swiperConfig={swiperConfig}
          onCardClick={handleCardClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProgramCards;