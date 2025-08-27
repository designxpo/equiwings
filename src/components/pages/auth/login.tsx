"use client"
import axiosInstance from '@/lib/config/axios';
import { useCustomerAuth } from '@/providers/customer-auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import validator from 'validator';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useCustomerAuth();
    const router = useRouter();

    const validateField = (name: string, value: string) => {
        let error = '';

        switch (name) {
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!validator.isEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!value.trim()) {
                    error = 'Password is required';
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
    const handleSubmit = async () => {
        // Validate all fields
        const newErrors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password)
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);
            try {
                const res = await axiosInstance.post('/customers/auth/login', formData);
                login(res.data.token);
                router.push('/sports-retail');
                toast.success(res.data.message || 'Login successful!');
            } catch (error: any) {
                toast.error(error.response.data.error || 'Login failed!');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.log('Login form has errors:', newErrors);
        }
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

                            {/* Forgot Password Link */}
                            <div className="text-center">
                                <span
                                    className="text-yellow-400 hover:text-yellow-300 text-sm hover:underline transition-colors duration-200"
                                >
                                    Forgot Password?
                                </span>
                            </div>

                            {/* New User Registration Link */}
                            <p className="text-center text-[#D2A679] text-sm mt-4">
                                Don't have an account yet? <Link className='hover:underline font-bold' href="/signup">Register</Link>
                            </p>

                            {/* Submit Button */}
                            <div className="w-full flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="w-fit mt-8 py-2 px-12 hover:cursor-pointer bg-cardinal-pink-800 hover:bg-cardinal-pink-900 text-white text-md sm:text-xl rounded-full transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cardinal-pink-900 focus:ring-opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Login'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;