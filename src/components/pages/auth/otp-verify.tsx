"use client"
import { useState, useRef, useEffect } from 'react';
import axiosInstance from '@/lib/config/axios';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '@/providers/customer-auth-context';
import { useRouter } from 'next/navigation';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onSuccess: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, email, onSuccess }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { login } = useCustomerAuth();
    const router = useRouter();

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Reset OTP when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setCountdown(30); // 30 second countdown
            // Focus first input
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < 6; i++) {
            newOtp[i] = pastedData[i] || '';
        }

        setOtp(newOtp);

        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex(val => val === '');
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            toast.error('Please enter complete OTP');
            return;
        }

        setIsVerifying(true);
        try {
            const res = await axiosInstance.post('/customers/auth/verify-email', {
                email,
                otp: otpString
            });

            toast.success(res.data.message || 'OTP verified successfully!');
            login(res.data.token);
            router.push('/sports-retail');

            onSuccess();
            onClose();

        } catch (error: any) {
            toast.error(error.response?.data?.error || 'OTP verification failed!');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            const res = await axiosInstance.post('/customers/auth/resend-otp', {
                email,
            });

            toast.success(res.data.message || 'OTP resent successfully!');
            setCountdown(30);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to resend OTP!');
        } finally {
            setIsResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 ${isOpen ? "bg-black/50" : "bg-black"} bg-opacity-50 flex items-center justify-center z-50 p-4`}>
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative border border-gray-700">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                    <p className="text-gray-800 text-sm">
                        Enter the 6-digit code sent to your email and phone
                    </p>
                </div>

                {/* OTP Input Fields */}
                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-xl font-bold bg-white border border-gray-600 rounded-lg text-gray-800 focus:outline-none focus:border-cardinal-pink-800 focus:ring-2 focus:ring-cardinal-pink-800 focus:ring-opacity-50 outline-none active:border-cardinal-pink-800 transition-all duration-200"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || otp.join('').length !== 6}
                    className="w-full py-3 bg-cardinal-pink-800 hover:bg-cardinal-pink-900 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cardinal-pink-900 focus:ring-opacity-50 mb-4"
                >
                    {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                    {countdown > 0 ? (
                        <p className="text-gray-500 text-sm">
                            Resend OTP in {countdown}s
                        </p>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="text-cardinal-pink-800 hover:text-cardinal-pink-700 font-semibold text-sm transition-colors duration-200 disabled:opacity-50"
                        >
                            {isResending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpModal;