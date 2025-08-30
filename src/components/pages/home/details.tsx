import type React from "react"
import { FaCalendar, FaUsers, FaTrophy, FaStar, FaAward } from "react-icons/fa"
import { MdOutlineEventAvailable, MdVerified } from "react-icons/md"
import { GiMedal } from "react-icons/gi"
import { FaShield } from "react-icons/fa6"

interface SlideDetailsProps {
  slug: string
}

const SYLComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen bg-[url('/assets/images/bg-2.webp')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              Stretch Your Limits
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-light">
              Stretch Your Limit (SYL) Program is the World’s First App based Athletics Monitoring Program designed specifically for School Students.
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

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Program Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              Stretch Your Limit (SYL) Program is the World's First App based Athletics Monitoring Program designed
              specifically for School Students. "Stretch Your Limits Program" envisions every child/school student to
              explore their Athletic/Sporting Potential. To inculcate the spirit of striving to better their threshold
              limits. To achieve a sense of accomplishment and sense of continuous progress through regular monitoring
              for attainment of joy of achieving a better self every passing month...
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Our Philosophy
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                Human potential is limitless when approached with proper guidance, gradual progression, and unwavering
                support. We believe that stretching our limits is not just about physical achievement but about
                developing the confidence to tackle any challenge life presents.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 mb-12">
          {/* Distinguished Features */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Distinguished Features
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    1. Holistic Athletic Development
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Focus on speed, endurance, strength, agility, and flexibility.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Balanced training plans tailored to each student's age, fitness level, and goals.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Incorporates physical literacy, nutrition basics, and injury prevention.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    2. Certified Professional Coaches
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        All sessions led by qualified athletics coaches with proven school program experience.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Continuous upskilling and alignment with international athletic training standards.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Positive coaching approach to build confidence as well as skill.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    3. Multi-Discipline Exposure
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Training across track and field events: sprints, middle-distance, long-distance, relays, jumps,
                        and throws.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Rotational learning so every student discovers their strengths before specializing.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    4. State-of-the-Art Training Methods
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Use of modern training aids, timing systems, and video analysis for technique improvement.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Periodized training plans to steadily improve performance while avoiding burnout.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    5. School-Friendly Integration
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Sessions aligned with academic timetables to avoid classroom disruption.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Both in-school and off-campus training options.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Turnkey logistics: all equipment, setup, and session management handled by Equiwings.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">6. Competition Pathways</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Intra-school meets to foster participation and school spirit.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Preparation for inter-school, district, and national-level athletic competitions.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Individual talent identification for advanced coaching opportunities.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    7. Character & Mindset Building
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Program infused with the "Stretch Your Limits" philosophy — pushing beyond perceived barriers in
                        sport and life.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Focus on discipline, teamwork, resilience, and leadership skills.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">8. Safety & Wellbeing First</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Strict adherence to safety protocols and warm-up/cool-down practices.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Emphasis on proper technique to reduce risk of injury.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Wellness tracking and progress reports shared with parents and school staff.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Transformative Benefits */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Transformative Benefits
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    1. Elevated Physical Fitness
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Improves cardiovascular endurance, muscular strength, flexibility, and coordination.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Builds healthy habits that support lifelong wellbeing.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">2. Discovery of Talent</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Exposes students to multiple track & field disciplines to uncover hidden potential.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Provides a structured pathway for talented athletes to reach competitive levels.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    3. Boosted Confidence & Self-Belief
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Achievable progress milestones help students see measurable improvement.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Overcoming physical challenges instills a sense of pride and capability.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    4. Discipline & Goal-Setting Skills
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Students learn to set targets, commit to consistent practice, and track progress.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Fosters personal accountability and time management.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    5. Teamwork & Leadership Development
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Relay events and group training foster collaboration and trust.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Opportunities for student leadership roles in organizing meets and motivating peers.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">6. Mental Resilience</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Training and competition teach perseverance through setbacks.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Builds the ability to handle pressure, recover from losses, and adapt to challenges.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">7. Inclusive Participation</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Program accommodates all fitness levels, ensuring every student can take part.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Encourages participation from those who may not be involved in other sports.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    8. School Spirit & Community Pride
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Inter-house and inter-school events boost camaraderie and school identity.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Creates shared moments of achievement that unite students, staff, and parents.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500 mb-18">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
            <MdVerified className="text-cardinal-pink-800 mr-4" />
            What Sets Us Apart
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">
                1. First App Based Athletics Monitoring System for Schools
              </p>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">
                2. Data Pointers for Latent Talent Identification in every School
              </p>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">
                3. Innovating Techniques for Exploring a Child's Athletic Abilities
              </p>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">
                4. Providing a sense of elation to Every Child of excelling Own record over time to instill confidence
                for self improvement by Stretching Their Limits.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">Begin Your Journey Today</h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Take the first step towards unlocking your potential and joining a community dedicated to excellence,
            growth, and achievement.
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Excellence in Every Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards
                of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Award-Winning Programs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional
                program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Transformative Impact
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts
                a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EquestrianPoloComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen bg-[url('/assets/images/bg-2.webp')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              Equestrian and Polo Events
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-light">
              Where Luxury meets Thrill for Kings & Cavalry
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

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Program Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              Equiwings Sports is a pioneering sports organization dedicated to the growth, promotion, and
              commercialization of equestrian sports and polo at national and international levels. We unite tradition
              with innovation, creating a world-class ecosystem for athletes, horses, fans, and stakeholders.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Vision & Mission
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base mb-4">
                <strong>Vision:</strong> To establish equestrian sports and polo as mainstream, spectator-friendly, and
                commercially viable sports, blending heritage, lifestyle, and competitive excellence.
              </p>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                <strong>Mission:</strong> Elevate global awareness and accessibility of equestrian sports & polo,
                develop professional leagues, tournaments, and rider development programs, and integrate modern
                broadcasting, digital content, and fan engagement tools.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 mb-12">
          {/* Core Program Elements */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Core Program Elements
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    1. Professional Leagues & Tournaments
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Equiwings Polo Cup (EPC): A structured, city-based polo league format with professional teams,
                        global talent, and high-profile venues.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Equiwings Tent Pegging Premier League: World's First International Tent Pegging Premier League
                        competitions under international standards.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        The Penta Grand: Amalgamation of 5 different Championships of Equestrian Sports championing
                        competitions for Show Jumping, Dressage, Tent Pegging, Endurance and Gymkhana Events.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Conferences & Awards Nights: Equiwings organises National & International Conferences on
                        Equestrian Sports, Polo and conducts an Annual Awards Night.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">2. Talent Development</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Grassroots programs for young riders and grooms.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Elite training academies in partnership with global experts.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Scholarships and mentorships for emerging talent.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    3. Infrastructure & Facilities
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        State-of-the-art polo grounds, arenas, and stables.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Equine wellness centers with veterinary and physiotherapy services.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Digital tracking and performance analysis for riders and horses.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    4. Broadcasting & Digital Media
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        High-quality live broadcasts with multilingual commentary.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Immersive fan experiences via mobile apps and AR/VR integrations.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Global streaming partnerships to reach diverse audiences.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">5. Commercial Ecosystem</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Sponsorships & brand activations at events.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Premium hospitality & lifestyle experiences for audiences.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Merchandising and licensed apparel.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Goals */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Impact Goals
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Create sustainable career pathways for riders and support staff.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Enhance tourism and economic activity in host regions.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Preserve and promote equestrian heritage while embracing modern sports entertainment.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Audience & Market</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Primary:</strong> Affluent sports fans, equestrian communities, polo patrons.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Secondary:</strong> Lifestyle and luxury market audiences, corporate hospitality
                        clients.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">Join the Elite</h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Experience the pinnacle of equestrian sports where tradition meets innovation, and excellence is the
            standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
              <FaUsers className="mr-3" />
              Join Our League
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Excellence in Every Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards
                of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Award-Winning Programs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional
                program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Transformative Impact
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts
                a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ESportsComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className=" py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen bg-[url(/assets/images/bg-2.webp)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              E-Sports
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl font-semibold mx-auto opacity-90 leading-relaxed font-light">
              A next-generation esports platform that brings players, fans, and brands together in one professional competitive-gaming ecosystem.It delivers organised tournaments, structured team development, and global online events, blending the high-energy spirit of traditional sports with the always-on accessibility of the digital arena.
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

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Program Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              The Equiwings E-Sports Program is a dynamic competitive gaming initiative designed to unite players, fans,
              and brands under one professional ecosystem. It delivers organized tournaments, team development, and
              global online events, combining the energy of traditional sports with the accessibility of the digital
              arena.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Vision & Mission
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base mb-4">
                <strong>Vision:</strong> To make Equiwings E-Sports a premier competitive gaming platform that blends
                high-level competition, entertainment, and community engagement — reaching global audiences year-round.
              </p>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                <strong>Mission:</strong> Develop and manage professional E-Sports leagues and tournaments, nurture
                grassroots talent to elite performance levels, and create sustainable commercial opportunities for
                brands and stakeholders.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 mb-12">
          {/* Program Pillars */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Program Pillars
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    1. Professional Leagues & Tournaments
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Annual flagship league featuring top-tier teams across multiple games (e.g., FIFA, Rocket
                        League, Fortnite, Valorant).
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Seasonal cups and invitational tournaments.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Hybrid format: live arena events + global online streams.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">2. Talent Development</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        E-Sports academies for aspiring gamers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Mentorship from pro players and coaches.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Player wellness programs covering fitness, mental health, and game performance.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">3. Content & Broadcasting</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        High-quality live streams with pro commentary.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Player profile documentaries and behind-the-scenes content.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Multi-platform distribution: Twitch, YouTube, TikTok, and OTT partnerships.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">4. Community Engagement</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Open qualifiers for amateur players.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Interactive fan experiences: live chats, polls, and watch parties.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        School and university outreach to promote competitive gaming pathways.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">5. Commercial Ecosystem</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Sponsorship activations during events and streams.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Branded merchandise and digital goods.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        VIP hospitality experiences at live tournaments.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Goals */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Impact Goals
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Position Equiwings as a multi-sports entertainment brand bridging traditional and digital
                        sports.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Create viable career pathways in competitive gaming.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Foster a global community that shares passion, competition, and innovation.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Target Audience</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">Core gamers aged 16–35.</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Casual gaming fans and lifestyle audiences.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Brands targeting digitally engaged, tech-savvy demographics.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">Level Up Your Game</h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join the future of competitive gaming where skill meets strategy and champions are made.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
              <FaUsers className="mr-3" />
              Join Tournament
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
              <FaCalendar className="mr-3" />
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Excellence Indicators */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Excellence in Every Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards
                of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Award-Winning Programs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional
                program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Transformative Impact
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts
                a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BikePeggingComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen bg-[url('/assets/images/bg-2.webp')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              Bike Pegging League
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-light">
              Thrilling Motorbike Pegging League for every Bike Rider
            </p>
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button className="bg-white text-gray-800 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
                <FaUsers className="mr-3" />
                Join League
              </button>
              <button className="border-2 border-white text-white px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
                <FaCalendar className="mr-3" />
                View Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Program Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 text-center max-w-4xl mx-auto">
              The Bike Pegging League is a niche, competitive sport or recreational activity that centres around the use of motorbike, use of Lance and target pegs—cardboard attachments grounded on the tracks of a competitive arena. While traditionally the concept is derived from the Traditional Horse Sport of Tent Pegging, the Bike Pegging uses Motorbikes by 2 Riders who aim to score points by uprooting and carrying the grounded peg at an allowed speed. In this league context, the 2 Bikers are the main athletes who become the focal point of a game or competition. It is a competitive league where riders showcase their skills in precision riding using focus aiming at restricted competitive Speed.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              The Motorbike Pegging League blends adrenaline, creativity, and technical mastery. It’s a sport where bike pegs become weapons, tools, and points of finesse, elevating motorbike culture into a tactical arena of stunts, strikes, and spectacle.
            </p>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Our Philosophy
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                To create a segment for the common Motor-Bike Riders to compete with the best, in demonstration of
                skills at speed and skill at sporting arms.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gird-cols-1 gap-6 sm:gap-8 md:gap-12 mb-12">
          {/* Distinguished Features */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Distinguished Features
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">1. Peg-Centric Gameplay</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    Unlike traditional motorcycle sports, the pegs aren't just accessories—they're central to how the
                    sport is played or scored.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Combat Pegging:</strong> Riders attempt to use Lances & Swords to hit & uproot the peg
                        while riding the bike at a speed above and below the permissible limits.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Trick Pegging:</strong> Points awarded for performing precision art or maneuvers using
                        pegs—grinds, stalls, or jumps where the peg makes contact.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Peg Hits:</strong> Riders aim to "peg" targets or other riders during matches, possibly
                        in controlled zones.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    2. Close-Proximity Duels or Team-Based Formats
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    Motorbike Pegging isn't just about speed—it's about technical control, proximity interaction, and
                    creative offense/defense.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>1v1 Duels:</strong> Riders face off in arenas or circuits trying to land pegging hits.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Team Skirmishes:</strong> Like Horse derby meets motorbikes, with coordinated tactics
                        and formation riding.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Point Zones:</strong> Areas where pegging scores bonus points or changes game state.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">4. Modified Bikes & Gear</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        General & Custom-built bikes with reinforced axles, 360° rotatable pegs, or detachable trick
                        pegs.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Suspension tuned for lateral maneuvers and sudden stunts.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Riders wear body armor, padded suits, visors, Helmets and gloves—often in stylized,
                        faction-based kits.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">5. Unique Scoring System</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">Points are awarded for:</p>
                  <div className="bg-white rounded-lg p-4">
                    <table className="w-full text-sm">
                      <tbody className="space-y-2">
                        <tr className="border-b">
                          <td className="py-2 font-medium">Clean Peg Hit & Carry</td>
                          <td className="py-2 font-bold">+6</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Peg Uprooted but falls</td>
                          <td className="py-2 font-bold">+4</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Peg hit but not uprooted</td>
                          <td className="py-2 font-bold">+2</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Slow-Speed Peg Tag</td>
                          <td className="py-2 font-bold">-4</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Knock-Off or Dismount</td>
                          <td className="py-2 font-bold">-6 (with safety protocols)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    6. Arena-Based or Urban Battlegrounds
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Urban obstacle courses, graffiti-filled warehouses, or neon-lit industrial parks.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Features like grind rails, elevated walkways, ramps, and balance beams for peg use.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Controlled, closed circuits with padded barriers for safety.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    7. Faction or Style-Based Identity
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Players and teams may adopt thematic personas—cyberpunks, wasteland riders, street samurai, neon racers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Unique visual identity through helmets, bikes, and team emblems.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Could involve RPG-style lore or rankings (if part of a game or show).
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    8. Spectator Entertainment + Replayability
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Slo-mo replays of peg hits.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Helmet cams, drone views, and thermal visuals.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Commentary hyping peg-based maneuvers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Voting for “Best Peg Move” or “Savage Block” post-match.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    9. High Skill Ceiling
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Requires precision riding, strategic thinking, body coordination, and timing.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        League champions are often both riders and performers—balancing athleticism and flair.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    10. Rules and Ethics
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Strict no-contact zones for safety (e.g., above the waist or rear tire).
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Flag or penalty system for reckless riding.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Peg contact must be intentional, controlled, and within bounds.
                      </p>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          {/* Transformative Benefits */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Transformative Benefits
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  The Motorbike Pegging League (MPL)—whether interpreted as a serious sport, creative subculture, or fictional phenomenon—offers transformative benefits on multiple levels: physical, social, cultural, and even psychological. Below is a breakdown of how MPL could positively impact participants, communities, and broader audiences:
                </p>
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    1. Enhanced Physical Agility & Control
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    Riding with peg-based interaction demands far more than just throttle control. Riders train their:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Balance and coordination</strong> – Especially during peg stunts or strikes.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Reflexes</strong> – To react quickly to opponents' movements.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Core and leg strength</strong> – For shifting weight and maintaining control in
                        high-speed, tight maneuvers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Precision riding</strong> – MPL riders reach a higher level of motorcycle handling than
                        typical riders.
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold"> Benefit:</span> Riders become physically stronger, more agile, and gain superior bike mastery.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    2. Mental Toughness & Tactical Intelligence
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    MPL isn't just brute force on wheels—it's chess at 60 mph:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Strategic thinking</strong> – Positioning, baiting, and countering peg maneuvers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Situational awareness</strong> – Managing surroundings in crowded or dynamic arenas.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <strong>Stress management</strong> – Performing under pressure, in front of crowds or during
                        championship runs.
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold"> Benefit:</span> Develops focus, mental resilience, and fast decision-making—valuable on and off the bike.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    3. Community Building & Subculture Creation
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    Like skateboarding or parkour, MPL fosters tight-knit communities built around:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        DIY mechanics and custom bikes
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Shared passion for movement, freedom, and creativity
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Friendly rivalries and team alliances
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold"> Benefit:</span> Builds a sense of belonging, identity, and purpose—especially for youth or outsiders.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    4. Artistic Expression & Self-Stylization
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    With its blend of theatrical performance and technical skill, MPL becomes a canvas for
                    self-expression:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">Unique riding styles</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Custom-painted bikes and gear
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Faction-themed uniforms or personas (like wrestling or esports)
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold"> Benefit:</span> Promotes creativity and individuality—riders don’t just compete, they perform.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    5. Innovation in Bike Design and Safety Gear
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    Because peg use reshapes how bikes are ridden, MPL inspires:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <span className="font-bold">New peg designs</span> (shock-absorbing, flexible, or multi-purpose)
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <span className="font-bold">Enhanced protective gear</span> with better mobility
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <span className="font-bold">Bike frame innovations</span> for balance and contact durability
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold">Benefit:</span> Drives progress in motorcycle engineering and safety standards.
                  </p>
                </div>

                {/* Section 6 */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    6. Youth Engagement & Skill Development
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    MPL can serve as an <span className="font-bold">alternative sport</span> that attracts:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">At-risk or disengaged youth</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Non-traditional athletes who thrive outside mainstream sports
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Riders looking for non-destructive competition
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold">Benefit:</span> Provides a constructive outlet, builds discipline, and opens doors to careers in mechanics, design, or media.
                  </p>
                </div>

                {/* Section 7 */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    7. Cultural Fusion & Global Appeal
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    MPL has the potential to <span className="font-bold">blend global motorbike traditions</span>:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <span className="font-bold">Western stunt culture</span> (BMX, freestyle motocross)
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <span className="font-bold">Eastern martial arts-inspired formations or styles</span>
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        <span className="font-bold">African and South American street bike communities</span>
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold">Benefit:</span> Encourages cultural exchange and inclusion through a shared love of riding and movement.
                  </p>
                </div>

                {/* Section 8 */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    8. Media & Entertainment Growth
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    Due to its visual flair and intensity, MPL is <span className="font-bold">tailor-made for streaming, reality TV, or eSports hybridization</span>:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">Cinematic stunt footage</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Interactive viewer scoring or fan-voted "Peg MVP"
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Narrative-based league content (drama, rivalries, story arcs)
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold">Benefit:</span> Creates jobs in entertainment, draws global attention, and reshapes how motorsports are consumed.
                  </p>
                </div>

                {/* Section 9 */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    9. Reinvention of Traditional Motorsports
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    By incorporating <span className="font-bold">tactical gameplay and creativity</span>, MPL:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">Breaks the mold of speed-only racing</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Makes motorsports more accessible and audience-friendly
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Opens the door to new fanbases, including younger and more diverse crowds
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold">Benefit:</span> Modernizes and revitalizes the motorbike sports genre.
                  </p>
                </div>

                {/* Section 10 */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    10. Personal Transformation for Riders
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2">
                    At its core, the MPL offers a <span className="font-bold">path to self-transformation</span>:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">From amateur to professional</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        From street rider to respected athlete
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        From anonymous to iconic
                      </p>
                    </li>
                  </ul>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-2">
                    <span className="font-bold">Benefit:</span> MPL empowers people to <span className="font-bold">reinvent themselves through skill, passion, and purpose</span>.
                  </p>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base mt-5">
                The Motorbike Pegging League is more than a sport—it’s a movement, a culture, and a creative revolution on two wheels. Its transformative power lies in the fusion of speed, style, community, and calculated chaos, turning riders into artists, tacticians, and legends.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">Rev Up Your Potential</h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join the revolution where speed meets precision, and every rider becomes a legend on two wheels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
              <FaUsers className="mr-3" />
              Join League
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
              <FaCalendar className="mr-3" />
              View Events
            </button>
          </div>
        </div>
      </div>

      {/* Excellence Indicators */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Excellence in Every Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards
                of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Award-Winning Programs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional
                program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Transformative Impact
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts
                a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

const SchoolEquestrianComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen bg-[url('/assets/images/bg-2.webp')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              School Equestrian Program
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-light">
              Specialised Horse Riding Program for Schools
            </p>
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button className="bg-white text-gray-800 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
                <FaUsers className="mr-3" />
                Enroll School
              </button>
              <button className="border-2 border-white text-white px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
                <FaCalendar className="mr-3" />
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Program Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              The Equiwings School Equestrian Outsourcing Program brings world-class horse riding education and training
              directly to schools through a fully managed, outsourced model. We provide the infrastructure, expertise,
              and operational management so schools can offer equestrian sports without the burden of owning facilities
              or staff.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Vision & Mission
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base mb-4">
                <strong>Vision:</strong> To make equestrian sports accessible to students of all backgrounds by
                integrating them into school sports programs in a safe, professional, and inspiring way.
              </p>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                <strong>Mission:</strong> Deliver high-quality equestrian training to schools without the need for
                on-site stables or horses, instill discipline, confidence, and responsibility in students through
                hands-on riding and horse care experiences, and develop future equestrian athletes and enthusiasts
                through structured, progressive learning pathways.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 mb-12">
          {/* Key Features */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Key Features
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    1. Fully Managed Training Program
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Certified equestrian coaches and instructors.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Age-appropriate riding and horsemanship curriculum.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Safety-first protocols with trained support staff.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    2. Access to Premium Facilities
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Regular transportation to partnered equestrian centers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        All riding gear, safety equipment, and trained horses provided.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Modern arenas for dressage, jumping, and beginner riding lessons.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    3. Student Development Pathways
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Beginner, intermediate, and advanced training tiers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Progress tracking and skill certification.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Opportunities to represent school teams in inter-school equestrian competitions.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">4. Events & Competitions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Annual intra-school riding showcase.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Inter-school league participation managed by Equiwings.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Pathway to national youth equestrian championships.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    5. Administration & Logistics
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Scheduling aligned with school timetables.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        All insurance, safety compliance, and transportation handled by Equiwings.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Parent communication and student progress reports provided.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Benefits
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Benefits for Schools</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Premium sport offering without high capital investment.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Distinctive extracurricular program that enhances school reputation.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Safe, professional, and inspiring environment for students to learn.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Target Market</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Private and international schools seeking to expand their sports portfolio.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Institutions focusing on holistic development and premium extracurriculars.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">
            Transform Your School's Sports Program
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Give your students access to world-class equestrian education without the complexity of managing facilities
            or staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
              <FaUsers className="mr-3" />
              Enroll School
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
              <FaCalendar className="mr-3" />
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Excellence Indicators */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Excellence in Every Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards
                of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Award-Winning Programs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional
                program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Transformative Impact
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts
                a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AllSportsSchoolComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="py-10 relative min-h-[70vh] sm:min-h-[80vh] lg:h-screen bg-[url('/assets/images/bg-2.webp')] bg-cover bg-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-white px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 tracking-tight">
              All Sports School Program
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed font-light">
              Complete Sports Outsourcing Solutions for Schools
            </p>
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button className="bg-white text-gray-800 px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
                <FaUsers className="mr-3" />
                Partner With Us
              </button>
              <button className="border-2 border-white text-white px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
                <FaCalendar className="mr-3" />
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Program Overview */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:shadow-2xl transition-shadow duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              Program Overview
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8 text-center max-w-4xl mx-auto">
              The All Sports for Schools Outsourcing Program provides a turnkey solution for delivering high-quality
              sports education, training, and events to schools without the need for schools to manage in-house sports
              departments. We bring professional coaches, structured programs, equipment, and event management directly
              to educational institutions.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-3" />
                Vision & Mission
              </h3>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base mb-4">
                <strong>Vision:</strong> To ensure every student — regardless of school size or resources — has access
                to a broad range of sports experiences that foster fitness, teamwork, and lifelong healthy habits.
              </p>
              <p className="text-gray-700 leading-relaxed text-center italic text-sm sm:text-base">
                <strong>Mission:</strong> Provide expert-led, multi-sport programs for schools, reduce the
                administrative and cost burden on school leadership, and enhance sports culture and student
                participation across all levels.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 mb-12">
          {/* Key Features */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <MdOutlineEventAvailable className="text-cardinal-pink-800 mr-4" />
                Key Features
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">1. Multi-Sport Curriculum</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Athletics, football, cricket, basketball, swimming, tennis, badminton, and more.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Tailored programs for primary, middle, and senior school levels.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Integration with school timetables and academic schedules.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">2. Qualified Coaching Staff</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Certified, background-verified sports coaches and trainers.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Continuous professional development and skill upgrades.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Specialists in sports science, physical education, and youth development.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    3. Equipment & Facilities Management
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Provision and maintenance of sports equipment.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Assistance with facility design, upgrades, and safety compliance.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">4. Events & Competitions</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Inter-school and intra-school tournaments.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Annual sports days with full event management.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Pathways for talented students to join elite academies.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                    5. Health & Performance Tracking
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Fitness assessments and skill progress tracking.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Reports for parents and school leadership.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Integration of sports performance with overall student wellbeing.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-shadow duration-500">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
                <FaTrophy className="text-cardinal-pink-800 mr-4" />
                Benefits to Schools
              </h2>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        No need to recruit or manage in-house sports staff.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Cost-effective, scalable service packages.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Professional, safe, and engaging sports programs that enhance school reputation.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Target Market</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Private schools, public schools, international schools, and charter schools.
                      </p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2.5 h-2.5 mt-2 rounded-full bg-gradient-to-r from-cardinal-pink-900 to-cardinal-pink-700 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        Institutions without the budget, space, or staff for full in-house sports programs.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-900 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">
            Elevate Your School's Sports Program
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Partner with us to provide comprehensive sports education that develops champions both on and off the field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center shadow-lg text-sm sm:text-base md:text-lg">
              <FaUsers className="mr-3" />
              Partner With Us
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center backdrop-blur-sm text-sm sm:text-base md:text-lg">
              <FaCalendar className="mr-3" />
              Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* Excellence Indicators */}
      <div className="bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Excellence in Every Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaShield className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">Proven Excellence</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our programs are built on years of expertise and continuous refinement to ensure the highest standards
                of instruction and achievement.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <GiMedal className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Award-Winning Programs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Recognition from industry leaders and educational institutions validates our commitment to exceptional
                program design and delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cardinal-pink-50 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <FaAward className="text-cardinal-pink-800 text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-cardinal-pink-800 mb-3 sm:mb-4">
                Transformative Impact
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Our focus extends beyond skill development to character building and personal transformation that lasts
                a lifetime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SlideDetails: React.FC<SlideDetailsProps> = ({ slug }) => {
  const renderComponent = () => {
    switch (slug) {
      case "strech-your-limits":
        return <SYLComponent />
      case "equestrian-events":
        return <EquestrianPoloComponent />
      case "e-sports":
        return <ESportsComponent />
      case "bike-pegging-league":
        return <BikePeggingComponent />
      case "school-equestrian-program":
        return <SchoolEquestrianComponent />
      case "school-sports-outsourcing":
        return <AllSportsSchoolComponent />
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Page Not Found</h1>
              <p className="text-gray-600 text-sm sm:text-base">The requested page could not be found.</p>
            </div>
          </div>
        )
    }
  }

  return renderComponent()
}

export default SlideDetails
