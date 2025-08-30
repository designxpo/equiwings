"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuPlus, LuMinus, LuUser, LuCalendar, LuTrophy, LuMapPin, LuAlarmClock } from 'react-icons/lu';

// Age Categories as per EFI/FEI Rules
const AGE_CATEGORIES = [
    { id: 'young_rider', name: 'Young Rider', minAge: 16, maxAge: 21 },
    { id: 'junior_rider', name: 'Junior Rider', minAge: 14, maxAge: 18 },
    { id: 'children_gp1', name: 'Children Group I', minAge: 12, maxAge: 14 },
    { id: 'children_gp2', name: 'Children Group II', minAge: 10, maxAge: 12 },
    { id: 'children_gp3', name: 'Children Group III', minAge: 8, maxAge: 10 },
    { id: 'children_gp4', name: 'Children Group IV', minAge: 7, maxAge: 8 },
    { id: 'children_gp5', name: 'Children Group V', minAge: 6, maxAge: 7 },
    { id: 'children_gp6', name: 'Children Group VI', minAge: 5, maxAge: 6 },
    { id: 'children_gp7', name: 'Children Group VII', minAge: 4, maxAge: 5 },
    { id: 'senior', name: 'Senior Rider', minAge: 18, maxAge: 100 },
    { id: 'ladies', name: 'Ladies', minAge: 0, maxAge: 100 }, // Open for Ladies of All Age Groups
    { id: 'all', name: 'Open', minAge: 0, maxAge: 100 } // Open for all Age Categories
];

// Event Categories with proper age-specific events
const EVENT_CATEGORIES = {
    gymkhana: {
        name: 'GYMKHANA EVENTS',
        events: {
            // Open events (available for all age categories)
            all: [
                'Open Hacks',
                'Stick & Ball Race Open (Mounted)',
                'Pole Bending Race Open',
                'Ball & Bucket Race Open',
                'Lime & Spoon Race Open',
                'Sack Race Open',
                'Music & Mug Race Open',
                'Music & Mug Race Bareback Open',
                'Balloon Bursting Race Open',
                'Balloon Bursting Race Bareback Open',
                'Whip & Ring Race Open',
                'Baton Race Open',
                'Baton Race Bareback Open',
                'Pole Bending Race Bareback',
                'Trot Carrot Cutting Race Open',
                'Trot Carrot & Peg Race Open',
                'Trot Rings & Peg Open',
                'Trot Tent Pegging Lance Open',
                'Trot Paired Tent Pegging Lance Open',
                'Trot Paired Tent Pegging Sword Open',
                'Trot Tent Pegging Individual Sword Open'
            ],
            // Ladies events (open for ladies of all age groups)
            ladies: [
                'Ladies Hacks',
                'Stick & Ball Race Ladies',
                'Pole Bending Race Ladies',
                'Ball & Bucket Race Ladies',
                'Lime & Spoon Race Ladies',
                'Sack Race Ladies',
                'Boot & Hay Race Ladies',
                'Music & Mug Race Ladies',
                'Balloon Bursting Race Ladies',
                'Whip & Ring Race Ladies',
                'Baton Race Ladies',
                'Trot Carrot Cutting Race Ladies',
                'Trot Carrot & Peg Race Ladies',
                'Trot Rings & Peg Ladies',
                'Trot Tent Pegging Lance Ladies',
                'Trot Paired Tent Pegging Lance Ladies',
                'Trot Paired Tent Pegging Sword Ladies',
                'Trot Tent Pegging Individual Sword Ladies'
            ],
            // Senior Rider events (Above 18 Years)
            senior: [
                'Hacks Senior Rider',
                'Stick & Ball Race Senior Rider',
                'Pole Bending Race Senior',
                'Ball & Bucket Race Senior'
            ],
            // Young Rider events (16-21 years)
            young_rider: [
                'Hacks Young Rider',
                'Stick & Ball Race Young Rider',
                'Pole Bending Race Young Rider',
                'Ball & Bucket Race Young Rider',
                'Lime & Spoon Race Young Rider',
                'Sack Race Young Rider',
                'Boot & Hay Race Young Rider',
                'Music & Mug Race Young Rider',
                'Balloon Bursting Race Young Rider',
                'Whip & Ring Race Young Rider',
                'Baton Race Young Rider',
                'Trot Carrot Cutting Race Young Rider',
                'Trot Carrot & Peg Race Young Rider',
                'Trot Rings & Peg Young Rider',
                'Trot Tent Pegging Lance Young Rider',
                'Trot Paired Tent Pegging Lance Young Rider',
                'Trot Paired Tent Pegging Sword Young Rider',
                'Trot Tent Pegging Individual Sword Young Rider'
            ],
            // Junior Rider events (14-18 years)
            junior_rider: [
                'Hacks Junior Rider',
                'Stick & Ball Race Junior Rider',
                'Pole Bending Race Junior Rider',
                'Ball & Bucket Race Junior Rider',
                'Lime & Spoon Race Junior Rider',
                'Sack Race Junior Rider',
                'Boot & Hay Race Junior Rider',
                'Music & Mug Race Junior Rider',
                'Balloon Bursting Race Junior Rider',
                'Whip & Ring Race Junior Rider',
                'Baton Race Junior Rider',
                'Trot Carrot Cutting Race Junior Rider',
                'Trot Carrot & Peg Race Junior Rider',
                'Trot Rings & Peg Junior Rider',
                'Trot Tent Pegging Lance Junior Rider',
                'Trot Paired Tent Pegging Lance Junior Rider',
                'Trot Paired Tent Pegging Sword Junior Rider',
                'Trot Tent Pegging Individual Sword Junior Rider'
            ],
            // Children Group 1 events (12-14 years)
            children_gp1: [
                'Hacks Children Gp 1',
                'Stick & Ball Race Children Gp 1',
                'Pole Bending Race Children Gp 1',
                'Ball & Bucket Race Children Gp 1',
                'Lime & Spoon Race Children Gp 1',
                'Sack Race Children Gp 1',
                'Boot & Hay Race Children Gp 1',
                'Music & Mug Race Children Gp 1',
                'Balloon Bursting Race Children Gp 1',
                'Whip & Ring Race Children Gp 1',
                'Baton Race Children Gp 1',
                'Trot Carrot Cutting Race Children Gp 1',
                'Trot Carrot & Peg Race Children Group 1',
                'Trot Rings & Peg Children Gp 1',
                'Trot Tent Pegging Individual Lance Gp 1',
                'Trot Paired Tent Pegging Lance Children Gp 1',
                'Trot Paired Tent Pegging Sword Children Gp 1',
                'Trot Tent Pegging Individual Sword Gp 1'
            ],
            // Children Group 2 events (10-12 years)
            children_gp2: [
                'Hacks Children Gp 2',
                'Stick & Ball Race Children Gp 2',
                'Pole Bending Race Children Gp 2',
                'Ball & Bucket Race Children Gp 2',
                'Lime & Spoon Race Children Gp 2',
                'Sack Race Children Gp 2',
                'Boot & Hay Race Children Gp 2',
                'Music & Mug Race Children Gp 2',
                'Balloon Bursting Race Children Gp 2',
                'Whip & Ring Race Children Gp 2',
                'Baton Race Children Gp 2',
                'Trot Carrot Cutting Race Children Gp 2',
                'Trot Carrot & Peg Race Children Group 2',
                'Trot Rings & Peg Children Gp 2',
                'Trot Tent Pegging Lance Individual Gp 2',
                'Trot Paired Tent Pegging Lance Children Gp 2',
                'Trot Paired Tent Pegging Sword Children Gp 2',
                'Trot Tent Pegging Individual Sword Gp 2'
            ],
            // Children Group 3 events (8-10 years) - Limited events as per PDF
            children_gp3: [
                'Hacks Children Gp 3',
                'Stick & Ball Race Children Gp 3',
                'Pole Bending Race Children Gp 3',
                'Ball & Bucket Race Children Gp 3',
                'Lime & Spoon Race Children Gp 3',
                'Sack Race Children Gp 3',
                'Boot & Hay Race Children Gp 3',
                'Music & Mug Race Children Gp 3',
                'Balloon Bursting Race Children Gp 3',
                'Whip & Ring Race Children Gp 3',
                'Baton Race Children Gp 3'
            ],
            // Children Group 4 events (7-8 years) - Limited events as per PDF
            children_gp4: [
                'Hacks Children Gp 4',
                'Stick & Ball Race Children Gp 4',
                'Pole Bending Race Children Gp 4',
                'Ball & Bucket Race Children Gp 4',
                'Lime & Spoon Race Children Gp 4',
                'Sack Race Children Gp 4',
                'Boot & Hay Race Children Gp 4',
                'Music & Mug Race Children Gp 4',
                'Balloon Bursting Race Children Gp 4',
                'Whip & Ring Race Children Gp 4',
                'Baton Race Children Gp 4'
            ],
            // Children Group 5 events (6-7 years) - Limited events as per PDF
            children_gp5: [
                'Hacks Children Gp 5',
                'Stick & Ball Race Children Gp 5',
                'Pole Bending Race Children Gp 5',
                'Ball & Bucket Race Children Gp 5',
                'Lime & Spoon Race Children Gp 5',
                'Sack Race Children Gp 5',
                'Boot & Hay Race Children Gp 5',
                'Music & Mug Race Children Gp 5',
                'Balloon Bursting Race Children Gp 5',
                'Whip & Ring Race Children Gp 5',
                'Baton Race Children Gp 5'
            ],
            // Children Group 6 events (5-6 years) - Limited events as per PDF
            children_gp6: [
                'Hacks Children Gp 6',
                'Stick & Ball Race Children Gp 6',
                'Pole Bending Race Children Gp 6',
                'Ball & Bucket Race Children Gp 6',
                'Lime & Spoon Race Children Gp 6',
                'Sack Race Children Gp 6',
                'Boot & Hay Race Children Gp 6',
                'Music & Mug Race Children Gp 6',
                'Balloon Bursting Race Children Gp 6',
                'Whip & Ring Race Children Gp 6',
                'Baton Race Children Gp 6'
            ],
            // Children Group 7 events (4-5 years) - Limited events as per PDF
            children_gp7: [
                'Hacks Children Gp 7',
                'Stick & Ball Race Children Gp 7',
                'Pole Bending Race Children Gp 7',
                'Ball & Bucket Race Children Gp 7',
                'Lime & Spoon Race Children Gp 7',
                'Sack Race Children Gp 7',
                'Boot & Hay Race Children Gp 7',
                'Music & Mug Race Children Gp 7',
                'Balloon Bursting Race Children Gp 7',
                'Whip & Ring Race Children Gp 7',
                'Baton Race Children Gp 7'
            ]
        }
    },
    tentPegging: {
        name: 'TENT PEGGING',
        events: {
            // All tent pegging events are open category (no age restrictions mentioned in PDF)
            all: [
                'Individual Tent Pegging - Lance',
                'Individual Tent Pegging - Sword',
                'Paired Tent Pegging',
                'Individual Rings & Peg',
                'Individual Lemons & Peg',
                'Team Tent Pegging Lance',
                'Team Tent Pegging Sword',
                'Indian File'
            ]
        }
    },
    jumping: {
        name: 'JUMPING GHS',
        events: {
            // Children Group 1 jumping events (12-14 years)
            children_gp1: [
                'Children Jumping Gp 1',
                'Cross Jumps Children Gp 1',
                'Children Jumping Fault & Out Gp 1'
            ],
            // Children Group 2 jumping events (10-12 years)
            children_gp2: [
                'Children Jumping Gp 2',
                'Cross Jumps Children Gp 2',
                'Children Jumping Fault & Out Gp 2'
            ],
            // Children Group 3 jumping events (8-10 years)
            children_gp3: [
                'Children Jumping Gp 3',
                'Cross Jumps Children Gp 3',
                'Children Jumping Fault & Out Gp 3'
            ],
            // Junior Rider jumping events (14-18 years)
            junior_rider: [
                'Junior Jumping',
                'Junior Jumping Topscore',
                'Cross Jumps Junior',
                'Children Jumping Fault & Out Junior'
            ],
            // Young Rider jumping events (16-21 years)
            young_rider: [
                'Young Rider Jumping',
                'Young Rider Jumping Topscore',
                'Cross Jumps Young',
                'Children Jumping Fault & Out Young Rider'
            ],
            // Open jumping events (all age categories)
            all: [
                'Open Jumping Topscore',
                'Novice Jumping Normal',
                'Open Jumping Fault & Out',
                'Open Jumping Novice'
            ]
        }
    }
};


