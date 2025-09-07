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
    ageCertificate: File | null;
    ageCertificatePreview: string;
    exhibitor: string; // ADD THIS
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
    ageCertificate?: string
}

interface ValidationErrors {
    [riderId: string]: RiderFieldErrors
    team?: any
}

const RegistrationFormModal: React.FC<RegistrationFormProps> = ({ isOpen, onClose, eventTitle }) => {
    const [eventData, setEventData] = useState<EventData | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [pairName, setPairName] = useState("")

    const [registrationType, setRegistrationType] = useState<"individual" | "team" | "paired">("individual")
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
            profileImagePreview: '',
            ageCertificate: null,
            ageCertificatePreview: '',
            exhibitor: ""

        }
    ]);

    // REPLACE selectedCategories with competitionCategories
    const [competitionCategories, setCompetitionCategories] = useState<{
        [competitionId: string]: string[]
    }>({})

    const [parentName, setParentName] = useState("")
    const [coachName, setCoachName] = useState("")
    const [activeSubEvent, setActiveSubEvent] = useState<string>("")
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
    const [showValidationErrors, setShowValidationErrors] = useState(false)
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

    // Dates
    const now = new Date()

    const getAllSelectedCategories = () => {
        return Object.values(competitionCategories).flat()
    }

    const getCategoriesForCompetition = (competitionId: string) => {
        return competitionCategories[competitionId] || []
    }

    useEffect(() => {
        if (isOpen) {
            fetchEventData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const fetchEventData = async () => {
        try {
            setLoading(true)
            // NOTE: Using event id directly as in the snippet (4). You can switch to eventId param if your API supports it.
            const response = await axios.get<ApiResponse>(`http://localhost:5000/event-participants/register/4`)
            const evt = response.data.data.event
            setEventData(evt)
            if (evt.sub_events.length > 0) {
                setActiveSubEvent(evt.sub_events[0].id)
            }

        } catch (err) {
            toast.error('Failed to fetch event data')
            console.error("Error fetching event data:", err)
        } finally {
            setLoading(false)
        }
    }

    // Helpers
    const toggleCategoryForCompetition = (competitionId: string, categoryId: string) => {
        if (!eventData) return

        // Build the set of eligible IDs across all sub-events
        const allEligibleIds = new Set<string>()
        eventData.sub_events.forEach((se) => {
            getEligibleCategoriesBySubEvent(se.id).forEach((c) => allEligibleIds.add(c.id))
        })

        if (!allEligibleIds.has(categoryId)) return // prevent selecting ineligible category

        setCompetitionCategories(prev => {
            const competitionCats = prev[competitionId] || []
            const newCompetitionCats = competitionCats.includes(categoryId)
                ? competitionCats.filter(id => id !== categoryId)
                : [...competitionCats, categoryId]

            return {
                ...prev,
                [competitionId]: newCompetitionCats
            }
        })

        // Clear validation errors
        if (validationErrors.team?.categories) {
            const newErrors: ValidationErrors = { ...validationErrors }
            if (newErrors.team) delete newErrors.team.categories
            setValidationErrors(newErrors)
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
                ageCertificate: null,
                ageCertificatePreview: "",
                exhibitor: ""

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


    const handleAgeCertificateUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        if (!file.type.startsWith("image/")) {
            setValidationErrors((prev) => ({
                ...prev,
                [id]: { ...(prev[id] || {}), ageCertificate: "Please upload an image file" },
            }))
            return
        }
        if (file.size > 1 * 1024 * 1024) {
            setValidationErrors((prev) => ({
                ...prev,
                [id]: { ...(prev[id] || {}), ageCertificate: "File must be less than 1MB" },
            }))
            return
        }

        if (file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = (ev) => {
                updateRider(id, "ageCertificatePreview", (ev.target?.result as string) || "")
            }
            reader.readAsDataURL(file)
        } else {
            updateRider(id, "ageCertificatePreview", "PDF uploaded")
        }

        updateRider(id, "ageCertificate", file)

        if (validationErrors[id]?.ageCertificate) {
            const newErrors = { ...validationErrors }
            delete newErrors[id].ageCertificate
            if (Object.keys(newErrors[id]).length === 0) {
                delete newErrors[id]
            }
            setValidationErrors(newErrors)
        }
    }

    const triggerAgeCertificateUpload = (id: string) => {
        fileInputRefs.current[`${id}_age_cert`]?.click()
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
        if (min === null && max === null) return true
        if (min === null) return riderAge < max!
        if (max === null) return riderAge >= min

        // Age should be >= min and < max
        return riderAge >= min && riderAge < max
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

    const getEligibleCategoriesBySubEvent = useMemo(() => {
        return (subEventId: string) => {
            if (!eventData) return []
            const subEvent = eventData.sub_events.find((se) => se.id === subEventId)
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
            } else if (registrationType === "paired") {
                if (!areAllRidersInfoComplete(riders) || riders.length !== 2) return []
                const riderAges = riders.map((r) => calculateAge(r.dateOfBirth))

                return subEvent.categories.filter((cat) => {
                    // entry_type filter - paired can participate in mixed categories
                    if (!(cat.entry_type === "mixed")) return false

                    // paired gender filter
                    if (!isTeamGenderAllowed(cat.gender_restriction, riders)) return false

                    // paired age filter: require every rider to be eligible if min/max provided
                    const minAge = cat.min_age_years
                    const maxAge = cat.max_age_years
                    if (minAge != null || maxAge != null) {
                        const allOk = riderAges.every((age) => isAgeAllowed(minAge, maxAge, age))
                        if (!allOk) return false
                    }

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
    }, [eventData, registrationType, riders])

    // Prune selected categories if eligibility changes (across all sub-events)
    useEffect(() => {
        if (!eventData) return
        const allEligibleIds = new Set<string>()
        eventData.sub_events.forEach((se) => {
            getEligibleCategoriesBySubEvent(se.id).forEach((c) => allEligibleIds.add(c.id))
        })

        // Prune ineligible categories from all competitions
        setCompetitionCategories((prev) => {
            const updated = { ...prev }
            let hasChanges = false

            Object.keys(updated).forEach(competitionId => {
                const filteredCats = updated[competitionId].filter(id => allEligibleIds.has(id))
                if (filteredCats.length !== updated[competitionId].length) {
                    updated[competitionId] = filteredCats
                    hasChanges = true
                }
            })

            return hasChanges ? updated : prev
        })
    }, [eventData, getEligibleCategoriesBySubEvent])


    // Replace the calculateRiderTotal function with this:
    const calculateRiderTotal = (rider: RiderEntry): number => {
        if (!eventData) return 0

        let total = 0

        // Calculate based on competitions with selected categories
        Object.entries(competitionCategories).forEach(([competitionId, categoryIds]) => {
            if (categoryIds.length > 0) {
                if (registrationType === "individual") {
                    total += categoryIds.length * 1000 // ₹1000 per category for individual
                } else {
                    total += categoryIds.length * 2000 // ₹2000 per category for team/paired
                }
            }
        })

        return total
    }

    // Also update the calculateTotal function:
    const calculateTotal = () => {
        // For team and paired, the total is calculated once (not per rider)
        return calculateRiderTotal(riders[0])
    }

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {}
        let hasErrors = false

        if (registrationType === "team") {
            const teamErr: { name?: string; categories?: string } = {}
            if (!teamName.trim()) {
                teamErr.name = "Team name is required"
                hasErrors = true
            }

            // Check if at least one competition has categories selected
            const hasAnySelection = Object.values(competitionCategories).some(cats => cats.length > 0)
            if (!hasAnySelection) {
                teamErr.categories = "Please select at least one category for any competition"
                hasErrors = true
            }

            // Team size check for every selected category across all competitions
            if (eventData && hasAnySelection) {
                const allSelectedCategoryIds = getAllSelectedCategories()
                const allSelectedCategories = eventData.sub_events
                    .flatMap(se => se.categories)
                    .filter(cat => allSelectedCategoryIds.includes(cat.id))

                const invalidCats = allSelectedCategories.filter((c) => {
                    const minSize = c.min_size_of_team ?? 2
                    const maxSize = c.max_size_of_team ?? 100
                    return riders.length < minSize || riders.length > maxSize
                })

                if (invalidCats.length > 0) {
                    const msg = invalidCats.length === 1
                        ? `Team size must match ${invalidCats[0].category_name} requirements`
                        : "Team size must match all selected categories' requirements"
                    teamErr.categories = msg
                    hasErrors = true
                }
            }

            if (Object.keys(teamErr).length > 0) {
                errors.team = teamErr
            }
        } else if (registrationType === "paired") {
            const pairedErr: { name?: string; categories?: string } = {}
            if (!pairName.trim()) {
                pairedErr.name = "Pair name is required"
                hasErrors = true
            }
            if (riders.length !== 2) {
                pairedErr.categories = "Paired registration requires exactly 2 riders"
                hasErrors = true
            }
            if (Object.keys(pairedErr).length > 0) {
                errors.team = pairedErr
            }
        }

        // Individual and Paired validation
        if (registrationType === "individual" || registrationType === "paired") {
            const hasAnySelection = Object.values(competitionCategories).some(cats => cats.length > 0)
            if (!hasAnySelection) {
                if (!errors.team) errors.team = {}
                errors.team.categories = "Please select at least one category for any competition"
                hasErrors = true
            }

            // For paired, ensure exactly 2 riders
            if (registrationType === "paired" && riders.length !== 2) {
                if (!errors.team) errors.team = {}
                errors.team.categories = "Paired registration requires exactly 2 riders"
                hasErrors = true
            }
        }

        // Rider-level checks remain the same
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
            if (!rider.profileImage) {
                rErr.profileImage = "Profile image is required"
                hasErrors = true
            }

            if (!rider.ageCertificate) {
                rErr.ageCertificate = "Age certificate is required"
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

            if (rider.dateOfBirth && !rider.ageCategory) {
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

        setValidationErrors(errors)
        setShowValidationErrors(hasErrors)
        return !hasErrors
    }

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
            formData.append("pairName", registrationType === "paired" ? pairName : "")
            formData.append("parentName", parentName)
            formData.append("coachName", coachName)
            formData.append("totalFee", calculateTotal().toString())

            // Build event selections format for API
            const eventSelections = Object.entries(competitionCategories)
                .filter(([_, categoryIds]) => categoryIds.length > 0)
                .map(([competitionId, categoryIds]) => {
                    // Group categories by subEvent
                    const subEventGroups: { [subEventId: string]: string[] } = {}

                    categoryIds.forEach(categoryId => {
                        // Find which subEvent this category belongs to
                        const subEvent = eventData?.sub_events.find(se =>
                            se.categories.some(cat => cat.id === categoryId)
                        )
                        if (subEvent) {
                            if (!subEventGroups[subEvent.id]) {
                                subEventGroups[subEvent.id] = []
                            }
                            subEventGroups[subEvent.id].push(categoryId)
                        }
                    })

                    return {
                        competitionId,
                        subEvents: Object.entries(subEventGroups).map(([subEventId, catIds]) => ({
                            subEventId,
                            categoryIds: catIds
                        }))
                    }
                })

            formData.append("eventSelections", JSON.stringify(eventSelections))

            riders.forEach((rider, riderIndex) => {
                formData.append(`riders[${riderIndex}][name]`, rider.name)
                formData.append(`riders[${riderIndex}][efiId]`, rider.efiId)
                formData.append(`riders[${riderIndex}][dateOfBirth]`, rider.dateOfBirth)
                formData.append(`riders[${riderIndex}][gender]`, rider.gender)
                formData.append(`riders[${riderIndex}][ageCategory]`, rider.ageCategory)
                formData.append(`riders[${riderIndex}][phone]`, rider.phone)
                formData.append(`riders[${riderIndex}][email]`, rider.email)
                formData.append(`riders[${riderIndex}][password]`, rider.password);
                formData.append(`riders[${riderIndex}][exhibitor]`, rider.exhibitor);

                // Handle profile image uploads (existing code)
                const fileFromState = rider.profileImage
                const fileFromInput = fileInputRefs.current[rider.id]?.files?.[0] || null
                const fileToSend = fileFromState || fileFromInput

                if (fileToSend) {
                    if (registrationType === "individual") {
                        formData.append("file", fileToSend, fileToSend.name)
                    } else if (registrationType === "paired") {
                        formData.append(`riders[${riderIndex}][profileImage]`, fileToSend, fileToSend.name)
                    } else {
                        formData.append(`riders[${riderIndex}][profileImage]`, fileToSend, fileToSend.name)
                    }
                }

                // **ADD THIS BLOCK FOR AGE CERTIFICATE UPLOAD**
                const ageCertFromState = rider.ageCertificate
                const ageCertFromInput = fileInputRefs.current[`${rider.id}_age_cert`]?.files?.[0] || null
                const ageCertToSend = ageCertFromState || ageCertFromInput

                if (ageCertToSend) {
                    if (registrationType === "individual") {
                        formData.append("ageCertificate", ageCertToSend, ageCertToSend.name)
                    } else {
                        formData.append(`riders[${riderIndex}][ageCertificate]`, ageCertToSend, ageCertToSend.name)
                    }
                }
            })

            console.log("Form data:", Object.fromEntries(formData))

            await axios.post("http://localhost:5000/event-participants/register/4", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success("Registration submitted successfully!")
            onClose()
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
                    ageCertificate: null,
                    ageCertificatePreview: "",
                    exhibitor: ""

                },
            ])
            setTeamName("")
        } catch (err: any) {
            console.error("Registration error:", err)
            toast.error(err.response.data.message);
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
                    ageCertificate: null,
                    ageCertificatePreview: "",
                    exhibitor: ""

                },
            ])
            setTeamName("")
        } else if (registrationType === "paired") {
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
                    ageCertificate: null,
                    ageCertificatePreview: "",
                    exhibitor: ""

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
                    ageCertificate: null,
                    ageCertificatePreview: "",
                    exhibitor: ""

                },
            ])
            setTeamName("")
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
                    ageCertificate: null,
                    ageCertificatePreview: "",
                    exhibitor: ""

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
                    ageCertificate: null,
                    ageCertificatePreview: "",
                    exhibitor: ""
                },
            ])
        }
        // Reset competition categories
        setCompetitionCategories({})
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

    // Show categories for the currently active sub-event, but selection persists across tabs
    const categoriesToShow = getEligibleCategoriesBySubEvent(activeSubEvent)
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${registrationType === "paired" ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-300"
                                        }`}
                                    onClick={() => setRegistrationType("paired")}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={`p-3 rounded-lg ${registrationType === "paired" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <LuUsers className="w-6 h-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-medium text-gray-800">Pair</h4>
                                            <p className="text-sm text-gray-600 mt-1">Register as a pair (2 riders)</p>
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

                        {/* Pair Name Field (only for paired registration) */}
                        {registrationType === "paired" && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pair Name *</label>
                                <input
                                    type="text"
                                    value={pairName}
                                    onChange={(e) => setPairName(e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors.team?.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                    placeholder="Enter your pair name"
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

                        {/* Paired Registration Header */}
                        {registrationType === "paired" && (
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Paired Registration (2 Riders)</h3>
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
                                            {registrationType === "team" ? `Team Member #${index + 1}` :
                                                registrationType === "paired" ? `Rider #${index + 1}` : "Rider Information"}
                                            {rider.ageCategory && (
                                                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    Age: {rider.age}
                                                </span>
                                            )}
                                        </h4>
                                        {((registrationType === "team" && riders.length > 2) || (registrationType === "paired" && riders.length > 2)) && (
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Profile Image <span className="text-red-500">*</span>
                                            </label>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Please upload a profile image in JPG, JPEG, or PNG format with a maximum size of 1MB.
                                            </p>
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
                                                    onChange={(e) => {
                                                        const newDate = e.target.value
                                                        updateRider(rider.id, "dateOfBirth", newDate) // always update

                                                        if (registrationType === "paired" && riders[0]?.dateOfBirth && rider.id !== riders[0].id) {
                                                            const firstRiderYear = new Date(riders[0].dateOfBirth).getFullYear()
                                                            const secondRiderYear = new Date(newDate).getFullYear()

                                                            // check if second rider year is within ±1 year range
                                                            if (secondRiderYear < firstRiderYear - 1 || secondRiderYear > firstRiderYear + 1) {
                                                                setValidationErrors((prev) => ({
                                                                    ...prev,
                                                                    [rider.id]: {
                                                                        ...prev[rider.id],
                                                                        dateOfBirth:
                                                                            `Second rider must be born between ${firstRiderYear - 1} and ${firstRiderYear + 1}.`,
                                                                    },
                                                                }))
                                                            } else {
                                                                // clear error if valid
                                                                setValidationErrors((prev) => ({
                                                                    ...prev,
                                                                    [rider.id]: {
                                                                        ...prev[rider.id],
                                                                        dateOfBirth: "",
                                                                    },
                                                                }))
                                                            }
                                                        }
                                                    }}
                                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${validationErrors[rider.id]?.dateOfBirth
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-gray-300"
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
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Exhibitor</label>
                                                <input
                                                    type="text"
                                                    value={rider.exhibitor}
                                                    onChange={(e) => updateRider(rider.id, "exhibitor", e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                    placeholder="Enter exhibitor name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Age Certificate Upload */}
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Age Verification Document <span className="text-red-500">*</span>
                                        </label>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Please upload a valid government-issued ID (e.g., Aadhaar Card, PAN Card, Passport, etc.). Supported file formats: JPG, JPEG, and PNG Maximum file size: 1 MB
                                        </p>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => triggerAgeCertificateUpload(rider.id)}
                                                className={`px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors ${validationErrors[rider.id]?.ageCertificate
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <LuCamera className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {rider.ageCertificatePreview ? "Change Certificate" : "Upload Certificate"}
                                                    </span>
                                                </div>
                                            </button>
                                            {rider.ageCertificatePreview && (
                                                <span className="text-sm text-green-600">
                                                    {rider.ageCertificatePreview === "PDF uploaded" ? "PDF uploaded" : "Image uploaded"}
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={(el) => {
                                                fileInputRefs.current[`${rider.id}_age_cert`] = el
                                            }}
                                            onChange={(e) => handleAgeCertificateUpload(rider.id, e)}
                                            accept="image/*,.pdf"
                                            className="hidden"
                                        />
                                        {validationErrors[rider.id]?.ageCertificate && (
                                            <p className="text-red-500 text-xs mt-1">{validationErrors[rider.id].ageCertificate}</p>
                                        )}
                                    </div>

                                    {/* Competition Selection (only for individual registration) */}
                                    {registrationType === "individual" && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Competitions and Categories</h3>

                                            {/* Gate message if rider info incomplete */}
                                            {!isRiderInfoComplete(riders[0]) && (
                                                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg mb-4 text-sm text-amber-800">
                                                    Please fill Date of Birth and Gender for the rider to see eligible categories.
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                {visibleCompetitions.map((comp) => (
                                                    <div key={comp.id} className="border border-gray-200 rounded-lg p-6">
                                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                            <LuTrophy className="w-5 h-5 mr-2 text-pink-600" />
                                                            {comp.name}
                                                            <span className="ml-3 text-sm text-gray-500">
                                                                ({getCategoriesForCompetition(comp.id).length} categories selected)
                                                            </span>
                                                        </h4>

                                                        {/* Show message if rider info not complete */}
                                                        {!isRiderInfoComplete(riders[0]) ? (
                                                            <p className="text-gray-500 text-sm py-4">
                                                                Complete rider information to see available categories.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                {eventData.sub_events.map((subEvent) => {
                                                                    const eligibleCategories = getEligibleCategoriesBySubEvent(subEvent.id)
                                                                    if (eligibleCategories.length === 0) return null

                                                                    return (
                                                                        <div key={subEvent.id}>
                                                                            <h5 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2">
                                                                                {subEvent.name}
                                                                            </h5>
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                {eligibleCategories.map((category) => (
                                                                                    <label key={category.id} className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={getCategoriesForCompetition(comp.id).includes(category.id)}
                                                                                            onChange={() => toggleCategoryForCompetition(comp.id, category.id)}
                                                                                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                                                                                        />
                                                                                        <div className="flex-1">
                                                                                            <span className="text-sm font-medium text-gray-800">{category.category_name}</span>
                                                                                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                                                                {category.age_group && <div>Age: {category.age_group}</div>}
                                                                                                {category.gender_restriction && category.gender_restriction !== "mixed" && (
                                                                                                    <div>Gender: {category.gender_restriction}</div>
                                                                                                )}
                                                                                                {/* <div className="text-pink-600 font-medium">₹1,000</div> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {visibleCompetitions.length === 0 && (
                                                    <div className="text-center py-8 text-gray-500">
                                                        No competitions available within event dates.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Validation Error for Individual */}
                                            {validationErrors.team?.categories && (
                                                <p className="text-red-500 text-sm mt-2">{validationErrors.team.categories}</p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Competition Selection (for paired registration) */}
                        {registrationType === "paired" && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Paired Competitions and Categories</h3>

                                {/* Gate message if paired info incomplete */}
                                {!areAllRidersInfoComplete(riders) && (
                                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg mb-4 text-sm text-amber-800">
                                        Please fill Date of Birth and Gender for both riders to see eligible categories.
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {visibleCompetitions.map((comp) => (
                                        <div key={comp.id} className="border border-gray-200 rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <LuTrophy className="w-5 h-5 mr-2 text-pink-600" />
                                                {comp.name}
                                                <span className="ml-3 text-sm text-gray-500">
                                                    ({getCategoriesForCompetition(comp.id).length} categories selected)
                                                </span>
                                            </h4>

                                            {/* Show message if paired info not complete */}
                                            {!areAllRidersInfoComplete(riders) ? (
                                                <p className="text-gray-500 text-sm py-4">
                                                    Complete both riders' information to see available categories.
                                                </p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {eventData.sub_events.map((subEvent) => {
                                                        const eligibleCategories = getEligibleCategoriesBySubEvent(subEvent.id)
                                                        if (eligibleCategories.length === 0) return null

                                                        return (
                                                            <div key={subEvent.id}>
                                                                <h5 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2">
                                                                    {subEvent.name}
                                                                </h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {eligibleCategories.map((category) => (
                                                                        <label key={category.id} className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={getCategoriesForCompetition(comp.id).includes(category.id)}
                                                                                onChange={() => toggleCategoryForCompetition(comp.id, category.id)}
                                                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                                                                            />
                                                                            <div className="flex-1">
                                                                                <span className="text-sm font-medium text-gray-800">{category.category_name}</span>
                                                                                <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                                                    {category.age_group && <div>Age: {category.age_group}</div>}
                                                                                    {category.gender_restriction && category.gender_restriction !== "mixed" && (
                                                                                        <div>Gender: {category.gender_restriction}</div>
                                                                                    )}
                                                                                    {/* <div className="text-pink-600 font-medium">₹1,000</div> */}
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {visibleCompetitions.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No competitions available within event dates.
                                        </div>
                                    )}
                                </div>

                                {/* Validation Error for Paired */}
                                {validationErrors.team?.categories && (
                                    <p className="text-red-500 text-sm mt-2">{validationErrors.team.categories}</p>
                                )}
                            </div>
                        )}

                        {/* Competition Selection (for team registration) */}
                        {registrationType === "team" && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Team Competitions and Categories</h3>

                                {/* Gate message if team info incomplete */}
                                {!areAllRidersInfoComplete(riders) && (
                                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg mb-4 text-sm text-amber-800">
                                        Please fill Date of Birth and Gender for all team members to see eligible categories.
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {visibleCompetitions.map((comp) => (
                                        <div key={comp.id} className="border border-gray-200 rounded-lg p-6">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <LuTrophy className="w-5 h-5 mr-2 text-pink-600" />
                                                {comp.name}
                                                <span className="ml-3 text-sm text-gray-500">
                                                    ({getCategoriesForCompetition(comp.id).length} categories selected)
                                                </span>
                                            </h4>

                                            {/* Show message if team info not complete */}
                                            {!areAllRidersInfoComplete(riders) ? (
                                                <p className="text-gray-500 text-sm py-4">
                                                    Complete all team members' information to see available categories.
                                                </p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {eventData.sub_events.map((subEvent) => {
                                                        const eligibleCategories = getEligibleCategoriesBySubEvent(subEvent.id)
                                                        if (eligibleCategories.length === 0) return null

                                                        return (
                                                            <div key={subEvent.id}>
                                                                <h5 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2">
                                                                    {subEvent.name}
                                                                </h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {eligibleCategories.map((category) => (
                                                                        <label key={category.id} className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={getCategoriesForCompetition(comp.id).includes(category.id)}
                                                                                onChange={() => toggleCategoryForCompetition(comp.id, category.id)}
                                                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                                                                            />
                                                                            <div className="flex-1">
                                                                                <span className="text-sm font-medium text-gray-800">{category.category_name}</span>
                                                                                <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                                                    {category.age_group && <div>Age: {category.age_group}</div>}
                                                                                    {category.gender_restriction && category.gender_restriction !== "mixed" && (
                                                                                        <div>Gender: {category.gender_restriction}</div>
                                                                                    )}
                                                                                    <div>Team size: {category.min_size_of_team ?? 2}-{category.max_size_of_team ?? 100} members</div>
                                                                                    {/* <div className="text-pink-600 font-medium">₹1,000</div> */}
                                                                                </div>
                                                                            </div>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {visibleCompetitions.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No competitions available within event dates.
                                        </div>
                                    )}
                                </div>

                                {/* Validation Error for Team */}
                                {validationErrors.team?.categories && (
                                    <p className="text-red-500 text-sm mt-2">{validationErrors.team.categories}</p>
                                )}
                            </div>
                        )}

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
                                        {Object.entries(competitionCategories).reduce((total, [_, categoryIds]) =>
                                            total + categoryIds.length, 0
                                        )} total category selections × ₹{registrationType === "individual" ? "1000" : "2000"}
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
        </AnimatePresence>
    )
}

export default RegistrationFormModal
