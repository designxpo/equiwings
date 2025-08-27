import React from 'react';
import { LuChevronRight, LuAward, LuUsers, LuTarget, LuBookOpen } from 'react-icons/lu';

const SportsTrainingUI = () => {

  const schoolEquestrianProgramData = [
    { title: "Kids & Teens: Learn basic horsemanship, build confidence, earn merit badges & certifications." },
    { title: "Adults & Enthusiasts: Beginner to advanced riding sessions, fitness training, and leisure trail rides." },
    { title: "Competition Coaching: Personalized prep for show-jumping, dressage, endurance & more." },
  ];

  const schoolAndAcademyPartnershipsData = [
    { title: "Curriculum-integrated equestrian modules" },
    { title: "In-school riding days & discovery workshops" },
    { title: "Certification programs accredited by national equestrian bodies" },
  ];

  const corporateAndWellnessProgramsData = [
    { title: "Team-building sessions" },
    { title: "Executive coaching through riding & horsemanship" },
    { title: "Well-being days for employees & members" },
  ];

  const eventsAndCompetitionManagementData = [
    { title: "Planning & managing inter-school, regional & national competitions" },
    { title: "Logistic and sponsorship support" },
    { title: "Rider registration, adjudication & prize distribution" },
  ];

  const horseLeasingAndRentalSupportData = [
    { title: "Lease-and-train services for schools or private academies" },
    { title: "Horse transport, boarding & professional care included" },
  ];

  const getIcon = (title: string) => {
    switch (title) {
      case "Sports Training":
        return <LuTarget className="w-6 h-6" />;
      case "Sports Certifications":
        return <LuAward className="w-6 h-6" />;
      case "Sports Consultancy":
        return <LuBookOpen className="w-6 h-6" />;
      case "Social Sports":
        return <LuUsers className="w-6 h-6" />;
      default:
        return <LuTarget className="w-6 h-6" />;
    }
  };

  const ServiceCard = ({ title, data, image, isImageRight = false }:{ title: string, data: { title: string }[], image: string, isImageRight?: boolean}) => (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
      <div className="xl:flex xl:h-[500px]">
        {/* Image Section */}
        <div className={`xl:w-1/2 relative ${isImageRight ? 'xl:order-2' : 'xl:order-1'}`}>
          <div className="relative h-64 xl:h-full overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent xl:bg-gradient-to-r xl:from-black/20 xl:via-transparent xl:to-transparent"></div>
            <div className="absolute bottom-4 left-4 xl:hidden">
              {/* <div className="flex items-center space-x-2 text-white">
                {getIcon(title)}
                <span className="text-sm font-medium">{title}</span>
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className={`xl:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between ${isImageRight ? 'xl:order-1' : 'xl:order-2'}`}>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-6 xl:mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-cardinal-pink-800 rounded-xl text-white shadow-lg">
                {getIcon(title)}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {title}
              </h2>
            </div>
            
            <div className="space-y-2 sm:space-y-2 flex-1">
              {data.map((item, index) => (
                <div key={index} className="group/item flex items-start space-x-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <div className="flex-shrink-0 mt-1">
                    <LuChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-cardinal-pink-800 group-hover/item:text-cardinal-pink-950 group-hover/item:translate-x-1 transition-all duration-300" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed font-medium group-hover/item:text-gray-900 transition-colors duration-300">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* <div className="mt-8 pt-6 border-t border-gray-100">
            <button className="group/btn inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="font-semibold">Learn More</span>
              <LuChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Sports Excellence Programs
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training, certification, and consultancy services for sports professionals and enthusiasts
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="space-y-12 lg:space-y-20">
          {/* Sports Training Section */}
          <ServiceCard
            title="School Equestrian Program"
            data={schoolEquestrianProgramData}
            image="/assets/images/services/school.jpg"
            isImageRight={false}
          />

          {/* School & Academy Partnerships Section */}
          <ServiceCard
            title="School & Academy Partnerships"
            data={schoolAndAcademyPartnershipsData}
            image="/assets/images/services/horse_teaching.jpg"
            isImageRight={true}
          />

          {/* Corporate & Wellness Programs Section */}
          <ServiceCard
            title="Corporate & Wellness Programs"
            data={corporateAndWellnessProgramsData}
            image="/assets/images/services/corporate.jpg"
            isImageRight={false}
          />

          {/* Events & Competition Management Section */}
          <ServiceCard
            title="Events & Competition Management"
            data={eventsAndCompetitionManagementData}
            image="/assets/images/services/event_mgmt.jpg"
            isImageRight={true}
          />

          {/* Horse Leasing & Rental Support Section */}
          <ServiceCard
            title="Horse Leasing & Rental Support"
            data={horseLeasingAndRentalSupportData}
            image="/assets/images/services/horse_rent.jpg"
            isImageRight={false}
          />
        </div>
      </div>

      {/* Footer Section */}
      {/* <div className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Excel in Sports?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join our comprehensive sports programs and take your athletic journey to the next level
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold">
              Get Started Today
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SportsTrainingUI;