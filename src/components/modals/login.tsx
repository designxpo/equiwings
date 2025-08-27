import { motion } from "framer-motion";
import Link from "next/link";
import { FiX, FiShoppingCart } from "react-icons/fi";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl border-2 border-cardinal-pink-900"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mb-4">
            <FiShoppingCart className="w-16 h-16 mx-auto text-cardinal-pink-900 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
            <p className="text-gray-600">You need to login to add items to your cart</p>
          </div>

          <Link
            href="/login"
            className="block w-full bg-cardinal-pink-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-cardinal-pink-700 transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;