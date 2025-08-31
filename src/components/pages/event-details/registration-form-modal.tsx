"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LuX,
    LuPlus,
    LuMinus,
    LuUser,
    LuCalendar,
    LuTrophy,
    LuMapPin,
    LuAlarmClock,
    LuUsers,
    LuUserCheck,
    LuLoader,
    LuCamera,
} from "react-icons/lu"
import axios from "axios"
import toast from "react-hot-toast"

// Types based on API response
interface Category {
    id: string
    category_name: string
    entry_type: "individual" | "team" | "mixed"
    max_size_of_team: number | null
    min_size_of_team: number | null
    age_group: string | null
    min_age_years: number | null
    max_age_years: number | null
    gender_restriction: string | null // "male" | "female" | "mixed" | null
}

interface SubEvent {
    id: string
    name: string
    category_ids: string[]
    categories: Category[]
}

interface Competition {
    id: string
    name: string
    image_url: string | null
    start_date: string
    end_date: string
}

interface EventData {
    id: string
    event_name: string
    event_code: string
    event_type_id: string
    sanctioning_body?: string
    start_date: string
    end_date: string
    venue_location: string
    description: string
    registration_open_date?: string
    registration_close_date?: string
    max_entries_per_category?: number | null
    organizers?: any[]
    event_status: string
    series?: any
    default_discipline?: any
    rules_document_url?: string
    prize_money_total?: string
    entry_fee_structure?: any
    is_active: boolean
    created_by?: string
    created_at: string
    updated_at: string
    competitions: Competition[]
    sub_events: SubEvent[]
}

interface ApiResponse {
    success: boolean
    message: string
    data: { event: EventData }
    timestamp: string
}

interface RiderEntry {
    id: string;
    name: string;
    efiId: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    ageCategory: string;
    competitions: string[];
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    profileImage: File | null;
    profileImagePreview: string;
}

interface RegistrationFormProps {
    isOpen: boolean
    onClose: () => void
    eventTitle: string
}

type RiderFieldErrors = {
    name?: string
    dateOfBirth?: string
    gender?: string
    competitions?: string
    phone?: string
    email?: string
    password?: string;
    confirmPassword?: string;
    profileImage?: string
}

interface ValidationErrors {
    [riderId: string]: RiderFieldErrors
    team?: any
}