// Competition Types
const COMPETITION_TYPES = [
    { id: 'ghs', name: 'GHS (Ghaziabad Horse Show)' },
    { id: 'ncr', name: 'NCR (Inter School)' },
    { id: 'uphs', name: 'UPHS (U.P. Horse Show)' }
];

interface RiderEntry {
    id: string;
    name: string;
    efiId: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    ageCategory: string;
    ageCategoryName: string;
    selectedEvents: string[];
    competitions: string[];
}

type EventCategoryType = 'gymkhana' | 'tentPegging' | 'jumping';
type AgeCategoryKey = 'all' | 'ladies' | 'senior' | 'young_rider' | 'junior_rider' | 'children_gp1' | 'children_gp2' | 'children_gp3' | 'children_gp4' | 'children_gp5' | 'children_gp6' | 'children_gp7';

interface RegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
    eventTitle: string;
}

interface ValidationErrors {
    [riderId: string]: {
        name?: string;
        dateOfBirth?: string;
        gender?: string;
        competitions?: string;
        events?: string;
    };
}

const RegistrationFormModal: React.FC<RegistrationFormProps> = ({ isOpen, onClose, eventTitle }) => {
    const [riders, setRiders] = useState<RiderEntry[]>([
        { id: '1', name: '', efiId: '', dateOfBirth: '', age: 0, gender: '', ageCategory: '', ageCategoryName: '', selectedEvents: [], competitions: [] }
    ]);
    const [parentName, setParentName] = useState('');
    const [coachName, setCoachName] = useState('');
    const [activeTab, setActiveTab] = useState<EventCategoryType>('gymkhana');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const calculateAge = (dateOfBirth: string): number => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getAgeCategory = (age: number) => {
        for (const category of AGE_CATEGORIES) {
            if (age >= category.minAge && age <= category.maxAge) {
                return { id: category.id, name: category.name };
            }
        }
        return { id: '', name: '' };
    };

    const addRider = () => {
        const newId = (riders.length + 1).toString();
        setRiders([...riders, {
            id: newId,
            name: '',
            efiId: '',
            dateOfBirth: '',
            age: 0,
            gender: '',
            ageCategory: '',
            ageCategoryName: '',
            selectedEvents: [],
            competitions: []
        }]);
    };

    const removeRider = (id: string) => {
        setRiders(riders.filter(rider => rider.id !== id));
        // Remove validation errors for removed rider
        const newErrors = { ...validationErrors };
        delete newErrors[id];
        setValidationErrors(newErrors);
    };

    const updateRider = (id: string, field: keyof RiderEntry, value: any) => {
        setRiders(riders.map(rider => {
            if (rider.id === id) {
                let updatedRider = { ...rider, [field]: value };

                // If date of birth is updated, calculate age and age category
                if (field === 'dateOfBirth') {
                    const age = calculateAge(value);
                    const ageCategory = getAgeCategory(age);
                    updatedRider = {
                        ...updatedRider,
                        age,
                        ageCategory: ageCategory.id,
                        ageCategoryName: ageCategory.name,
                        selectedEvents: [] // Clear selected events when age category changes
                    };
                }

                return updatedRider;
            }
            return rider;
        }));

        // Clear validation error for this field
        if (validationErrors[id]) {
            const newErrors = { ...validationErrors };
            delete newErrors[id][field as keyof ValidationErrors[string]];
            if (Object.keys(newErrors[id]).length === 0) {
                delete newErrors[id];
            }
            setValidationErrors(newErrors);
        }
    };

    const toggleEvent = (riderId: string, event: string) => {
        setRiders(riders.map(rider => {
            if (rider.id === riderId) {
                const selectedEvents = rider.selectedEvents.includes(event)
                    ? rider.selectedEvents.filter(e => e !== event)
                    : [...rider.selectedEvents, event];
                return { ...rider, selectedEvents };
            }
            return rider;
        }));
    };

    const toggleCompetition = (riderId: string, competition: string) => {
        setRiders(riders.map(rider => {
            if (rider.id === riderId) {
                const competitions = rider.competitions.includes(competition)
                    ? rider.competitions.filter(c => c !== competition)
                    : [...rider.competitions, competition];
                return { ...rider, competitions };
            }
            return rider;
        }));
    };

    const getAvailableEvents = (rider: RiderEntry, eventType: EventCategoryType): string[] => {
        const category = EVENT_CATEGORIES[eventType];
        const { ageCategory, gender } = rider;

        if (eventType === 'tentPegging') {
            return category.events.all || [];
        }

        if (!ageCategory) {
            return [];
        }

        let availableEvents: string[] = [];

        // Add age-specific events
        const categoryEvents = (category.events as any)[ageCategory] || [];
        availableEvents = [...availableEvents, ...categoryEvents];

        // Add open/all age events (available to everyone)
        const allAgeEvents = (category.events as any).all || [];
        availableEvents = [...availableEvents, ...allAgeEvents];

        // Add ladies events for female riders
        if (gender === 'female') {
            const ladiesEvents = (category.events as any).ladies || [];
            availableEvents = [...availableEvents, ...ladiesEvents];
        }

        // Add senior events for riders 18+
        if (rider.age >= 18) {
            const seniorEvents = (category.events as any).senior || [];
            availableEvents = [...availableEvents, ...seniorEvents];
        }

        // Remove duplicates and return
        return [...new Set(availableEvents)];
    };

    const calculateRiderTotal = (rider: RiderEntry): number => {
        const competitionCount = rider.competitions.length;
        const eventCount = rider.selectedEvents.length;
        return competitionCount * eventCount * 1000;
    };

    const calculateTotal = () => {
        return riders.reduce((total, rider) => {
            return total + calculateRiderTotal(rider);
        }, 0);
    };

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        let hasErrors = false;

        riders.forEach(rider => {
            const riderErrors: ValidationErrors[string] = {};

            // Validate required fields
            if (!rider.name.trim()) {
                riderErrors.name = 'Rider name is required';
                hasErrors = true;
            }

            if (!rider.dateOfBirth) {
                riderErrors.dateOfBirth = 'Date of birth is required';
                hasErrors = true;
            }

            if (!rider.gender) {
                riderErrors.gender = 'Gender selection is required';
                hasErrors = true;
            }

            if (rider.competitions.length === 0) {
                riderErrors.competitions = 'Please select at least one competition';
                hasErrors = true;
            }

            if (rider.selectedEvents.length === 0) {
                riderErrors.events = 'Please select at least one event';
                hasErrors = true;
            }

            // Validate age category
            if (rider.dateOfBirth && !rider.ageCategory) {
                riderErrors.dateOfBirth = 'Age does not fall into any competition category';
                hasErrors = true;
            }

            if (Object.keys(riderErrors).length > 0) {
                errors[rider.id] = riderErrors;
            }
        });

        setValidationErrors(errors);
        setShowValidationErrors(hasErrors);
        return !hasErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstErrorElement = document.querySelector('.border-red-300');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Handle form submission logic here
        console.log('Registration submitted:', { riders, parentName, coachName });
        alert('Registration submitted successfully!');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-pink-800">Registration Form</h2>
                                <p className="text-gray-600 mt-1">Ghaziabad Horse Show/NCR Inter School/U.P.H.S 2025</p>
                                <p className="text-sm text-pink-600 font-medium">{eventTitle}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <LuX className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Validation Error Summary */}
                        {showValidationErrors && Object.keys(validationErrors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                                <div className="flex items-center mb-2">
                                    <LuAlarmClock className="w-5 h-5 text-red-500 mr-2" />
                                    <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
                                </div>
                                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                                    {Object.entries(validationErrors).map(([riderId, errors]) => {
                                        const riderIndex = riders.findIndex(r => r.id === riderId);
                                        return Object.entries(errors).map(([field, error]) => (
                                            <li key={`${riderId}-${field}`}>
                                                Rider #{riderIndex + 1}: {error}
                                            </li>
                                        ));
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Event Information */}
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="flex items-center justify-center">
                                    <LuCalendar className="w-5 h-5 text-pink-600 mr-2" />
                                    <span className="text-sm font-medium">9-18 October 2025</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <LuMapPin className="w-5 h-5 text-pink-600 mr-2" />
                                    <span className="text-sm font-medium">Gurukul Horse Riding Club, Ghaziabad</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <LuTrophy className="w-5 h-5 text-pink-600 mr-2" />
                                    <span className="text-sm font-medium">Total: ₹{calculateTotal()} + GST</span>
                                </div>
                            </div>
                        </div>

                        {/* Add Rider Button */}
                        {/* <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Riders Information</h3>
                            <button
                                type="button"
                                onClick={addRider}
                                className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                            >
                                <LuPlus className="w-4 h-4" />
                                <span>Add Rider</span>
                            </button>
                        </div> */}

                        {/* Riders Section */}
                        <div className="space-y-6">
                            {riders.map((rider, index) => (
                                <motion.div
                                    key={rider.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-gray-200 rounded-xl p-6 space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-medium text-gray-800 flex items-center">
                                            <LuUser className="w-5 h-5 mr-2 text-pink-600" />
                                            Rider #{index + 1}
                                            {rider.ageCategoryName && (
                                                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {rider.ageCategoryName} (Age: {rider.age})
                                                </span>
                                            )}
                                        </h4>
                                        {riders.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRider(rider.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <LuMinus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Rider Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={rider.name}
                                                onChange={(e) => updateRider(rider.id, 'name', e.target.value)}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter rider name"
                                            />
                                            {validationErrors[rider.id]?.name && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                EFI ID
                                            </label>
                                            <input
                                                type="text"
                                                value={rider.efiId}
                                                onChange={(e) => updateRider(rider.id, 'efiId', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                placeholder="Enter EFI ID"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                value={rider.dateOfBirth}
                                                onChange={(e) => updateRider(rider.id, 'dateOfBirth', e.target.value)}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                            />
                                            {validationErrors[rider.id]?.dateOfBirth && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].dateOfBirth}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Gender *
                                            </label>
                                            <select
                                                value={rider.gender}
                                                onChange={(e) => updateRider(rider.id, 'gender', e.target.value)}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                            {validationErrors[rider.id]?.gender && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].gender}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Competition Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Competitions * (₹1000 per event per competition)
                                        </label>
                                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg ${validationErrors[rider.id]?.competitions ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                            }`}>
                                            {COMPETITION_TYPES.map((comp) => (
                                                <label key={comp.id} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={rider.competitions.includes(comp.id)}
                                                        onChange={() => toggleCompetition(rider.id, comp.id)}
                                                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{comp.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {validationErrors[rider.id]?.competitions && (
                                            <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].competitions}</p>
                                        )}
                                    </div>

                                    {/* Event Selection */}
                                    {rider.ageCategory && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Events *
                                            </label>
                                            <div className={`border rounded-lg ${validationErrors[rider.id]?.events ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                                }`}>
                                                {/* Event Category Tabs */}
                                                <div className="border-b border-gray-200">
                                                    <div className="flex">
                                                        {Object.entries(EVENT_CATEGORIES).map(([key, category]) => (
                                                            <button
                                                                key={key}
                                                                type="button"
                                                                onClick={() => setActiveTab(key as EventCategoryType)}
                                                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                                                                    ? 'border-pink-500 text-pink-600 bg-pink-50'
                                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                                    }`}
                                                            >
                                                                {category.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Event Selection */}
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {getAvailableEvents(rider, activeTab).map((event) => (
                                                            <label key={event} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={rider.selectedEvents.includes(event)}
                                                                    onChange={() => toggleEvent(rider.id, event)}
                                                                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                                />
                                                                <span className="text-sm text-gray-700">{event}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {getAvailableEvents(rider, activeTab).length === 0 && (
                                                        <p className="text-gray-500 text-sm text-center py-4">
                                                            No events available for this age category in {EVENT_CATEGORIES[activeTab].name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {validationErrors[rider.id]?.events && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].events}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Rider Total */}
                                    {rider.competitions.length > 0 && rider.selectedEvents.length > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    {rider.competitions.length} competition(s) × {rider.selectedEvents.length} event(s) × ₹1000
                                                </span>
                                                <span className="text-lg font-semibold text-pink-600">
                                                    ₹{calculateRiderTotal(rider).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Parent/Coach Information */}
                        <div className="mt-8 space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Parent/Guardian Name
                                    </label>
                                    <input
                                        type="text"
                                        value={parentName}
                                        onChange={(e) => setParentName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Enter parent/guardian name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coach Name
                                    </label>
                                    <input
                                        type="text"
                                        value={coachName}
                                        onChange={(e) => setCoachName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Enter coach name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Total Registration Fee</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {riders.reduce((total, rider) => total + (rider.competitions.length * rider.selectedEvents.length), 0)} total entries across all riders
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-pink-600">₹{calculateTotal().toLocaleString()} + GST</div>
                                    {/* <div className="text-sm text-gray-600">+ GST (18%)</div> */}
                                    {/* <div className="text-lg font-semibold text-gray-800 border-t pt-1 mt-1">
                                        ₹{Math.round(calculateTotal() * 1.18).toLocaleString()} Total
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Submit Registration
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegistrationFormModal;