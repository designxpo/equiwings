"use client"
import React, { useState, useEffect } from 'react';
import { Easing, motion, Variants } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTrophy, 
  FaMoneyBillWave, 
  FaHorse,
  FaClipboardList,
  FaCalendarAlt,
  FaHotel,
  FaUtensils,
  FaShieldAlt,
  FaFileMedical,
  FaIdCard,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  MdOutlineCalendarToday, 
  MdDescription, 
  MdPayment,
  MdOutlineSchedule,
  MdOutlineRule,
//   MdCamping
} from 'react-icons/md';
import { GiHorseHead } from 'react-icons/gi';
import axiosInstance from "@/lib/config/axios";
import PAST_EVENTS_DATA from '@/utils/events.json';
import RegistrationFormModal from './registration-form-modal';

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
    const [activeDay, setActiveDay] = useState<string>('09 October 2025');

    // Schedule data extracted from the prospectus
    const scheduleData = {
        '09 October 2025': [
            '07:00 AM: National Qualifier 1 (TP) Day 1 GHRC (P)',
            '11:00 AM: PRIZE DISTRIBUTION',
            '02:00 PM: Open Bareback Pole Bending Race',
            '02:30 PM: Open Pole Bending Race',
            '03:00 PM: Open Jumping Topscore (80 cm)',
            '03:30 PM: Novice Jumping Normal (60 cm)',
            '04:00 PM: Junior & Young Rider Jumping Topscore (50 cm)',
            '05:00 PM: PRIZE DISTRIBUTION'
        ],
        '10 October 2025': [
            '07:00 AM: National Qualifier 1 (TP) Day 2 GHRC (P)',
            '11:00 AM: PRIZE DISTRIBUTION',
            '02:00 PM: Open Jumping Fault & Out (80 cm)',
            '02:30 PM: Jumping Children Gp 1 (30 cm)',
            '03:00 PM: Jumping Children Gp 2 (30 cm)',
            '03:30 PM: Junior & Young Rider Jumping (50 cm)',
            '04:00 PM: Cross Jumps Children Gp 1,2,3',
            '05:00 PM: PRIZE DISTRIBUTION'
        ],
        '11 October 2025': [
            '07:00 AM: Children Hacks Gp 1',
            '07:15 AM: Children Hacks Gp 2',
            '07:30 AM: Children Pole Bending Race Gp 1',
            '08:00 AM: Children Pole Bending Race Gp 2',
            '08:30 AM: Children Ball & Bucket Race Gp 1',
            '09:00 AM: Children Ball & Bucket Race Gp 2',
            '09:30 AM: Children Stick & Ball Gp 1',
            '10:00 AM: Children Stick & Ball Gp 2',
            '10:30 AM: Children Stick & Ball Race Gp 3,4,5,6,7',
            '11:00 AM: Children Ball & Bucket Race Gp 3,4,5,6,7',
            '11:30 AM: PRIZE DISTRIBUTION',
            '12:01 PM - 02:00 PM: LUNCH BREAK',
            '02:00 PM: Children Sack Race Gp 1',
            '02:15 PM: Children Sack Race Gp 2',
            '02:30 PM: Children Lime & Spoon Race Gp 1',
            '02:45 PM: Children Lime & Spoon Race Gp 2',
            '03:00 PM: Children Pole Bending Gp 3, 4, 5, 6,7',
            '04:00 PM: Music & Mug Race Children Gp 1',
            '04:30 PM: Music & Mug Race Children Gp 2',
            '05:00 PM: PRIZE DISTRIBUTION'
        ],
        '12 October 2025': [
            '07:00 AM: Children Hacks Gp 3, 4, 5, 6,7',
            '08:00 AM: Children Lime & Spoon Race Gp 3,4,5,6,7',
            '09:00 AM: Children Sack Race Gp 3,4,5,6,7',
            '09:30 AM: Children Balloon Bursting Race Gp 1',
            '10:00 AM: Children Balloon Bursting Race Gp 2',
            '11:00 AM: Children Balloon Bursting Gp 3,4,5,6,7',
            '11:30 AM: Children Whip & Rings Race Gp 1 & 2',
            '11:50 AM: PRIZE DISTRIBUTION',
            '12:01 PM - 02:00 PM: LUNCH BREAK',
            '02:00 PM: Music & Mug Race Gp 3,4,5,6,7',
            '02:30 PM: Children Whip & Rings Race Gp 3,4,5,6,7',
            '03:00 PM: Baton Race Gp 3,4,5,6,7',
            '04:00 PM: Baton Race (Pairs) Children Gp 1&2',
            '05:00 PM: PRIZE DISTRIBUTION'
        ],
        '13 October 2025': [
            '07:00 AM: Junior & Young Rider Hacks',
            '08:00 AM: Junior, Young Rider & Senior Pole Bending Race',
            '09:00 AM: Junior, Young Rider, Senior Ball & Bucket Race',
            '09:30 AM: Junior, Young Rider Stick & Ball Race',
            '10:00 AM: Junior, Young Rider & Senior Whip & Rings Race',
            '11:00 AM: Junior, Young Rider & Senior Lime & Spoon Race',
            '11:30 AM: Junior & Young Riders Sack Race',
            '11:50 AM: PRIZE DISTRIBUTION',
            '12:01 PM - 02:00 PM: LUNCH BREAK',
            '02:00 PM: Junior & Young Rider Balloon Bursting Race',
            '02:30 PM: Junior & Young Rider Boot & Hay Race',
            '03:00 PM: Children Boot & Hay Race Gp 3,4,5,6,7',
            '04:00 PM: Children Boot & Hay Race Gp 1 & 2',
            '05:00 PM: PRIZE DISTRIBUTION'
        ],
        '14 October 2025': [
            '07:00 AM: National Qualifier (Tent Pegging) 2 (Day 1) Elite Sports Academy (P)',
            'Individual Tent Pegging Lance - 3 Runs (GHS)',
            'Individual Rings & Peg - 2 Runs (GHS)',
            '11:00 AM: PRIZE DISTRIBUTION',
            '02:00 PM: Open Hacks',
            '02:30 PM: Baton Race (Pairs) Juniors & Young Rider',
            '03:00 PM: Junior & Young Rider Trot Tent Pegging',
            '03:45 PM: Children Trot Tent Pegging Gp 1 & 2',
            '04:15 PM: Junior & Young Rider Music & Mug Race',
            '05:00 PM: PRIZE DISTRIBUTION',
            '05:30 PM: PRACTISE - INTERNATIONAL TEAMS - Junior International Trot Tent Pegging Championship & Draw of Lots'
        ],
        '15 October 2025': [
            '07:00 AM: National Qualifier 2 (TP) Day 2 (P)',
            'Individual Tent Pegging Sword - 3 Runs (GHS)',
            'Individual Lemons & Peg - 2 Runs (GHS)',
            '11:00 AM: PRIZE DISTRIBUTION',
            '12:01 PM - 02:00 PM: LUNCH BREAK',
            '02:00 PM: Day 1 - Junior International Trot Tent Pegging Championship',
            'Individual Trot Tent Pegging (4 Runs) - Lance',
            'Individual Trot Rings & Peg (2 Runs) - Lance',
            '03:30 PM: Paired Tent Pegging (2 Runs) - Lance (Paired with an Indian Rider)',
            '04:30 PM: Trot Team Tent Pegging (3 Runs) - Lance',
            '05:01 PM: PRIZE DISTRIBUTION'
        ],
        '16 October 2025': [
            '09:00 AM: Day 2 Junior International Trot Tent Pegging Championship',
            'Individual Trot Tent Pegging (4 Runs) - Sword',
            'Individual Trot Carrot Cutting Race (2 Runs) - Sword',
            'Team Trot Tent Pegging (3 Runs) - Sword',
            '11:30 AM: PRIZE DISTRIBUTION',
            '12:30 PM: LUNCH',
            '02:30 PM: Children Jumping Fault & Out (30 cm/40 cm) Gp 1 & 2',
            '03:30 PM: Junior & Young Rider Jumping Fault & Out (50/60 cm)',
            '04:00 PM: Cross Jumps - Junior & Young Rider',
            '04:30 PM: PRIZE DISTRIBUTION'
        ],
        '17 October 2025': [
            '07:00 AM: National Qualifier 3 (TP) Day 1- Equiwings',
            '11:00 AM: PRIZE DISTRIBUTION',
            '03:00 PM: EXHIBITION HORSE SHOW (All Riders - National & International)',
            'Show Jumping, Tent Pegging, Trick Riding, Gymkhana',
            '06:00 PM: PRIZE DISTRIBUTION & TROPHY DISTRIBUTION'
        ],
        '18 October 2025': [
            '07:00 AM: National Qualifier 3 (TP) Day 2',
            '11:00 AM: PRIZE DISTRIBUTION',
            '02:00 PM: Ladies Hacks',
            '02:30 PM: Trot Carrot Cutting Race Gp1,2, Junior & Young Rider',
            '03:00 PM: Trot Carrot & Peg Race Gp1,2, Junior & Young Rider',
            '03:30 PM: Trot Rings & Peg Gp1,2, Junior & Young Rider',
            '04:00 PM: Ladies Pole Bending Race',
            '04:30 PM: Ladies Ball & Bucket Race',
            '05:00 PM: PRIZE DISTRIBUTION'
        ]
    };

    // Age categories from the prospectus
    const ageCategories = [
        { category: 'Young Rider', age: '16 to 21 years' },
        { category: 'Junior Rider', age: '14 to 18 years' },
        { category: 'Children Group I', age: '12 to 14 years' },
        { category: 'Children Group II', age: '10 to 12 years' },
        { category: 'Children Group III', age: '08 to 10 years (SCN Category)' },
        { category: 'Children Group IV', age: '07 to 08 years (SCN Category)' },
        { category: 'Children Group V', age: '06 to 07 years (SCN Category)' },
        { category: 'Children Group VI', age: '05 to 06 years (SCN Category)' },
        { category: 'Children Group VII', age: '04 to 05 years (SCN Category)' }
    ];

    // Dress code information
    const dressCode = [
        { event: 'Hacks Events', attire: 'White Breeches, White Shirts, Tie, Blazer, Riding Boots, Whip, Helmet, White Gloves' },
        { event: 'Jumping Events', attire: 'Same as Hacks OR Breeches, Riding Boots, Helmet, T-Shirt' },
        { event: 'Gymkhana Events', attire: 'Helmet, Breeches, Riding Boots/Chaps, T-Shirt' },
        { event: 'SCN Category', attire: 'Helmets mandatory' }
    ];

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
                    const pastEvent = PAST_EVENTS_DATA.pastEvents.find((event: any) => {
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
                    // For this specific event, we'll use the prospectus data
                    if (cleanSlug === 'the-penta-grand-equestrian-championships') {
                        foundEvent = {
                            id: 'penta-grand-2025',
                            title: 'THE PENTA GRAND Equestrian Championships',
                            description: 'A prestigious equestrian event featuring five championships: GHS Horse Show, NCR Inter School Equestrian Sports Championship, U.P. Equestrian Championship, National Qualifiers, and Junior International Trot Tent Pegging Championship. Open to riders, schools, clubs, and academies from across India with specific regional restrictions for certain categories.',
                            image: '/images/events/penta-grand.jpg',
                            date: '09 October - 18 October 2025',
                            location: 'Gurukul Horse Riding Club (GHRC), NH-24, Ghaziabad (NCR)',
                            rules: [
                                'All entries must be on the proper Entry Form with entry fee',
                                'Horses must have valid EFI passport and registration',
                                'Valid negative EIA and Glander status certificate required',
                                'Riders must report to Collecting Ring Steward half an hour before class',
                                'Appeals must be lodged within one hour with Rs. 3000 fee',
                                'Cruelty to animals will lead to disqualification',
                                'Horses must be entered in correct grade as per latest EFI list'
                            ],
                            requirements: [
                                'EFI Rider ID or Birth Certificate for young riders',
                                'Valid negative Coggins and Glanders certificate (min 15 days validity)',
                                'Proper dress code as per event type',
                                'Insurance coverage recommended for riders and ponies'
                            ],
                            prizes: 'Medals, Certificates, and Trophies for Champion Teams',
                            registrationFee: 'Team Events: ₹2000 | Individual: ₹1000',
                            contactInfo: 'Org. Secretary: +91-9266103170 | Email: gurukul.ghrc@gmail.com',
                            isPastEvent: false
                        };
                    } else {
                        // Search in upcoming events from API for other events
                        const response = await axiosInstance.get('/customers/announcements');
                        const upcomingEvents = response.data.announcement || [];

                        const upcomingEvent = upcomingEvents.find((event: any) => {
                            const eventSlug = (event.title || '').toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
                            return eventSlug === cleanSlug;
                        });

                        if (upcomingEvent) {
                            foundEvent = {
                                id: upcomingEvent._id,
                                title: upcomingEvent.title || "Upcoming Event",
                                description: upcomingEvent.description || "No description available",
                                image: upcomingEvent.image,
                                date: upcomingEvent.date,
                                location: upcomingEvent.location || "",
                                rules: upcomingEvent.rules || [],
                                requirements: upcomingEvent.requirements || [],
                                prizes: upcomingEvent.prizes,
                                registrationFee: upcomingEvent.registrationFee,
                                contactInfo: upcomingEvent.contactInfo,
                                isPastEvent: false
                            };
                        }
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

    return (
        <div className="max-w-screen-xl mx-auto py-12 px-4 md:px-8 lg:px-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 lg:space-y-12"
            >
                {/* Event Header */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-cardinal-pink-800 mb-2">
                        THE PENTA GRAND Equestrian Championships
                    </h1>
                    <p className="text-gray-600 text-lg mb-4">09 October - 18 October 2025</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <div className="flex items-center bg-cardinal-pink-100 px-4 py-2 rounded-full">
                            <FaMapMarkerAlt className="text-cardinal-pink-800 mr-2" />
                            <span>Gurukul Horse Riding Club, Ghaziabad</span>
                        </div>
                        <div className="flex items-center bg-cardinal-pink-100 px-4 py-2 rounded-full">
                            <GiHorseHead className="text-cardinal-pink-800 mr-2" />
                            <span>Five Championships in One Event</span>
                        </div>
                    </div>
                </motion.div>

                {/* Event Overview */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <MdDescription className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Event Overview
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The Penta Grand brings together five prestigious equestrian championships in one magnificent event:
                            </p>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>GHS Horse Show</strong> - Open for all Riders/Schools/Clubs/Academies from India</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>NCR Inter School Equestrian Sports Championship</strong> - Confined to Riders/Schools/Clubs of Delhi/NCR Region</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>U.P. Equestrian Championship</strong> - Confined to Riders/Schools/Clubs of Uttar Pradesh</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>National Qualifiers (NQ)</strong> - Qualification events for national championships</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>Junior International Trot Tent Pegging Championship</strong> - International competition for junior riders</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-cardinal-pink-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Key Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <MdOutlineCalendarToday className="text-cardinal-pink-800 mt-1 mr-3" />
                                    <div>
                                        <p className="font-semibold">Dates</p>
                                        <p className="text-gray-700">09 October - 18 October 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-cardinal-pink-800 mt-1 mr-3" />
                                    <div>
                                        <p className="font-semibold">Venue</p>
                                        <p className="text-gray-700">Gurukul Horse Riding Club (GHRC), NH-24, Ghaziabad (NCR)</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaClipboardList className="text-cardinal-pink-800 mt-1 mr-3" />
                                    <div>
                                        <p className="font-semibold">Entries Close</p>
                                        <p className="text-gray-700">07 October 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Entry Information */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <MdPayment className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Entry Information & Fees
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Entry Requirements</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>All entries must be on the proper Entry Form</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Entries must be accompanied with entry fee</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Young Riders, Junior Riders, Sub Junior Riders and Children Riders must provide Birth Certificates/EFI Rider ID</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Separate entries required for each championship (GHS, NCR, UPHS)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Online entries can be submitted to: gurukul.ghrc@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Entry Fees</h3>
                            <div className="bg-cardinal-pink-50 p-4 rounded-lg mb-4">
                                <h4 className="font-bold text-cardinal-pink-800 mb-2">Regular Entries (Until 07 Oct 2025)</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span>Team Events:</span>
                                        <span>₹2000/- per team</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Individual Events:</span>
                                        <span>₹1000/- per exhibit</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-bold text-cardinal-pink-800 mb-2">Post Entries (After 07 Oct 2025)</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span>Team Events:</span>
                                        <span>₹4000/- per team</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Individual Events:</span>
                                        <span>₹2000/- per exhibit</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-bold text-cardinal-pink-800 mb-2">Payment Information</h4>
                        <p className="text-gray-700 mb-2">Payments to be made to:</p>
                        <p className="font-semibold">Ghaziabad Equestrian Association (GEA)</p>
                        <p className="text-gray-700">YES BANK, JASOLA BRANCH</p>
                        <p className="text-gray-700">A/C No: 035061900005030</p>
                        <p className="text-gray-700">IFSC: YESB0000350</p>
                        <p className="text-gray-700 mt-2">For online payments, sharing of payment screenshot is mandatory to gurukul.ghrc@gmail.com</p>
                    </div>
                </motion.div>

                {/* Schedule Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <MdOutlineSchedule className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Event Schedule
                        </h2>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">Select a day to view detailed schedule:</p>
                        <div className="flex overflow-x-auto pb-2 gap-2">
                            {Object.keys(scheduleData).map(day => (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap ${activeDay === day ? 'bg-cardinal-pink-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">{activeDay}</h3>
                        <ul className="space-y-2">
                            {scheduleData[activeDay as keyof typeof scheduleData].map((event, index) => (
                                <li key={index} className="flex items-start py-2 border-b border-gray-200 last:border-b-0">
                                    <span className="text-cardinal-pink-600 font-bold mr-3 mt-1">•</span>
                                    <span className="text-gray-700">{event}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                        <p className="text-gray-700"><strong>Note:</strong> All events can have separate entries for riders. Events will be conducted for Ghaziabad Horse Show (Open Competition), NCR Inter School Equestrian Sports Championship (NCRISESC). To participate at U.P. Horse Show, the rider must be a native of Uttar Pradesh.</p>
                    </div>
                </motion.div>

                {/* Rules and Regulations */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <MdOutlineRule className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Rules & Regulations
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">General Rules</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <FaExclamationTriangle className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>All horses must have valid EFI passport and registration number</span>
                                </li>
                                <li className="flex items-start">
                                    <FaExclamationTriangle className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Horses must report to Collecting Ring Steward half an hour before class</span>
                                </li>
                                <li className="flex items-start">
                                    <FaExclamationTriangle className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Appeals must be lodged within one hour with ₹3000 fee (refunded if upheld)</span>
                                </li>
                                <li className="flex items-start">
                                    <FaExclamationTriangle className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Judges can disqualify for cruelty, rough handling, or rapping</span>
                                </li>
                                <li className="flex items-start">
                                    <FaExclamationTriangle className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Whips/Spurs as per EFI and FEI rules</span>
                                </li>
                                <li className="flex items-start">
                                    <FaExclamationTriangle className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Riders responsible for correct horse grading</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Health & Safety</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <FaFileMedical className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Valid negative EIA and Glander status certificate required on arrival</span>
                                </li>
                                <li className="flex items-start">
                                    <FaFileMedical className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Coggins and Glanders negative certificate with minimum 15 days validity</span>
                                </li>
                                <li className="flex items-start">
                                    <FaShieldAlt className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Insurance recommended for riders and ponies</span>
                                </li>
                                <li className="flex items-start">
                                    <FaIdCard className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Clearance certificate required from Camp Commandant before departure</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Camping Information */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        {/* <MdCamping className="text-cardinal-pink-800 text-4xl mr-3" /> */}
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Camping & Accommodation
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Stabling & Camping</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Stable charges: ₹500/- per horse</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Camping charges: ₹500/- per tent</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Electricity charges: ₹1000/- per connection</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Water charges: ₹500/- per connection</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Security deposit: ₹5000/- (refundable after clearance)</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Food & Refreshments</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <FaUtensils className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Food court available at venue</span>
                                </li>
                                <li className="flex items-start">
                                    <FaUtensils className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Breakfast, lunch, dinner available on payment</span>
                                </li>
                                <li className="flex items-start">
                                    <FaHotel className="text-cardinal-pink-600 mt-1 mr-3 flex-shrink-0" />
                                    <span>Nearby hotels available for accommodation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Age Categories */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <FaUsers className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Age Categories
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-cardinal-pink-100">
                                    <th className="px-4 py-3 text-left text-cardinal-pink-800 font-bold">Category</th>
                                    <th className="px-4 py-3 text-left text-cardinal-pink-800 font-bold">Age Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ageCategories.map((category, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-4 py-3 border-b border-gray-200">{category.category}</td>
                                        <td className="px-4 py-3 border-b border-gray-200">{category.age}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Dress Code */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <FaIdCard className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Dress Code
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-cardinal-pink-100">
                                    <th className="px-4 py-3 text-left text-cardinal-pink-800 font-bold">Event Type</th>
                                    <th className="px-4 py-3 text-left text-cardinal-pink-800 font-bold">Required Attire</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dressCode.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-4 py-3 border-b border-gray-200 font-medium">{item.event}</td>
                                        <td className="px-4 py-3 border-b border-gray-200">{item.attire}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl duration-300 p-6 md:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-center mb-6">
                        <FaUsers className="text-cardinal-pink-800 text-4xl mr-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-cardinal-pink-800">
                            Contact Information
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Organizing Committee</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>Org. Secretary:</strong> +91-9266103170</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>Email:</strong> gurukul.ghrc@gmail.com</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span><strong>Address:</strong> Gurukul Horse Riding Club (GHRC), NH-24, Ghaziabad (NCR)</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cardinal-pink-800 mb-4">Technical Queries</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>For technical queries, contact the organizing secretary</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>All official communications via email only</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-cardinal-pink-600 font-bold mr-2">•</span>
                                    <span>Entry forms and prospectus available on request</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {/* <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="px-8 py-3 bg-white text-cardinal-pink-800 border-2 border-cardinal-pink-800 rounded-full font-semibold text-lg hover:bg-purple-50 transition-colors duration-200"
                    >
                        Download Prospectus
                    </motion.button> */}
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