"use client"
import React, { useState, useEffect } from 'react';
import { Easing, motion, Variants } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaTrophy } from 'react-icons/fa';
import { MdOutlineCalendarToday, MdDescription } from 'react-icons/md';
import EVENTS_DATA from '@/utils/events.json';
import RegistrationFormModal from './registration-form-modal';
import ThePentaGrand2025DescriptionAndRules from './penta-grand-2025-description-and-rules';

interface EventData {
    id: string;
    title: string;
    description: string;
    image?: string;
    date?: string;
    location?: string;
    rules?: string[];
    requirements?: string[];
    prizes?: string;
    registrationFee?: string;
    contactInfo?: string;
    isPastEvent: boolean;
    eventImages?: string[];
}

interface DescriptionAndRulesProps {
    slug: string;
}

interface Section {
    type: '2-col' | '3-col';
    images: string[];
}

const DescriptionAndRules: React.FC<DescriptionAndRulesProps> = ({ slug }) => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);

                // Determine if this is a past event based on slug
                const isPastEvent = slug.includes('past-');
                const cleanSlug = slug.replace(/^(upcoming-|past-)/, '');

                let foundEvent: EventData | null = null;

                if (isPastEvent) {
                    // Search in past events data
                    const pastEvent = EVENTS_DATA.pastEvents.find((event: any) => {
                        const eventSlug = event.title.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
                        return eventSlug === cleanSlug;
                    });

                    if (pastEvent) {
                        foundEvent = {
                            id: pastEvent.id,
                            title: pastEvent.title,
                            description: pastEvent.description,
                            image: pastEvent.image,
                            date: pastEvent.date,
                            location: pastEvent.location || "",
                            isPastEvent: true,
                            eventImages: pastEvent.eventImages || []
                        };
                    }
                } else {
                    const upcomingEvent = EVENTS_DATA.upcomingEvents.find((event: any) => {
                        const eventSlug = event.title.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
                        return eventSlug === cleanSlug;
                    });

                    if (upcomingEvent) {
                        foundEvent = {
                            id: upcomingEvent.id,
                            title: upcomingEvent.title || "Upcoming Event",
                            description: upcomingEvent.description || "No description available",
                            image: upcomingEvent.image,
                            date: upcomingEvent.date,
                            location: upcomingEvent.location || "",
                            isPastEvent: false
                        };
                    }
                }

                setEventData(foundEvent);
                setError(foundEvent ? null : "Event not found");
            } catch (err) {
                console.error('Error fetching event data:', err);
                setError("Failed to load event data");
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [slug]);

    // Function to create sections from event images
    const createSections = (images: string[]): Section[] => {
        const sections: Section[] = [];
        let currentIndex = 0;

        while (currentIndex < images.length) {
            const remainingImages = images.length - currentIndex;

            if (remainingImages >= 5) {
                // Create a 2-col section with 2 images
                sections.push({
                    type: '2-col',
                    images: images.slice(currentIndex, currentIndex + 2)
                });
                currentIndex += 2;
            } else if (remainingImages >= 3) {
                // Create a 3-col section with 3 images
                sections.push({
                    type: '3-col',
                    images: images.slice(currentIndex, currentIndex + 3)
                });
                currentIndex += 3;
            } else {
                // Create a section with remaining images
                sections.push({
                    type: remainingImages === 2 ? '2-col' : '3-col',
                    images: images.slice(currentIndex)
                });
                break;
            }
        }

        return sections;
    };

    const renderSection = (section: Section, sectionIndex: number) => {
        if (section.type === '2-col') {
            // 2-column layout (alternating 4-8 and 8-4 grid)
            const isEven = sectionIndex % 2 === 0;
            return (
                <div key={sectionIndex} className={`grid grid-cols-12 gap-6 ${isEven ? '' : 'flex-row-reverse'}`}>
                    <div className={`${isEven ? 'col-span-4' : 'col-span-8'} h-64 md:h-80`}>
                        <img
                            src={section.images[0]}
                            alt={`Event image ${sectionIndex * 2 + 1}`}
                            className="w-full h-full object-cover rounded-xl shadow-lg"
                        />
                    </div>
                    {section.images[1] && (
                        <div className={`${isEven ? 'col-span-8' : 'col-span-4'} h-64 md:h-80`}>
                            <img
                                src={section.images[1]}
                                alt={`Event image ${sectionIndex * 2 + 2}`}
                                className="w-full h-full object-cover rounded-xl shadow-lg"
                            />
                        </div>
                    )}
                </div>
            );
        } else {
            // 3-column layout
            return (
                <div key={sectionIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {section.images.map((img: string, i: number) => (
                        <div key={i} className="h-64 md:h-80">
                            <img
                                src={img}
                                alt={`Event image ${sectionIndex * 3 + i + 1}`}
                                className="w-full h-full object-cover rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            />
                        </div>
                    ))}
                </div>
            );
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const buttonVariants: Variants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1] as unknown as Easing[]
            }
        },
        tap: {
            scale: 0.95
        }
    };

    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto py-12 px-4 md:px-8 lg:px-10">
                <div className="space-y-8">
                    {/* Loading skeleton */}
                    <div className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                        <div className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !eventData) {
        return (
            <div className="max-w-screen-xl mx-auto py-12 px-4 md:px-8 lg:px-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Event Details Not Found</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }
    console.log()

    if (eventData.id === 'the-penta-grand-2025') {
        return (
            <ThePentaGrand2025DescriptionAndRules slug={eventData.id} />
        )
    }

    return (
        <div className="max-w-screen-xl mx-auto py-12 px-4 md:px-8 lg:px-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 lg:space-y-12"
            >
                {/* Description Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 px-2 py-4 md:px-8 md:py-10 border border-gray-100"
                >
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-center mb-6"
                    >
                        <MdDescription className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h1 className="text-3xl md:text-4xl font-bold text-cardinal-pink-800">
                            Description
                        </h1>
                    </motion.div>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-700 text-center leading-relaxed max-w-4xl mx-auto text-lg"
                    >
                        {eventData.description}
                    </motion.p>
                </motion.div>

                {/* Event Details Grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto max-w-4xl"
                >
                    {/* Date Card */}
                    {eventData.date && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl duration-300 hover:shadow-2xl shadow-lg flex items-center justify-center p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-center text-center">
                                <MdOutlineCalendarToday className="text-cardinal-pink-800 text-4xl mr-4 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-800 font-semibold text-lg">{eventData.date}</p>
                                    <p className="text-gray-600 text-sm mt-1">Event Date</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Location Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl duration-300 hover:shadow-2xl flex items-center justify-center shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-center text-center">
                            <FaMapMarkerAlt className="text-cardinal-pink-800 text-4xl mr-4 flex-shrink-0" />
                            <div>
                                <p className="text-gray-800 font-semibold text-lg">{eventData.location || "Gurukul"}</p>
                                <p className="text-gray-600 text-sm mt-1">Venue</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Registration Fee Card (if available) */}
                    {eventData.registrationFee && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl duration-300 hover:shadow-2xl shadow-lg flex items-center justify-center p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-center text-center">
                                <FaUsers className="text-cardinal-pink-800 text-4xl mr-4 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-800 font-semibold text-lg">{eventData.registrationFee}</p>
                                    <p className="text-gray-600 text-sm mt-1">Registration Fee</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Prizes Card (if available) */}
                    {eventData.prizes && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl duration-300 hover:shadow-2xl shadow-lg flex items-center justify-center p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-center text-center">
                                <FaTrophy className="text-cardinal-pink-800 text-4xl mr-4 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-800 font-semibold text-lg">{eventData.prizes}</p>
                                    <p className="text-gray-600 text-sm mt-1">Prize Pool</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Rules and Requirements Section */}
                {(eventData.rules && eventData.rules.length > 0) || (eventData.requirements && eventData.requirements.length > 0) ? (
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Rules */}
                        {eventData.rules && eventData.rules.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-cardinal-pink-800 mb-6 text-center">
                                    Rules & Regulations
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    {eventData.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-cardinal-pink-600 font-bold mr-3 mt-1">{index + 1}.</span>
                                            <span className="leading-relaxed">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Requirements */}
                        {eventData.requirements && eventData.requirements.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-cardinal-pink-800 mb-6 text-center">
                                    Requirements
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    {eventData.requirements.map((requirement, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-cardinal-pink-600 text-xl mr-3 mt-1">•</span>
                                            <span className="leading-relaxed">{requirement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                ) : null}

                {/* Contact Info (if available) */}
                {eventData.contactInfo && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100 text-center"
                    >
                        <h3 className="text-2xl font-bold text-cardinal-pink-800 mb-4">
                            Contact Information
                        </h3>
                        <p className="text-gray-700 text-lg">{eventData.contactInfo}</p>
                    </motion.div>
                )}

                {/* Action Buttons - Only show for upcoming events */}
                {false && (
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="px-8 py-3 bg-white text-cardinal-pink-800 border-2 border-cardinal-pink-800 rounded-full font-semibold text-lg hover:bg-purple-50 transition-colors duration-200"
                        >
                            Sponsor Event
                        </motion.button>
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setShowRegistrationForm(true)}
                            className="px-8 py-3 bg-cardinal-pink-800 text-white rounded-full font-semibold text-lg hover:bg-cardinal-pink-900 transition-colors duration-200"
                        >
                            Register Now
                        </motion.button>
                    </motion.div>
                )}

                {/* Past Event Message */}
                {eventData.isPastEvent && (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-8"
                    >
                        <div className="bg-gray-100 rounded-xl p-6 inline-block">
                            <p className="text-gray-600 text-lg font-medium">
                                This event has concluded. Thank you to all participants!
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Event Images Section - Only show for past events with images */}
                {eventData.isPastEvent && eventData.eventImages && eventData.eventImages.length > 0 && (
                    <motion.div
                        variants={itemVariants}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-cardinal-pink-800 mb-4">
                                Event Gallery
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Highlights and memorable moments from the event
                            </p>
                        </div>

                        <div className="space-y-8">
                            {createSections(eventData.eventImages).map((section, sectionIndex) =>
                                renderSection(section, sectionIndex)
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Registration Form Modal */}
            <RegistrationFormModal
                isOpen={showRegistrationForm}
                onClose={() => setShowRegistrationForm(false)}
                eventTitle={eventData?.title || 'Event Registration'}
            />
        </div>
    );
};

export default DescriptionAndRules;