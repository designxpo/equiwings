"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuPlus, LuMinus, LuUser, LuCalendar, LuTrophy, LuMapPin } from 'react-icons/lu';

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
];

// Event Categories with age-specific events
const EVENT_CATEGORIES = {
    gymkhana: {
        name: 'GYMKHANA EVENTS',
        events: {
            all: [
                'Open Hacks',
                'Ladies Hacks',
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
                'Trot Carrot Cutting Race Open',
                'Trot Carrot & Peg Race Open',
                'Trot Rings & Peg Open',
                'Trot Tent Pegging Lance Open',
                'Trot Paired Tent Pegging Lance Open',
                'Trot Paired Tent Pegging Sword Open',
                'Trot Tent Pegging Individual Sword Open'
            ],
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
            senior: [
                'Hacks Senior Rider',
                'Stick & Ball Race Senior Rider',
                'Pole Bending Race Senior',
                'Ball & Bucket Race Senior'
            ],
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
            children_gp1: [
                'Children Jumping Gp 1',
                'Cross Jumps Children Gp 1',
                'Children Jumping Fault & Out Gp 1'
            ],
            children_gp2: [
                'Children Jumping Gp 2',
                'Cross Jumps Children Gp 2',
                'Children Jumping Fault & Out Gp 2'
            ],
            children_gp3: [
                'Children Jumping Gp 3',
                'Cross Jumps Children Gp 3',
                'Children Jumping Fault & Out Gp 3'
            ],
            junior_rider: [
                'Junior Jumping',
                'Junior Jumping Topscore',
                'Cross Jumps Junior',
                'Children Jumping Fault & Out Junior'
            ],
            young_rider: [
                'Young Rider Jumping',
                'Young Rider Jumping Topscore',
                'Cross Jumps Young',
                'Children Jumping Fault & Out Young Rider'
            ],
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

const RegistrationFormModal: React.FC<RegistrationFormProps> = ({ isOpen, onClose, eventTitle }) => {
    const [riders, setRiders] = useState<RiderEntry[]>([
        { id: '1', name: '', efiId: '', dateOfBirth: '', age: 0, ageCategory: '', ageCategoryName: '', selectedEvents: [], competitions: [] }
    ]);
    const [parentName, setParentName] = useState('');
    const [coachName, setCoachName] = useState('');
    const [activeTab, setActiveTab] = useState<EventCategoryType>('gymkhana');

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
            ageCategory: '', 
            ageCategoryName: '', 
            selectedEvents: [], 
            competitions: [] 
        }]);
    };

    const removeRider = (id: string) => {
        setRiders(riders.filter(rider => rider.id !== id));
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

    const getAvailableEvents = (ageCategory: string, eventType: EventCategoryType): string[] => {
        const category = EVENT_CATEGORIES[eventType];

        if (eventType === 'tentPegging') {
            return category.events.all || [];
        }

        if (!ageCategory) {
            return [];
        }

        // Get events for the specific age category
        const categoryEvents = (category.events as any)[ageCategory] || [];

        // Add open/all age events
        const allAgeEvents = (category.events as any).all || [];

        // Add ladies events for female riders (you might want to add gender selection)
        const ladiesEvents = (category.events as any).ladies || [];

        // Combine and remove duplicates
        const combinedEvents = [...new Set([...categoryEvents, ...allAgeEvents, ...ladiesEvents])];

        return combinedEvents;
    };

    // Updated calculation function: Competition Types × Events × ₹1000
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Riders Information</h3>
                        </div>

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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Rider Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={rider.name}
                                                onChange={(e) => updateRider(rider.id, 'name', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                placeholder="Enter rider name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                EFI Rider ID 
                                            </label>
                                            <input
                                                type="text"
                                                value={rider.efiId}
                                                onChange={(e) => updateRider(rider.id, 'efiId', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                placeholder="EFI ID"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={rider.dateOfBirth}
                                                onChange={(e) => updateRider(rider.id, 'dateOfBirth', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    {/* Competition Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Competition Type * (₹1000 × Competition × Event)
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {COMPETITION_TYPES.map(comp => (
                                                <label key={comp.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={rider.competitions.includes(comp.id)}
                                                        onChange={() => toggleCompetition(rider.id, comp.id)}
                                                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{comp.name}</div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Event Selection */}
                                    {rider.ageCategory && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Select Events
                                                </label>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {getAvailableEvents(rider.ageCategory, activeTab).length} events available
                                                </span>
                                            </div>

                                            {/* Event Category Tabs */}
                                            <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
                                                {Object.entries(EVENT_CATEGORIES).map(([key, category]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setActiveTab(key as EventCategoryType)}
                                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === key
                                                            ? 'bg-white text-pink-700 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {category.name}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Events List */}
                                            <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {getAvailableEvents(rider.ageCategory, activeTab).map(event => (
                                                        <label key={event} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={rider.selectedEvents.includes(event)}
                                                                onChange={() => toggleEvent(rider.id, event)}
                                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                            />
                                                            <span className="text-sm">{event}</span>
                                                        </label>
                                                    ))}
                                                    {getAvailableEvents(rider.ageCategory, activeTab).length === 0 && (
                                                        <div className="col-span-2 text-center text-gray-500 py-4">
                                                            No events available for this category
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!rider.ageCategory && rider.dateOfBirth && (
                                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                Age {rider.age} does not fall into any competition category. Please check the date of birth.
                                            </p>
                                        </div>
                                    )}

                                    {!rider.dateOfBirth && (
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                Please enter date of birth to see available events
                                            </p>
                                        </div>
                                    )}

                                    {/* Selected Events and Competitions Summary */}
                                    {rider.competitions.length > 0 && rider.selectedEvents.length > 0 && (
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-green-800 mb-1">
                                                Fee Calculation: {rider.competitions.length} Competition(s) × {rider.selectedEvents.length} Event(s) × ₹1000 = ₹{calculateRiderTotal(rider)} + GST
                                            </p>
                                            <div className="text-xs text-green-600 space-y-1">
                                                <p><strong>Competitions:</strong> {rider.competitions.map(comp => COMPETITION_TYPES.find(c => c.id === comp)?.name).join(', ')}</p>
                                                <p><strong>Events:</strong> {rider.selectedEvents.join(', ')}</p>
                                            </div>
                                        </div>
                                    )}

                                    {rider.competitions.length > 0 && rider.selectedEvents.length === 0 && (
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                Please select events to calculate fees
                                            </p>
                                        </div>
                                    )}

                                    {rider.competitions.length === 0 && rider.selectedEvents.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                Please select competitions to calculate fees
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Parent and Coach Information */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Parent Name 
                                </label>
                                <input
                                    type="text"
                                    value={parentName}
                                    onChange={(e) => setParentName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Parent's full name"
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
                                    placeholder="Coach's full name"
                                />
                            </div>
                        </div>

                        {/* Fee Summary */}
                        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Summary</h3>
                            <div className="space-y-3">
                                {riders.map((rider, index) => {
                                    const riderTotal = calculateRiderTotal(rider);
                                    return riderTotal > 0 && (
                                        <div key={rider.id} className="bg-white p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">
                                                        {rider.name || `Rider ${index + 1}`}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {rider.competitions.length} Competition(s) × {rider.selectedEvents.length} Event(s) × ₹1000
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Competitions: {rider.competitions.map(comp => 
                                                            COMPETITION_TYPES.find(c => c.id === comp)?.name
                                                        ).join(', ')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-pink-700">₹{riderTotal}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {calculateTotal() === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        No registrations selected yet
                                    </div>
                                )}
                                
                                {calculateTotal() > 0 && (
                                    <div className="pt-3 mt-3 border-t border-gray-200">
                                        <div className="flex justify-between text-xl font-bold text-pink-800">
                                            <span>Total Amount:</span>
                                            <span>₹{calculateTotal()} + GST</span>
                                        </div>
                                        <div className="text-sm text-gray-600 text-right mt-1">
                                            (GST will be calculated at checkout)
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                * All fields marked with asterisk are required
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-white bg-gradient-to-t from-[#780083] to-[#5B297A] hover:from-[#5B297A] hover:to-[#780083] rounded-md py-2 px-4 font-medium transition-all duration-200 whitespace-nowrap"
                                >
                                    Submit Registration
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegistrationFormModal;