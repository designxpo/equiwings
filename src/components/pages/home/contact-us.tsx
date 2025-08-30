"use client"
import axiosInstance from '@/lib/config/axios';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
        countryCode: '91'
    });

    const [errors, setErrors] = useState({
        firstName: '',
        email: '',
        phoneNumber: '',
        message: ''
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateField = (name: string, value: string): string => {
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
                    error = 'Please enter a valid phone number';
                }
                break;
            case 'message':
                if (!value.trim()) {
                    error = 'Message is required';
                } else if (value.trim().length < 10) {
                    error = 'Message must be at least 10 characters';
                } else if (value.trim().length > 500) {
                    error = 'Message must be less than 500 characters';
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setIsSubmitting(true);

        // Validate all fields
        const newErrors = {
            firstName: validateField('firstName', formData.firstName),
            email: validateField('email', formData.email),
            phoneNumber: validateField('phoneNumber', formData.phoneNumber),
            message: validateField('message', formData.message)
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            try {
                const res = await axiosInstance.post('/customers/contact', formData);
                toast.success('Message sent successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    message: '',
                    countryCode: '91'
                });
            } catch (error) {
                toast.error('Failed to send message');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            toast.error('Please fix the errors!');
            setIsSubmitting(false);
        }
    };

    const getInputClasses = (fieldName: string) => {
        const baseClasses = "w-full px-2 sm:px-3 py-2 border-white rounded-lg text-white placeholder-gray-300 focus:outline-none transition-all duration-200";
        const hasError = errors[fieldName as keyof typeof errors];

        if (hasError) {
            return `${baseClasses} bg-gray-600 border-yellow-500 focus:border-yellow-500`;
        } else {
            return `${baseClasses} bg-gray-600 border-purple-600 focus:border-purple-400 focus:bg-opacity-50`;
        }
    };

    const getTextareaClasses = (fieldName: string) => {
        const baseClasses = "w-full px-2 sm:px-3 py-2 border-white rounded-lg text-white placeholder-gray-300 focus:outline-none transition-all duration-200 resize-none";
        const hasError = errors[fieldName as keyof typeof errors];

        if (hasError) {
            return `${baseClasses} bg-gray-600 border-yellow-500 focus:border-yellow-500`;
        } else {
            return `${baseClasses} bg-gray-600 border-purple-600 focus:border-purple-400 focus:bg-opacity-50`;
        }
    };

    return (
        <section>
            <div className="relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
                <div className="max-w-screen-xl mx-auto z-10 flex flex-col items-center justify-center py-20 px-6 sm:px-8 min-h-screen lg:px-16">
                    {/* Logo and Title - Centered */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <Image src="/assets/images/white-logo.png" width={250} height={250} alt="white-logo" className="w-48 sm:w-60 lg:w-[250px] h-auto" />
                            </div>
                        </div>
                        {/* Heading */}
                        <h1 className="text-white text-3xl md:text-5xl leading-tight mb-2">
                            Contact Us
                        </h1>
                    </div>

                    {/* Form - Centered */}
                    <div className="w-full max-w-md">
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
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
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
                                            className="relative flex items-center px-4 py-2.5 bg-gray-600 text-center border-white rounded-l-lg border-r-1 hover:bg-gray-500 transition-colors duration-200"
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
                                                        <span className="text-gray-300 ">{`+${country.code}`}</span>
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
                                        className={`flex-1 w-full px-4 sm:px-5 py-2.5 rounded-r-lg text-white placeholder-gray-300 focus:outline-none transition-all duration-200 ${errors.phoneNumber
                                            ? 'bg-gray-600 border-yellow-500 focus:border-yellow-500'
                                            : 'bg-gray-600 border-white focus:bg-opacity-50'
                                            }`}
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="text-yellow-500 text-sm mt-1 text-center">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <textarea
                                    name="message"
                                    placeholder="Enter your message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={getTextareaClasses('message')}
                                />
                                {errors.message && (
                                    <p className="text-yellow-500 text-sm mt-1 text-center">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full mt-6 py-3 hover:cursor-pointer bg-cardinal-pink-800 hover:bg-cardinal-pink-900 text-white rounded-full transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cardinal-pink-900 focus:ring-opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactUs;