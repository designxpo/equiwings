"use client"
import axiosInstance from '@/lib/config/axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';
import OtpModal from './otp-verify';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        countryCode: '91'
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verifyOtp, setVerifyOtp] = useState(false);

    const countryCodes = [
        { code: '1', country: 'US' },
        { code: '44', country: 'UK' },
        { code: '91', country: 'IN' },
        { code: '86', country: 'CN' },
        { code: '81', country: 'JP' },
        { code: '49', country: 'DE' },
        { code: '33', country: 'FR' },
        { code: '61', country: 'AU' },
        { code: '7', country: 'RU' },
        { code: '55', country: 'BR' }
    ];

    const validateField = (name: string, value: string) => {
        let error = '';

        switch (name) {
            case 'firstName':
                if (!value.trim()) {
                    error = 'First name is required';
                } else if (value.trim().length < 2) {
                    error = 'First name must be at least 2 characters';
                } else if (!validator.isAlpha(value.replace(/\s/g, ''))) {
                    error = 'First name should only contain letters';
                }
                break;
            case 'lastName':
                if (!value.trim()) {
                    error = 'Last name is required';
                } else if (value.trim().length < 2) {
                    error = 'Last name must be at least 2 characters';
                } else if (!validator.isAlpha(value.replace(/\s/g, ''))) {
                    error = 'Last name should only contain letters';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!validator.isEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'phoneNumber':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else if (!validator.isMobilePhone(value, 'any')) {
                    error = 'Please enter a valid phoneNumber number';
                }
                break;
            case 'password':
                if (!value.trim()) {
                    error = 'Password is required';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters';
                } else if (!validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })) {
                    error = 'Password must contain uppercase, lowercase, number and symbol';
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate field on change
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleCountryCodeSelect = (code: string) => {
        setFormData(prev => ({
            ...prev,
            countryCode: code
        }));
        setIsDropdownOpen(false);
    };

    const handleSubmit = async () => {
        // Validate all fields
        const newErrors = {
            firstName: validateField('firstName', formData.firstName),
            lastName: validateField('lastName', formData.lastName),
            email: validateField('email', formData.email),
            phoneNumber: validateField('phoneNumber', formData.phoneNumber),
            password: validateField('password', formData.password)
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);
            try {
                const res = await axiosInstance.post('/customers/auth/register', formData);
                setVerifyOtp(res.data.isOtpSent);
                toast.success(res.data.message || 'Registration successful!');
            } catch (error: any) {
                toast.error(error.response.data.error || 'Registration failed!');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            toast.error('Please fix the errors!');
        }
    };


    const handleOtpSuccess = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            countryCode: '91'
        });
        setVerifyOtp(false);
        toast.success('Registration completed successfully!');
    };

    const handleOtpClose = () => {
        setVerifyOtp(false);
    };

    const getInputClasses = (fieldName: string) => {
        const baseClasses = "w-full px-3 py-2 text-center rounded-lg text-white placeholder-gray-300 focus:outline-none transition-all duration-200";
        const hasError = errors[fieldName as keyof typeof errors];

        if (hasError) {
            return `${baseClasses} bg-gray-600 border-yellow-500 focus:border-yellow-500`;
        } else {
            return `${baseClasses} bg-gray-600 border-purple-600 focus:border-purple-400 focus:bg-opacity-50`;
        }
    };

    return (
        <section>
            <div className="relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover min-h-screen">
                <div className="max-w-screen-xl mx-auto z-10 flex flex-col items-center justify-center py-20 px-4 sm:px-8 lg:px-16">
                    {/* Logo and Title - Centered */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <Image src="/assets/images/white-logo.png" width={250} height={250} alt="white-logo" className="w-48 sm:w-60 lg:w-[250px] h-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Form - Centered */}
                    <div className="w-full max-w-lg">
                        <div className="space-y-4">
                            {/* First Name and Last Name Row */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={getInputClasses('firstName')}
                                    />
                                    {errors.firstName && (
                                        <p className="text-yellow-500 text-sm mt-1 text-center">{errors.firstName}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={getInputClasses('lastName')}
                                    />
                                    {errors.lastName && (
                                        <p className="text-yellow-500 text-sm mt-1 text-center">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={getInputClasses('email')}
                                />
                                {errors.email && (
                                    <p className="text-yellow-500 text-sm mt-1 text-center">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Number with Country Code */}
                            <div>
                                <div className="flex relative">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="relative flex items-center px-3 py-2 bg-gray-600 text-center border-purple-600 rounded-l-lg border-r-0 hover:bg-gray-500 transition-colors duration-200"
                                        >
                                            <span className="text-gray-300 mr-2">{`+${formData.countryCode}`}</span>
                                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Country Code Dropdown */}
                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1 w-32 bg-gray-600 border-gray-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                                                {countryCodes.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        onClick={() => handleCountryCodeSelect(country.code)}
                                                        className="w-full flex items-center justify-center px-3 py-2 text-center hover:bg-gray-500 text-white transition-colors duration-200 border-b border-gray-700 last:border-b-0"
                                                    >
                                                        <span className="text-gray-300">{`+${country.code}`}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className={`flex-1 px-3 py-2 text-center rounded-r-lg text-white placeholder-gray-300 focus:outline-none transition-all duration-200 ${errors.phoneNumber
                                            ? 'bg-gray-600 border-yellow-500 focus:border-yellow-500'
                                            : 'bg-gray-600 border-purple-600 focus:border-purple-400 focus:bg-opacity-50'
                                            }`}
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="text-yellow-500 text-sm mt-1 text-center">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={getInputClasses('password')}
                                />
                                {errors.password && (
                                    <p className="text-yellow-400 text-sm mt-1 text-center">{errors.password}</p>
                                )}
                            </div>

                            <p className="text-center text-[#D2A679] text-sm mt-4">
                                Already have an account? <Link className='hover:underline font-bold' href="/login">Log In</Link>
                            </p>



                            {/* Submit Button */}
                            <div className="w-full flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-fit mt-8 py-2 px-12 hover:cursor-pointer bg-cardinal-pink-800 hover:bg-cardinal-pink-900 text-white text-md sm:text-xl rounded-full transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cardinal-pink-900 focus:ring-opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OtpModal
                isOpen={verifyOtp}
                onClose={handleOtpClose}
                email={formData.email}
                onSuccess={handleOtpSuccess}
            />
        </section>
    );
}

export default Register;



