"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from "@/lib/config/axios";
import EVENTS_DATA from '@/utils/events.json';

interface EventData {
    id: string;
    title: string;
    description: string;
    image?: string;
    bannerImage?: string;
    date?: string;
    location?: string;
    isPastEvent: boolean;
}

interface HeroProps {
    slug: string;
}

const Hero: React.FC<HeroProps> = ({ slug }) => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                            bannerImage: pastEvent.bannerImage,
                            image: pastEvent.image,
                            date: pastEvent.date,
                            location: pastEvent.location || "TBA",
                            isPastEvent: true
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
                            bannerImage: upcomingEvent.bannerImage,
                            date: upcomingEvent.date,
                            location: upcomingEvent.location || "TBA",
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

    if (loading) {
        return (
            <section className="relative h-screen flex items-center justify-center bg-gray-200">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cardinal-pink-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </section>
        );
    }

    if (error || !eventData) {
        return (
            <section className="relative h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
                    <p className="text-xl">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${eventData.bannerImage || eventData.image})` }}
        >
            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}

            {/* Content */}
            {/* <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative container mx-auto p-4 text-center z-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="mb-2"
                >
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${eventData.isPastEvent
                            ? 'bg-gray-600 text-white'
                            : 'bg-cardinal-pink-500 text-white'
                        }`}>
                        {eventData.isPastEvent ? 'Past Event' : 'Upcoming Event'}
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-white capitalize mb-4"
                >
                    {eventData.title}
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl mx-auto leading-relaxed"
                >
                    {eventData.description}
                </motion.p>

                {eventData.date && (
                    <motion.p
                        variants={itemVariants}
                        className="text-md md:text-lg text-cardinal-pink-400 mt-8 uppercase font-semibold tracking-wide"
                    >
                        Event Date: {eventData.date}
                    </motion.p>
                )}

                {eventData.location && (
                    <motion.p
                        variants={itemVariants}
                        className="text-md md:text-lg text-gray-300 mt-2 uppercase tracking-wide"
                    >
                        Location: {eventData.location}
                    </motion.p>
                )}
            </motion.div> */}

            {/* Scroll indicator */}
            {/* <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
                >
                    <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                </motion.div>
            </motion.div> */}
        </section>
    );
};

export default Hero;