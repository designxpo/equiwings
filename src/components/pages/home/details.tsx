import React from 'react';
import { FaPlay, FaCalendar, FaUsers, FaTrophy, FaGamepad, FaBicycle, FaStar, FaAward } from 'react-icons/fa';
import { MdSports, MdOutlineEventAvailable, MdVerified } from 'react-icons/md';
import { GiHorseHead, GiStrong, GiMedal } from 'react-icons/gi';
import { FaShield } from 'react-icons/fa6';

interface SlideData {
  id: number;
  title: string;
  video: string;
  thumbnail: string;
  slug: string;
  description: string;
  detailedDescription: string;
  philosophy: string;
  features: string[];
  benefits: string[];
  uniqueAspects: string[];
  icon: React.ReactNode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface SlideDetailsProps {
  slug: string;
}

const SlideDetails: React.FC<SlideDetailsProps> = ({ slug }) => {
  const slideData: SlideData[] = [
    {
      id: 1,
      title: "E -Sports",
      video: "/assets/videos/home/hero/equiwings.mp4",
      thumbnail: "/assets/images/home/hero/slider1.png",
      slug: "e-sports",
      description: "Discover the timeless art of horsemanship through our distinguished equestrian program, where tradition meets modern excellence.",
      detailedDescription: "Our comprehensive equestrian program represents the pinnacle of educational excellence in horse riding and horsemanship. Founded on principles of respect, discipline, and partnership between rider and horse, we offer an immersive experience that transcends traditional sports education. Students embark on a transformative journey that develops not only their riding skills but also their character, confidence, and deep appreciation for these magnificent animals. Our program combines classical riding techniques with modern safety standards, ensuring each student receives world-class instruction in a supportive and nurturing environment.",
      philosophy: "We believe that the bond between horse and rider is a sacred partnership built on trust, respect, and mutual understanding. Our approach emphasizes the development of empathy, responsibility, and leadership qualities that extend far beyond the arena.",
      features: [
        "Expert instruction from certified riding masters with decades of experience",
        "Comprehensive horse care education including grooming, feeding, and health management",
        "Progressive skill development from basic horsemanship to advanced riding techniques",
        "State-of-the-art facilities featuring climate-controlled stables and premium arenas",
        "Specialized training programs tailored to individual learning styles and goals"
      ],
      benefits: [
        "Cultivate unshakeable confidence and self-assurance through mastery of challenging skills",
        "Develop profound emotional intelligence and empathy through animal partnership",
        "Build exceptional balance, coordination, and core strength through dynamic movement",
        "Learn invaluable life skills including responsibility, patience, and dedication",
        "Experience the joy and fulfillment that comes from achieving harmony with nature"
      ],
      uniqueAspects: [
        "Access to championship-quality horses with diverse temperaments and training levels",
        "Integration of classical dressage principles with modern competitive techniques",
        "Mentorship opportunities with accomplished riders and equestrian professionals",
        "Participation in prestigious regional and national equestrian competitions"
      ],
      icon: <GiHorseHead className="text-4xl" />,
      color: "amber",
      gradientFrom: "from-slate-800",
      gradientTo: "to-slate-600"
    },
    {
      id: 2,
      title: "Equestrian Events",
      video: "/assets/videos/home/hero/2.mp4",
      thumbnail: "/assets/images/home/hero/slider2.png",
      slug: "equestrian-events",
      description: "Experience the thrill and elegance of competitive equestrian sport through our prestigious tournament and exhibition series.",
      detailedDescription: "Our equestrian events program showcases the finest traditions of competitive horsemanship while fostering a spirit of excellence and sportsmanship. Throughout the year, we host a distinguished series of competitions, exhibitions, and demonstrations that celebrate the artistry and athleticism of equestrian sport. These events serve as platforms for riders to demonstrate their skills, build lasting friendships, and connect with the broader equestrian community. From intimate schooling shows to grand championship events, each occasion is carefully crafted to provide meaningful experiences for participants and spectators alike.",
      philosophy: "Competition is not merely about winning, but about the pursuit of excellence, the celebration of partnership, and the honor of representing our equestrian heritage with dignity and grace.",
      features: [
        "Elegantly organized competitions featuring multiple disciplines and skill levels",
        "Guest appearances by renowned riders and Olympic-level competitors",
        "Professional judging panels ensuring fair and educational evaluations",
        "Comprehensive event management including logistics, safety, and hospitality",
        "Exclusive networking opportunities with equestrian professionals and enthusiasts"
      ],
      benefits: [
        "Gain invaluable competitive experience in a supportive and encouraging environment",
        "Build lasting connections with fellow riders and equestrian professionals",
        "Develop mental fortitude and grace under pressure through competition",
        "Receive recognition and accolades for dedication and achievement",
        "Experience the profound satisfaction of representing your training and values"
      ],
      uniqueAspects: [
        "Partnerships with prestigious equestrian organizations and breeding farms",
        "Opportunities to compete on historic and championship-caliber venues",
        "Access to advanced training clinics with world-renowned instructors",
        "Participation in charity events that support equestrian education and welfare"
      ],
      icon: <FaTrophy className="text-4xl" />,
      color: "emerald",
      gradientFrom: "from-slate-800",
      gradientTo: "to-slate-600"
    },
    {
      id: 3,
      title: "School Sports Outsourcing",
      video: "/assets/videos/home/hero/3.mp4",
      thumbnail: "/assets/images/home/hero/slider3.webp",
      slug: "school-sports-outsourcing",
      description: "Elevate your institution's athletic programs through our comprehensive sports management and consulting services.",
      detailedDescription: "Our sports outsourcing division represents a revolutionary approach to educational athletics, providing schools with access to professional-grade coaching, facilities, and program management. We understand that exceptional sports programs require specialized expertise, resources, and dedication that may extend beyond traditional school capabilities. Our comprehensive solutions ensure that every student receives world-class athletic instruction while allowing educational institutions to focus on their core academic mission. Through strategic partnerships and innovative program design, we transform athletic departments into centers of excellence that inspire student achievement and community pride.",
      philosophy: "Every student deserves access to exceptional athletic instruction and opportunities. We believe that sports education should be holistic, inclusive, and designed to develop not just athletic skills but character, leadership, and lifelong wellness habits.",
      features: [
        "Elite coaching staff with professional and collegiate competitive backgrounds",
        "Comprehensive program development including curriculum design and assessment",
        "Advanced equipment procurement and facility optimization services",
        "Integrated performance tracking and analytics for continuous improvement",
        "Customized training programs that align with educational goals and values"
      ],
      benefits: [
        "Access to professional-level coaching and instruction previously unavailable",
        "Significant reduction in administrative burden and operational complexity",
        "Enhanced student engagement and participation in athletic programs",
        "Improved competitive performance and recognition at regional levels",
        "Cost-effective solutions that maximize educational investment returns"
      ],
      uniqueAspects: [
        "Partnerships with professional sports organizations and training facilities",
        "Integration of cutting-edge sports science and performance methodology",
        "Customized solutions designed specifically for educational environments",
        "Ongoing professional development and training for existing staff"
      ],
      icon: <MdSports className="text-4xl" />,
      color: "blue",
      gradientFrom: "from-slate-800",
      gradientTo: "to-slate-600"
    },
    {
      id: 4,
      title: "Bike Pegging League",
      video: "/assets/videos/home/hero/equiwings.mp4",
      thumbnail: "/assets/images/home/hero/slider4.png",
      slug: "bike-pegging-league",
      description: "Master the dynamic art of bike pegging through our innovative league system that combines precision, strategy, and cycling excellence.",
      detailedDescription: "The Bike Pegging League represents an exciting fusion of traditional cycling skills with strategic gameplay elements, creating a unique sport that challenges both physical ability and tactical thinking. This innovative discipline requires riders to demonstrate exceptional bike handling skills, spatial awareness, and team coordination while navigating complex course layouts and competitive scenarios. Our league system provides a structured progression from fundamental skills to advanced competitive play, ensuring that participants develop both individual mastery and collaborative teamwork abilities. The sport emphasizes safety, sportsmanship, and continuous skill development within a supportive community environment.",
      philosophy: "Innovation in sport comes from combining traditional skills with creative challenges. We believe that bike pegging develops not just cycling ability but critical thinking, spatial intelligence, and collaborative problem-solving skills.",
      features: [
        "Progressive skill development curriculum from basic cycling to advanced pegging techniques",
        "Professional-grade safety equipment and comprehensive safety protocols",
        "Structured league play with seasonal tournaments and championship events",
        "Expert coaching from certified cycling instructors and sport innovators",
        "Custom-designed courses that challenge riders while ensuring safety and fun"
      ],
      benefits: [
        "Develop exceptional bike handling skills and spatial awareness",
        "Build strategic thinking and tactical decision-making abilities",
        "Enhance physical fitness, coordination, and reaction time",
        "Foster teamwork and collaborative problem-solving skills",
        "Experience the excitement of participating in an innovative emerging sport"
      ],
      uniqueAspects: [
        "Pioneering role in developing and standardizing this emerging sport",
        "Access to custom-designed equipment and course configurations",
        "Opportunities to compete in regional and national bike pegging events",
        "Mentorship from sport founders and advanced competitive players"
      ],
      icon: <FaBicycle className="text-4xl" />,
      color: "purple",
      gradientFrom: "from-slate-800",
      gradientTo: "to-slate-600"
    },
    {
      id: 5,
      title: "Stretch Your Limits",
      video: "/assets/videos/home/hero/2.mp4",
      thumbnail: "/assets/images/home/hero/slider5.png",
      slug: "strech-your-limits",
      description: "Transcend your perceived boundaries through our transformative fitness and personal development program.",
      detailedDescription: "Our 'Stretch Your Limits' program is a comprehensive approach to human potential that addresses physical, mental, and emotional development simultaneously. Rooted in the understanding that true growth occurs when we venture beyond our comfort zones, this program provides structured challenges and supportive guidance to help individuals discover capabilities they never knew they possessed. Through carefully designed progressions in flexibility, strength, endurance, and mental resilience, participants embark on a journey of self-discovery that transforms not just their physical abilities but their entire relationship with challenge and achievement. Our holistic approach ensures that growth is sustainable, meaningful, and deeply personal.",
      philosophy: "Human potential is limitless when approached with proper guidance, gradual progression, and unwavering support. We believe that stretching our limits is not just about physical achievement but about developing the confidence to tackle any challenge life presents.",
      features: [
        "Comprehensive fitness assessments and personalized development planning",
        "Integration of flexibility, strength, cardiovascular, and mental training",
        "Expert guidance from certified fitness professionals and mental performance coaches",
        "Progressive challenge systems that ensure continuous growth and engagement",
        "Supportive community environment that celebrates individual achievements"
      ],
      benefits: [
        "Discover physical capabilities and flexibility you never thought possible",
        "Develop unshakeable mental resilience and confidence in facing challenges",
        "Build comprehensive fitness that enhances all aspects of daily life",
        "Learn valuable stress management and mental wellness techniques",
        "Experience the profound satisfaction of achieving seemingly impossible goals"
      ],
      uniqueAspects: [
        "Integration of mindfulness and meditation practices with physical training",
        "Access to advanced recovery and rehabilitation techniques",
        "Opportunities to participate in challenge events and achievement celebrations",
        "Mentorship from individuals who have overcome significant personal limitations"
      ],
      icon: <GiStrong className="text-4xl" />,
      color: "red",
      gradientFrom: "from-slate-800",
      gradientTo: "to-slate-600"
    },
    {
      id: 6,
      title: "School Equestrian Program",
      video: "/assets/videos/home/hero/3.mp4",
      thumbnail: "/assets/images/home/hero/slider6.png",
      slug: "school-equestrian-program",
      description: "Enter the professional realm of competitive gaming where strategy, skill, and teamwork converge in digital excellence.",
      detailedDescription: "Our E-Sports Excellence program recognizes competitive gaming as a legitimate sport that demands the same dedication, strategic thinking, and teamwork as traditional athletics. In an increasingly digital world, e-sports represents not just entertainment but a pathway to developing valuable skills including rapid decision-making, strategic planning, hand-eye coordination, and team communication. Our comprehensive program provides access to professional-grade equipment, expert coaching, and structured competitive opportunities that prepare participants for the highest levels of competitive gaming. We emphasize not just winning but the development of sportsmanship, ethical play, and the mental fortitude required for consistent high-level performance.",
      philosophy: "E-sports is a legitimate competitive discipline that develops valuable life skills including strategic thinking, teamwork, and mental resilience. We believe that competitive gaming, when approached professionally, builds character and opens doors to exciting career opportunities.",
      features: [
        "Professional gaming setups with cutting-edge hardware and software",
        "Expert coaching from former professional players and industry specialists",
        "Structured training programs covering multiple gaming genres and strategies",
        "Regular tournament participation and competitive event organization",
        "Integration of sports psychology and mental performance training"
      ],
      benefits: [
        "Develop lightning-fast decision-making and strategic thinking abilities",
        "Build exceptional hand-eye coordination and reaction time",
        "Learn advanced team communication and collaborative strategy skills",
        "Gain insights into emerging career opportunities in the gaming industry",
        "Experience the thrill of high-level competitive play and achievement"
      ],
      uniqueAspects: [
        "Partnerships with professional gaming organizations and sponsors",
        "Access to advanced analytics and performance tracking technology",
        "Opportunities to participate in regional and national e-sports competitions",
        "Career guidance and networking within the professional gaming industry"
      ],
      icon: <FaGamepad className="text-4xl" />,
      color: "cyan",
      gradientFrom: "from-slate-800",
      gradientTo: "to-slate-600"
    }
  ];

  const currentSlide = slideData.find(slide => slide.slug === slug);

  if (!currentSlide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Page Not Found</h1>
          <p className="text-gray-600 text-sm sm:text-base">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Elegant Hero Section */}
      <div className={` py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen ${currentSlide.slug.includes('e-sports') ? 'bg-[url("/assets/images/bg-5.webp")]' : 'bg-[url("/assets/images/bg-2.webp")] bg-cover bg-center'} overflow-hidden`}>

        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* <div className="mb-8 flex justify-center">
              <div className="p-6 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                {currentSlide.icon}
              </div>
            </div> */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-light">
              {currentSlide.description}
            </p>
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button className="bg-white text-gray-800 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
                <FaUsers className="mr-3" />
                Explore Program
              </button>
              <button className="border-2 border-white text-white px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
                <FaCalendar className="mr-3" />
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Program Overview</h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              {currentSlide.detailedDescription}
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Our Philosophy
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                {currentSlide.philosophy}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Features Section */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Distinguished Features
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {currentSlide.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Preview */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <FaPlay className="text-cardinal-pink-800 mr-4" />
                Experience Preview
              </h3>
              <div className="relative bg-gradient-to-br from-cardinal-pink-900 to-cardinal-pink-700 rounded-2xl overflow-hidden aspect-video">
                <img
                  src={currentSlide.thumbnail}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all duration-300 cursor-pointer group">
                  <div className="bg-white rounded-full p-4 sm:p-5 md:p-6 group-hover:scale-110 transition-transform duration-300">
                    <FaPlay className="text-gray-800 text-2xl sm:text-3xl ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Transformative Benefits
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {currentSlide.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Unique Aspects */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdVerified className="text-cardinal-pink-800 mr-4" />
                What Sets Us Apart
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {currentSlide.uniqueAspects.map((aspect, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">{aspect}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center`}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">Begin Your Journey Today</h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Take the first step towards unlocking your potential and joining a community dedicated to excellence, growth, and achievement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
              <FaUsers className="mr-3" />
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
              <FaCalendar className="mr-3" />
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Excellence Indicators */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">Excellence in Every Detail</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Award-Winning Programs</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Transformative Impact</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideDetails;