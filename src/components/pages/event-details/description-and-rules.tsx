"use client"
import React from 'react';
import { Easing, motion, Variants } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineCalendarToday } from 'react-icons/md';

const DescriptionAndRules = () => {
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

    const rules = [
        "Lorem Ipsum is Simply Dummy",
        "Lorem Ipsum is Simply Dummy",
        "Lorem Ipsum is Simply Dummy",
        "Lorem Ipsum is Simply Dummy",
        "Lorem Ipsum is Simply Dummy",
        "Lorem Ipsum is Simply Dummy"
    ];

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
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl md:text-4xl font-bold text-cardinal-pink-800 text-center mb-6"
                    >
                        Description
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-700 text-center leading-relaxed max-w-4xl mx-auto"
                    >
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type
                        specimen book. It has survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                    </motion.p>
                </motion.div>

                {/* Date and Location Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto max-w-4xl"
                >
                    {/* Date Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl duration-300 hover:shadow-2xl shadow-lg flex items-center justify-center p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-center">
                            <MdOutlineCalendarToday className="text-cardinal-pink-800 text-4xl mr-4" />
                            <div>
                                <p className="text-gray-800 font-semibold">Sun, September 21, 2025</p>
                                <p className="text-gray-600">8:00 AM EDT</p>
                                <p className="text-gray-600">Add to calendar</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl duration-300 hover:shadow-2xl flex items-center justify-center shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-center">
                            <FaMapMarkerAlt className="text-cardinal-pink-800 text-4xl mr-4" />
                            <div>
                                <p className="text-gray-800 font-semibold">Boston, MA, USA</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Rules Section */}
                <motion.div
                    variants={itemVariants}
                    className="p-8"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-4xl font-bold text-cardinal-pink-800 text-center mb-8"
                    >
                        Rules
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto md:gap-12"
                    >
                        {rules.map((rule, index) => (
                            <motion.div
                                key={index}
                                className="text-gray-700 text-center py-2 border border-gray-200 shadow-lg hover:shadow-2xl duration-300 rounded-xl p-4 md:p-8"
                            >
                                {rule}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Buttons */}
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
                        Sponsor event
                    </motion.button>
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="px-8 py-3 bg-cardinal-pink-800 text-white rounded-full font-semibold text-lg hover:bg-cardinal-pink-800 transition-colors duration-200"
                    >
                        Register Now
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DescriptionAndRules;