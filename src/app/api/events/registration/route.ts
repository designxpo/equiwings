// app/api/registrations/route.ts
import { authenticate, authorize } from '@/lib/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connection'
import Registration from '@/lib/models/EventRegistration'
import { validateRegistrationData, processRiders } from '@/lib/utils/registration'

export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await authorize(user, "REGISTRATION", "CREATE")
        await connectDB()

        const body = await request.json()
        
        // Validate the request data
        const validationErrors = validateRegistrationData(body)
        if (validationErrors.length > 0) {
            return NextResponse.json(
                { 
                    error: 'Validation failed',
                    details: validationErrors
                },
                { status: 400 }
            )
        }

        // Process riders with age calculation
        const processedRiders = processRiders(body.riders)

        // Calculate total fee
        const baseRate = body.registrationType === 'team' ? 2000 : 1000
        const totalFee = baseRate * body.events.length

        // Create registration object
        const registrationData = {
            competitionType: body.competitionType,
            registrationType: body.registrationType,
            teamName: body.registrationType === 'team' ? body.teamName?.trim() : undefined,
            riders: processedRiders,
            events: body.events,
            parentName: body.parentName?.trim() || '',
            coachName: body.coachName?.trim() || '',
            totalFee,
            createdBy: user.id
        }

        const registration = new Registration(registrationData)
        const savedRegistration = await registration.save()

        return NextResponse.json(
            {
                success: true,
                message: 'Registration submitted successfully',
                data: {
                    registrationNumber: savedRegistration.registrationNumber,
                    id: savedRegistration._id,
                    competitionType: savedRegistration.competitionType,
                    registrationType: savedRegistration.registrationType,
                    teamName: savedRegistration.teamName,
                    totalFee: savedRegistration.totalFee,
                    gstAmount: savedRegistration.gstAmount,
                    finalAmount: savedRegistration.finalAmount,
                    status: savedRegistration.status,
                    paymentStatus: savedRegistration.paymentStatus,
                    eventCount: savedRegistration.events.length,
                    riderCount: savedRegistration.riders.length,
                    createdAt: savedRegistration.createdAt
                }
            },
            { status: 201 }
        )

    } catch (error: any) {
        console.error('Registration submission error:', error)

        // Handle duplicate registration number
        if (error.code === 11000 && error.keyPattern?.registrationNumber) {
            return NextResponse.json(
                {
                    error: 'Registration processing failed. Please try again.',
                    details: 'Duplicate registration number generated'
                },
                { status: 500 }
            )
        }

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message)
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationErrors
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                error: error.message || 'Registration submission failed'
            },
            { 
                status: error.message === "Authentication failed" ? 401 : 
                       error.message === "Authorization failed" ? 403 : 500 
            }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await authorize(user, "REGISTRATION", "READ")
        await connectDB()

        const { searchParams } = new URL(request.url)
        const competitionType = searchParams.get('competitionType')
        const registrationType = searchParams.get('registrationType')
        const status = searchParams.get('status')
        const paymentStatus = searchParams.get('paymentStatus')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''

        // Build filter object
        const filter: any = {}
        
        if (competitionType) filter.competitionType = competitionType
        if (registrationType) filter.registrationType = registrationType
        if (status) filter.status = status
        if (paymentStatus) filter.paymentStatus = paymentStatus

        // Add search functionality
        if (search) {
            filter.$or = [
                { 'riders.name': { $regex: search, $options: 'i' } },
                { teamName: { $regex: search, $options: 'i' } },
                { registrationNumber: { $regex: search, $options: 'i' } }
            ]
        }

        // If not admin, only show user's registrations
        if (!user.role || user.role.name !== 'ADMIN') {
            filter.createdBy = user.id
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Execute query with pagination
        const [registrations, totalCount] = await Promise.all([
            Registration.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'name email')
                .lean(),
            Registration.countDocuments(filter)
        ])

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return NextResponse.json({
            success: true,
            data: {
                registrations,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage,
                    hasPrevPage
                }
            }
        })

    } catch (error: any) {
        console.error('Get registrations error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch registrations' },
            { 
                status: error.message === "Authentication failed" ? 401 : 
                       error.message === "Authorization failed" ? 403 : 500 
            }
        )
    }
}