const RegistrationFormModal: React.FC<RegistrationFormProps> = ({ isOpen, onClose, eventTitle }) => {
    const [eventData, setEventData] = useState<EventData | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [registrationType, setRegistrationType] = useState<"individual" | "team">("individual")
    const [teamName, setTeamName] = useState("")
    const [riders, setRiders] = useState<RiderEntry[]>([
        {
            id: '1',
            name: '',
            efiId: '',
            dateOfBirth: '',
            age: 0,
            gender: '',
            ageCategory: '',
            competitions: [],
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            profileImage: null,
            profileImagePreview: ''
        }
    ]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [parentName, setParentName] = useState("")
    const [coachName, setCoachName] = useState("")
    const [activeSubEvent, setActiveSubEvent] = useState<string>("")
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
    const [showValidationErrors, setShowValidationErrors] = useState(false)
    const [teamCompetitions, setTeamCompetitions] = useState<string[]>([])

    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

    // Dates
    const now = new Date()

    useEffect(() => {
        if (isOpen) {
            fetchEventData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const fetchEventData = async () => {
        try {
            setLoading(true)
            setError(null)
            // NOTE: Using event id directly as in the snippet (4). You can switch to eventId param if your API supports it.
            const response = await axios.get<ApiResponse>(`http://localhost:5000/event-participants/register/4`)
            if (response.data.success) {
                const evt = response.data.data.event
                setEventData(evt)
                if (evt.sub_events.length > 0) {
                    setActiveSubEvent(evt.sub_events[0].id)
                }
            } else {
                setError("Failed to fetch event data")
            }
        } catch (err) {
            setError("Error fetching event data")
            console.error("Error fetching event data:", err)
        } finally {
            setLoading(false)
        }
    }

    // Helpers
    const calculateAge = (dateOfBirth: string): number => {
        if (!dateOfBirth) return 0
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const withinRange = (date: Date, start: Date, end: Date) => date >= start && date <= end
    const rangeWithinRange = (startA: Date, endA: Date, startB: Date, endB: Date) => startA >= startB && endA <= endB

    const getAgeCategoryForRider = (age: number, gender: string): string => {
        if (!eventData) return ""
        const matchingCategories: string[] = []
        eventData.sub_events.forEach((se) => {
            se.categories.forEach((category) => {
                const minAge = category.min_age_years ?? 0
                const maxAge = category.max_age_years ?? 100
                const genderMatch =
                    !category.gender_restriction ||
                    category.gender_restriction === "mixed" ||
                    category.gender_restriction === gender
                if (age >= minAge && age <= maxAge && genderMatch) {
                    matchingCategories.push(category.id)
                }
            })
        })
        return matchingCategories[0] || ""
    }

    const addRider = () => {
        const newId = (riders.length + 1).toString()
        setRiders([
            ...riders,
            {
                id: newId,
                name: "",
                efiId: "",
                dateOfBirth: "",
                age: 0,
                gender: "",
                ageCategory: "",
                competitions: [],
                phone: "",
                password: "",
                confirmPassword: "",
                email: "",
                profileImage: null,
                profileImagePreview: "",
            },
        ])
    }

    const removeRider = (id: string) => {
        setRiders((prev) => prev.filter((r) => r.id !== id))
        const newErrors = { ...validationErrors }
        delete newErrors[id]
        setValidationErrors(newErrors)
    }

    const updateRider = (id: string, field: keyof RiderEntry, value: any) => {
        setRiders((prev) =>
            prev.map((rider) => {
                if (rider.id !== id) return rider
                let updated = { ...rider, [field]: value }
                if (field === "dateOfBirth") {
                    const age = calculateAge(value)
                    const ageCategory = getAgeCategoryForRider(age, rider.gender)
                    updated = { ...updated, age, ageCategory }
                }
                if (field === "gender" && rider.dateOfBirth) {
                    const age = calculateAge(rider.dateOfBirth)
                    const ageCategory = getAgeCategoryForRider(age, value)
                    updated = { ...updated, ageCategory }
                }
                return updated
            }),
        )

        // Clear field error for this rider if present
        if (validationErrors[id]) {
            const newErrors = { ...validationErrors }
            delete newErrors[id][field as keyof RiderFieldErrors]
            if (Object.keys(newErrors[id]).length === 0) {
                delete newErrors[id]
            }
            setValidationErrors(newErrors)
        }
    }

    const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        if (!file.type.startsWith("image/")) {
            setValidationErrors((prev) => ({
                ...prev,
                [id]: { ...(prev[id] || {}), profileImage: "Please upload an image file" },
            }))
            return
        }
        if (file.size > 1 * 1024 * 1024) {
            setValidationErrors((prev) => ({
                ...prev,
                [id]: { ...(prev[id] || {}), profileImage: "Image must be less than 1MB" },
            }))
            return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
            updateRider(id, "profileImagePreview", (ev.target?.result as string) || "")
        }
        reader.readAsDataURL(file)
        updateRider(id, "profileImage", file)

        if (validationErrors[id]?.profileImage) {
            const newErrors = { ...validationErrors }
            delete newErrors[id].profileImage
            if (Object.keys(newErrors[id]).length === 0) {
                delete newErrors[id]
            }
            setValidationErrors(newErrors)
        }
    }

    const triggerImageUpload = (id: string) => {
        fileInputRefs.current[id]?.click()
    }

    const toggleCompetition = (competitionId: string) => {
        if (registrationType === "team") {
            setTeamCompetitions((prev) =>
                prev.includes(competitionId) ? prev.filter((c) => c !== competitionId) : [...prev, competitionId],
            )
        } else {
            setRiders((prev) =>
                prev.map((r) => {
                    const competitions = r.competitions.includes(competitionId)
                        ? r.competitions.filter((c) => c !== competitionId)
                        : [...r.competitions, competitionId]
                    return { ...r, competitions }
                }),
            )
        }
    }

    // Eligibility helpers
    const isRiderInfoComplete = (r: RiderEntry) => Boolean(r.dateOfBirth && r.gender)
    const areAllRidersInfoComplete = (rs: RiderEntry[]) => rs.every(isRiderInfoComplete)

    const isGenderAllowed = (restriction: string | null, gender: string) => {
        if (!restriction || restriction === "mixed") return true
        return restriction === gender
    }

    const isTeamGenderAllowed = (restriction: string | null, rs: RiderEntry[]) => {
        if (!restriction || restriction === "mixed") return true
        if (restriction === "female") return rs.every((r) => r.gender === "female")
        if (restriction === "male") return rs.every((r) => r.gender === "male")
        return true
    }

    const isAgeAllowed = (min: number | null, max: number | null, riderAge: number) => {
        const low = min ?? 0
        const high = max ?? 200
        return riderAge >= low && riderAge <= high
    }

    const eventDates = useMemo(() => {
        if (!eventData) return null
        return {
            start: new Date(eventData.start_date),
            end: new Date(eventData.end_date),
        }
    }, [eventData])

    const visibleCompetitions = useMemo(() => {
        if (!eventData || !eventDates) return []
        // keep competitions that fall within the event date window
        return eventData.competitions.filter((comp) =>
            rangeWithinRange(new Date(comp.start_date), new Date(comp.end_date), eventDates.start, eventDates.end),
        )
    }, [eventData, eventDates])

    const getEligibleCategories = useMemo(() => {
        return () => {
            if (!eventData || !activeSubEvent) return []
            const subEvent = eventData.sub_events.find((se) => se.id === activeSubEvent)
            if (!subEvent) return []

            // Gate: require DOB & gender before showing any categories
            if (registrationType === "individual") {
                const rider = riders[0]
                if (!rider || !isRiderInfoComplete(rider)) return []
                const riderAge = calculateAge(rider.dateOfBirth)

                return subEvent.categories.filter((cat) => {
                    // entry_type filter
                    if (!(cat.entry_type === "individual" || cat.entry_type === "mixed")) return false
                    // gender filter
                    if (!isGenderAllowed(cat.gender_restriction, rider.gender)) return false
                    // age filter
                    if (!isAgeAllowed(cat.min_age_years, cat.max_age_years, riderAge)) return false
                    return true
                })
            } else {
                if (!areAllRidersInfoComplete(riders)) return []
                const riderAges = riders.map((r) => calculateAge(r.dateOfBirth))

                return subEvent.categories.filter((cat) => {
                    // entry_type filter
                    if (!(cat.entry_type === "team" || cat.entry_type === "mixed")) return false

                    // team size filter (if provided)
                    const minSize = cat.min_size_of_team ?? 2
                    const maxSize = cat.max_size_of_team ?? 100
                    if (riders.length < minSize || riders.length > maxSize) return false

                    // team gender filter
                    if (!isTeamGenderAllowed(cat.gender_restriction, riders)) return false

                    // team age filter: require every rider to be eligible if min/max provided
                    const minAge = cat.min_age_years
                    const maxAge = cat.max_age_years
                    if (minAge != null || maxAge != null) {
                        const allOk = riderAges.every((age) => isAgeAllowed(minAge, maxAge, age))
                        if (!allOk) return false
                    }

                    return true
                })
            }
        }
    }, [eventData, activeSubEvent, registrationType, riders])

    // Prune selected categories if eligibility changes
    useEffect(() => {
        const eligibleIds = new Set(getEligibleCategories().map((c) => c.id))
        setSelectedCategories((prev) => prev.filter((id) => eligibleIds.has(id)))
    }, [getEligibleCategories])

    const toggleCategory = (categoryId: string) => {
        const eligibleIds = new Set(getEligibleCategories().map((c) => c.id))
        if (!eligibleIds.has(categoryId)) return // prevent selecting ineligible category (guard)
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
        )

        // Clear team category-level validation errors
        if (validationErrors.team?.categories) {
            const newErrors: ValidationErrors = { ...validationErrors }
            if (newErrors.team) delete newErrors.team.categories
            setValidationErrors(newErrors)
        }
    }

    const calculateRiderTotal = (rider: RiderEntry): number => {
        if (!eventData) return 0
        const competitionCount = registrationType === "team" ? teamCompetitions.length : rider.competitions.length
        const categoryCount = selectedCategories.length
        const baseFee = 1000 // default fee
        return competitionCount * categoryCount * baseFee
    }

    const calculateTotal = () => riders.reduce((t, r) => t + calculateRiderTotal(r), 0)

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {}
        let hasErrors = false

        if (registrationType === "team") {
            const teamErr: { name?: string; categories?: string } = {}
            if (!teamName.trim()) {
                teamErr.name = "Team name is required"
                hasErrors = true
            }
            if (selectedCategories.length === 0) {
                teamErr.categories = "Please select at least one category"
                hasErrors = true
            }
            if (teamCompetitions.length === 0) {
                teamErr.categories = "Please select at least one competition"
                hasErrors = true
            }

            // Team size check for every selected category
            if (eventData && activeSubEvent) {
                const subEvent = eventData.sub_events.find((se) => se.id === activeSubEvent)
                if (subEvent) {
                    const selectedCats = subEvent.categories.filter((c) => selectedCategories.includes(c.id))
                    const invalidCats = selectedCats.filter((c) => {
                        const minSize = c.min_size_of_team ?? 2
                        const maxSize = c.max_size_of_team ?? 100
                        return riders.length < minSize || riders.length > maxSize
                    })
                    if (invalidCats.length > 0) {
                        const msg =
                            invalidCats.length === 1
                                ? `Team size must match ${invalidCats[0].category_name} requirements`
                                : "Team size must match all selected categories' requirements"
                        teamErr.categories = msg
                        hasErrors = true
                    }
                }
            }

            if (Object.keys(teamErr).length > 0) {
                errors.team = teamErr
            }
        }

        // Rider-level checks
        riders.forEach((rider) => {
            const rErr: RiderFieldErrors = {}

            if (!rider.name.trim()) {
                rErr.name = "Rider name is required"
                hasErrors = true
            }
            if (!rider.dateOfBirth) {
                rErr.dateOfBirth = "Date of birth is required"
                hasErrors = true
            }
            if (!rider.gender) {
                rErr.gender = "Gender selection is required"
                hasErrors = true
            }
            if (!rider.phone.trim()) {
                rErr.phone = "Phone number is required"
                hasErrors = true
            }
            if (!rider.email.trim()) {
                rErr.email = "Email is required"
                hasErrors = true
            } else if (!/\S+@\S+\.\S+/.test(rider.email)) {
                rErr.email = "Email is invalid"
                hasErrors = true
            }
            if (registrationType === "individual" && rider.competitions.length === 0) {
                rErr.competitions = "Please select at least one competition"
                hasErrors = true
            }
            if (rider.dateOfBirth && !rider.ageCategory) {
                // if our computed mapping didn't find a category, flag
                rErr.dateOfBirth = "Age does not fall into any competition category"
                hasErrors = true
            }

            if (!rider.password) {
                rErr.password = 'Password is required';
                hasErrors = true;
            } else if (rider.password.length < 6) {
                rErr.password = 'Password must be at least 6 characters';
                hasErrors = true;
            }

            if (rider.password !== rider.confirmPassword) {
                rErr.confirmPassword = 'Passwords do not match';
                hasErrors = true;
            }

            if (Object.keys(rErr).length > 0) {
                errors[rider.id] = rErr
            }
        })

        if (registrationType === "individual" && selectedCategories.length === 0) {
            if (!errors.team) errors.team = {}
            errors.team.categories = "Please select at least one category"
            hasErrors = true
        }

        setValidationErrors(errors)
        setShowValidationErrors(hasErrors)
        return !hasErrors
    }


    // Add this function to get unique sub event IDs from selected categories
    const getSubEventIdsFromSelectedCategories = useMemo(() => {
        return () => {
            if (!eventData || selectedCategories.length === 0) return [];

            const subEventIds = new Set<string>();

            // Find which sub events the selected categories belong to
            eventData.sub_events.forEach(subEvent => {
                const hasSelectedCategory = subEvent.categories.some(category =>
                    selectedCategories.includes(category.id)
                );

                if (hasSelectedCategory) {
                    subEventIds.add(subEvent.id);
                }
            });

            return Array.from(subEventIds);
        };
    }, [eventData, selectedCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            const firstErrorElement = document.querySelector(".border-red-300")
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            return
        }

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("registrationType", registrationType)
            formData.append("teamName", registrationType === "team" ? teamName : "")
            formData.append("parentName", parentName)
            formData.append("coachName", coachName)
            formData.append("totalFee", calculateTotal().toString())

            // Get sub event IDs from selected categories
            const subEventIds = getSubEventIdsFromSelectedCategories();

            // Add all sub event IDs as an array
            subEventIds.forEach((subEventId, index) => {
                formData.append(`subEventIds[${index}]`, subEventId)
            })

            selectedCategories.forEach((categoryId, index) => {
                formData.append(`categories[${index}]`, categoryId)
            })

            if (registrationType === "team") {
                teamCompetitions.forEach((competitionId, index) => {
                    formData.append(`competitions[${index}]`, competitionId)
                })
            }

            riders.forEach((rider, riderIndex) => {
                formData.append(`riders[${riderIndex}][name]`, rider.name)
                formData.append(`riders[${riderIndex}][efiId]`, rider.efiId)
                formData.append(`riders[${riderIndex}][dateOfBirth]`, rider.dateOfBirth)
                formData.append(`riders[${riderIndex}][gender]`, rider.gender)
                formData.append(`riders[${riderIndex}][ageCategory]`, rider.ageCategory)
                formData.append(`riders[${riderIndex}][phone]`, rider.phone)
                formData.append(`riders[${riderIndex}][email]`, rider.email)
                formData.append(`riders[${riderIndex}][password]`, rider.password);

                if (registrationType === "individual") {
                    rider.competitions.forEach((competitionId, compIndex) => {
                        formData.append(`riders[${riderIndex}][competitions][${compIndex}]`, competitionId)
                    })
                }

                // Handle file uploads according to middleware expectations
                const fileFromState = rider.profileImage
                const fileFromInput = fileInputRefs.current[rider.id]?.files?.[0] || null
                const fileToSend = fileFromState || fileFromInput

                if (fileToSend) {
                    // For individual registration, use the 'file' field name
                    if (registrationType === "individual") {
                        formData.append("file", fileToSend, fileToSend.name)
                    }
                    // For team registration, use the specific field names expected by middleware
                    else {
                        formData.append(`riders[${riderIndex}][profileImage]`, fileToSend, fileToSend.name)
                    }
                } else {
                    console.warn(`No profile image found for rider ${rider.id}`)
                }
            })

            await axios.post("http://localhost:5000/event-participants/register/4", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success("Registration submitted successfully!")
            onClose()
        } catch (err: any) {
            console.error("Registration error:", err)
            setError(err?.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }
    // Reset form when registration type changes
    useEffect(() => {
        if (registrationType === "individual") {
            setRiders([
                {
                    id: "1",
                    name: "",
                    efiId: "",
                    dateOfBirth: "",
                    age: 0,
                    gender: "",
                    ageCategory: "",
                    competitions: [],
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    profileImage: null,
                    profileImagePreview: "",
                },
            ])
            setTeamName("")
            setTeamCompetitions([])
        } else {
            setRiders([
                {
                    id: "1",
                    name: "",
                    efiId: "",
                    dateOfBirth: "",
                    age: 0,
                    gender: "",
                    ageCategory: "",
                    competitions: [],
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    profileImage: null,
                    profileImagePreview: "",
                },
                {
                    id: "2",
                    name: "",
                    efiId: "",
                    dateOfBirth: "",
                    age: 0,
                    gender: "",
                    ageCategory: "",
                    competitions: [],
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    profileImage: null,
                    profileImagePreview: "",
                },
            ])
        }
        setSelectedCategories([])
    }, [registrationType])

    if (!isOpen) return null

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
                    <LuLoader className="w-8 h-8 animate-spin text-pink-600 mb-4" />
                    <p className="text-gray-600">Loading event data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button onClick={onClose} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                        Close
                    </button>
                </div>
            </div>
        )
    }

    if (!eventData) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
                    <p className="text-gray-600 mb-4">No event data available</p>
                    <button onClick={onClose} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                        Close
                    </button>
                </div>
            </div>
        )
    }

    const categoriesToShow = getEligibleCategories()
    const showCategoriesGateMessage =
        (registrationType === "individual" && !isRiderInfoComplete(riders[0])) ||
        (registrationType === "team" && !areAllRidersInfoComplete(riders))

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
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-pink-800">Registration Form</h2>
                                <p className="text-gray-600 mt-1">{eventData.event_name}</p>
                                <p className="text-sm text-pink-600 font-medium">{eventData.venue_location}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <LuX className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Registration Type Selection */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Registration Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${registrationType === "individual"
                                        ? "border-pink-500 bg-pink-50"
                                        : "border-gray-200 hover:border-pink-300"
                                        }`}
                                    onClick={() => setRegistrationType("individual")}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`p-3 rounded-lg ${registrationType === "individual" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <LuUserCheck className="w-6 h-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-medium text-gray-800">Individual</h4>
                                            <p className="text-sm text-gray-600 mt-1">Register as an individual competitor</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${registrationType === "team" ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-300"
                                        }`}
                                    onClick={() => setRegistrationType("team")}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`p-3 rounded-lg ${registrationType === "team" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <LuUsers className="w-6 h-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-medium text-gray-800">Team</h4>
                                            <p className="text-sm text-gray-600 mt-1">Register as a team (2-4 members)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Name Field (only for team registration) */}
                        {registrationType === "team" && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors.team?.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    placeholder="Enter your team name"
                                    required
                                />
                                {validationErrors.team?.name && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.team.name}</p>
                                )}
                            </div>
                        )}

                        {/* Validation Error Summary */}
                        {showValidationErrors && Object.keys(validationErrors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                                <div className="flex items-center mb-2">
                                    <LuAlarmClock className="w-5 h-5 text-red-500 mr-2" />
                                    <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
                                </div>
                                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                                    {registrationType === "team" && !teamName.trim() && <li>Team name is required</li>}
                                    {validationErrors.team?.categories && <li>{validationErrors.team.categories}</li>}
                                    {Object.entries(validationErrors).map(([riderId, errors]) => {
                                        if (riderId === "team") return null
                                        const riderIndex = riders.findIndex((r) => r.id === riderId)
                                        return Object.entries(errors as RiderFieldErrors).map(([field, err]) => (
                                            <li key={`${riderId}-${field}`}>
                                                Rider #{riderIndex + 1}: {err}
                                            </li>
                                        ))
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Event Information */}
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="flex items-center justify-center">
                                    <LuCalendar className="w-5 h-5 text-pink-600 mr-2" />
                                    <span className="text-sm font-medium">
                                        {new Date(eventData.start_date).toLocaleDateString()} -{" "}
                                        {new Date(eventData.end_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <LuMapPin className="w-5 h-5 text-pink-600 mr-2" />
                                    <span className="text-sm font-medium">{eventData.venue_location}</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <LuTrophy className="w-5 h-5 text-pink-600 mr-2" />
                                    <span className="text-sm font-medium">Total: ₹{calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Add Rider Button (only for team registration) */}
                        {registrationType === "team" && (
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Team Members ({riders.length}/4)</h3>
                                {riders.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={addRider}
                                        className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                                    >
                                        <LuPlus className="w-4 h-4" />
                                        <span>Add Team Member</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Individual Rider Title */}
                        {registrationType === "individual" && (
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Rider Information</h3>
                        )}

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
                                            {registrationType === "team" ? `Team Member #${index + 1}` : "Rider Information"}
                                            {rider.ageCategory && (
                                                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    Age: {rider.age}
                                                </span>
                                            )}
                                        </h4>
                                        {registrationType === "team" && riders.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRider(rider.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <LuMinus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        {/* Profile Image Upload */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                                            <div className="relative">
                                                <div
                                                    className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden ${validationErrors[rider.id]?.profileImage ? "border-red-300 bg-red-50" : "border-gray-300"
                                                        }`}
                                                    onClick={() => triggerImageUpload(rider.id)}
                                                >
                                                    {rider.profileImagePreview ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={rider.profileImagePreview || "/placeholder.svg"}
                                                            alt="Profile preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <LuCamera className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={(el) => {
                                                        fileInputRefs.current[rider.id] = el
                                                    }}
                                                    onChange={(e) => handleImageUpload(rider.id, e)}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                {validationErrors[rider.id]?.profileImage && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].profileImage}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Basic Information */}
                                        <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rider Name *</label>
                                                <input
                                                    type="text"
                                                    value={rider.name}
                                                    onChange={(e) => updateRider(rider.id, "name", e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                                        }`}
                                                    placeholder="Enter rider name"
                                                />
                                                {validationErrors[rider.id]?.name && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">EFI ID</label>
                                                <input
                                                    type="text"
                                                    value={rider.efiId}
                                                    onChange={(e) => updateRider(rider.id, "efiId", e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                    placeholder="Enter EFI ID"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                                                <input
                                                    type="date"
                                                    value={rider.dateOfBirth}
                                                    onChange={(e) => updateRider(rider.id, "dateOfBirth", e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.dateOfBirth ? "border-red-300 bg-red-50" : "border-gray-300"
                                                        }`}
                                                />
                                                {validationErrors[rider.id]?.dateOfBirth && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].dateOfBirth}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                                <select
                                                    value={rider.gender}
                                                    onChange={(e) => updateRider(rider.id, "gender", e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.gender ? "border-red-300 bg-red-50" : "border-gray-300"
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

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    value={rider.phone}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[a-zA-Z]/g, '')
                                                        updateRider(rider.id, "phone", value)
                                                    }}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                                                        }`}
                                                    placeholder="Enter phone number"
                                                />
                                                {validationErrors[rider.id]?.phone && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                                <input
                                                    type="email"
                                                    value={rider.email}
                                                    onChange={(e) => updateRider(rider.id, "email", e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                                        }`}
                                                    placeholder="Enter email address"
                                                />
                                                {validationErrors[rider.id]?.email && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    value={rider.password}
                                                    onChange={(e) => updateRider(rider.id, 'password', e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                                    placeholder="Enter password"
                                                />
                                                {validationErrors[rider.id]?.password && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    value={rider.confirmPassword}
                                                    onChange={(e) => updateRider(rider.id, 'confirmPassword', e.target.value)}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                                    placeholder="Confirm password"
                                                />
                                                {validationErrors[rider.id]?.confirmPassword && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].confirmPassword}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Competition Selection (only for individual registration) */}
                                    {registrationType === "individual" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Competitions * (₹1000 per category per competition)
                                            </label>
                                            <div
                                                className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg ${validationErrors[rider.id]?.competitions ? "border-red-300 bg-red-50" : "border-gray-200"
                                                    }`}
                                            >
                                                {visibleCompetitions.map((comp) => (
                                                    <label key={comp.id} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={rider.competitions.includes(comp.id)}
                                                            onChange={() => toggleCompetition(comp.id)}
                                                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{comp.name}</span>
                                                    </label>
                                                ))}
                                                {visibleCompetitions.length === 0 && (
                                                    <div className="col-span-full text-sm text-gray-500">
                                                        No competitions available within event dates.
                                                    </div>
                                                )}
                                            </div>
                                            {validationErrors[rider.id]?.competitions && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].competitions}</p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Competition Selection (for team registration) */}
                        {registrationType === "team" && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Team Competitions</h3>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Competitions * (₹1000 per category per competition)
                                </label>
                                <div
                                    className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg ${validationErrors.team?.categories ? "border-red-300 bg-red-50" : "border-gray-200"
                                        }`}
                                >
                                    {visibleCompetitions.map((comp) => (
                                        <label key={comp.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={teamCompetitions.includes(comp.id)}
                                                onChange={() => toggleCompetition(comp.id)}
                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                            />
                                            <span className="text-sm text-gray-700">{comp.name}</span>
                                        </label>
                                    ))}
                                    {visibleCompetitions.length === 0 && (
                                        <div className="col-span-full text-sm text-gray-500">
                                            No competitions available within event dates.
                                        </div>
                                    )}
                                </div>
                                {validationErrors.team?.categories && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.team.categories}</p>
                                )}
                            </div>
                        )}

                        {/* Category Selection */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {registrationType === "team" ? "Team Category Selection" : "Category Selection"}
                            </h3>

                            {/* Sub-Event Selection Tabs */}
                            <div className="border-b border-gray-200 mb-4">
                                <div className="flex overflow-x-auto">
                                    {eventData.sub_events.map((subEvent) => (
                                        <button
                                            key={subEvent.id}
                                            type="button"
                                            onClick={() => setActiveSubEvent(subEvent.id)}
                                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSubEvent === subEvent.id
                                                ? "border-pink-500 text-pink-600 bg-pink-50"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {subEvent.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Gate message if rider(s) info incomplete */}
                            {showCategoriesGateMessage && (
                                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg mb-3 text-sm text-amber-800">
                                    Please fill Date of Birth and Gender{" "}
                                    {registrationType === "team" ? "for all team members" : "for the rider"} to see eligible categories.
                                </div>
                            )}

                            {/* Category List */}
                            <div
                                className={`border rounded-lg ${validationErrors.team?.categories ? "border-red-300 bg-red-50" : "border-gray-200"
                                    }`}
                            >
                                <div className="p-4">
                                    {!showCategoriesGateMessage && categoriesToShow.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {categoriesToShow.map((category) => (
                                                <label
                                                    key={category.id}
                                                    className="flex items-start space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => toggleCategory(category.id)}
                                                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700">{category.category_name}</span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {category.age_group && <div>Age: {category.age_group}</div>}
                                                            {category.gender_restriction && category.gender_restriction !== "mixed" && (
                                                                <div>Gender: {category.gender_restriction}</div>
                                                            )}
                                                            {registrationType === "team" && (
                                                                <div>
                                                                    Team size: {category.min_size_of_team ?? 2}-{category.max_size_of_team ?? 100} members
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {!showCategoriesGateMessage && categoriesToShow.length === 0 && (
                                        <p className="text-gray-500 text-sm text-center py-4">
                                            No eligible categories for the current selection. Adjust rider info or team size.
                                        </p>
                                    )}
                                </div>
                            </div>
                            {validationErrors.team?.categories && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.team.categories}</p>
                            )}
                        </div>

                        {/* Parent/Coach Information */}
                        {/* <div className="mt-8 space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                                    <input
                                        type="text"
                                        value={parentName}
                                        onChange={(e) => setParentName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Enter parent/guardian name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
                                    <input
                                        type="text"
                                        value={coachName}
                                        onChange={(e) => setCoachName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Enter coach name"
                                    />
                                </div>
                            </div>
                        </div> */}

                        {/* Total Summary */}
                        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Total Registration Fee</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {registrationType === "team"
                                            ? `${teamCompetitions.length} competition entries`
                                            : `${riders.reduce((total, rider) => total + rider.competitions.length, 0)} competition entries`}{" "}
                                        × {selectedCategories.length} categories × ₹1000
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-pink-600">₹{calculateTotal().toLocaleString()}</div>
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
                                disabled={submitting}
                                className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {submitting && <LuLoader className="w-4 h-4 animate-spin mr-2" />}
                                Submit Registration
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence >
    )
}

export default RegistrationFormModal
