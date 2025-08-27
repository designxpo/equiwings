import React from 'react';
import { motion } from 'framer-motion';

// ========== TYPES ==========
interface ProgramCard {
    id: number;
    date: string;
    title: string;
    description: string;
    image?: string;
    category?: string;
}

interface ProgramSlideCardProps {
    program: ProgramCard;
    onCardClick?: (program: ProgramCard) => void;
    variants?: {
        card: {
            initial: any;
            hover: any;
        };
    };
}

// ========== ANIMATION VARIANTS ==========
const DEFAULT_VARIANTS = {
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
    }
};

// ========== PROGRAM SLIDE CARD COMPONENT ==========
const Slider: React.FC<ProgramSlideCardProps> = ({
    program,
    onCardClick,
    variants = DEFAULT_VARIANTS
}) => {
    const handleClick = () => {
        if (onCardClick) {
            onCardClick(program);
        }
    };

    return (
        <motion.div
            variants={variants.card}
            initial="initial"
            whileHover="hover"
            onClick={handleClick}
            className="bg-gray-200 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 mx-2"
        >
            {/* Mobile optimized height and padding */}
            <div className="p-4 sm:p-6 md:p-8 h-64 sm:h-72 md:h-80 flex flex-col justify-end relative">
                <div className="relative z-10 flex items-end justify-end mt-4 sm:mt-6">
                    <div className="flex flex-col items-start gap-1 sm:gap-2 w-full">
                        {/* Date Section */}
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide">
                                {program.date}
                            </span>
                        </div>

                        {/* Title - Responsive font sizes */}
                        <motion.h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-cardinal-pink-800 leading-tight line-clamp-2">
                            {program.title}
                        </motion.h3>

                        {/* Description - Responsive text size */}
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-3">
                            {program.description}
                        </p>

                        {/* Category Badge - Optional, shows on larger screens */}
                        {program.category && (
                            <div className="hidden sm:flex mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cardinal-pink-100 text-cardinal-pink-800">
                                    {program.category}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Slider;