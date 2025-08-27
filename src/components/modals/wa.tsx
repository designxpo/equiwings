import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaCopy, FaTimes, FaWhatsapp } from "react-icons/fa";

interface Review {
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  _id: string;
}

interface Product {
  ratings: {
    average: number;
    count: number;
  };
  _id: string;
  productId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sizes: string[];
  colors: string[];
  quantity: number;
  mainImage: string;
  additionalImages: string[];
  isActive: boolean;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  inCart: boolean;
}

// Cart Item type for multiple products
type CartItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
    productId?: string;
  };
  quantity: number;
  size: string;
  color: string;
  price: number;
};

// Updated BuyNowModal props to handle both single product and cart items
interface BuyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  // For single product
  product?: Product;
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
  // For multiple cart items
  cartItems?: CartItem[];
}

const BuyNowModal = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity,
  cartItems
}: BuyNowModalProps) => {

  const handleProceed = () => {
    let whatsappMessage = '';

    if (cartItems && cartItems.length > 0) {
      // Handle multiple cart items
      const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      whatsappMessage = `I want to purchase these products from my cart:

${cartItems.map((item, index) => `${index + 1}. Product: ${item.product.name}
   ${item.product.productId ? `Product ID: *${item.product.productId}*` : ''}
   Price: $${item.price}
   Size: ${item.size}
   Color: ${item.color}
   Quantity: ${item.quantity}
   Subtotal: $${(item.price * item.quantity).toFixed(2)}`).join('\n\n')}

*Total Amount: $${totalAmount.toFixed(2)}*

Please confirm availability and payment options.`;
    } else if (product) {
      // Handle single product
      whatsappMessage = `I want to purchase this product:
    
Product: ${product.name}
Product ID: *${product.productId}*
Price: $${product.price}
${selectedSize ? `Size: ${selectedSize}` : ''}
${selectedColor ? `Color: ${selectedColor}` : ''}
Quantity: ${quantity}
Total: $${(product.price * (quantity || 1)).toFixed(2)}

Please confirm availability and payment options.`;
    }

    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/7233809716?text=${encodedMessage}`, '_blank');
    onClose();
  };

  // Calculate total and prepare order summary
  const getOrderSummary = () => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return {
        isMultiple: true,
        total,
        itemCount: cartItems.length,
        items: cartItems
      };
    } else if (product) {
      return {
        isMultiple: false,
        total: product.price * (quantity || 1),
        itemCount: 1,
        product,
        selectedSize,
        selectedColor,
        quantity: quantity || 1
      };
    }
    return null;
  };

  const orderSummary = getOrderSummary();

  if (!orderSummary) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Complete Purchase</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Order Summary {orderSummary.isMultiple && `(${orderSummary.itemCount} items)`}
                </h4>

                {orderSummary.isMultiple ? (
                  // Multiple items from cart
                  <div className="space-y-3">
                    {cartItems!.map((item, index) => (
                      <div key={item._id} className="text-sm text-gray-600 border-b border-gray-200 pb-2 last:border-b-0">
                        <p className="font-medium text-gray-900">{index + 1}. {item.product.name}</p>
                        <p><span className="font-medium">Price:</span> ${item.price}</p>
                        <p><span className="font-medium">Size:</span> {item.size}</p>
                        <p><span className="font-medium">Color:</span> {item.color}</p>
                        <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                        <p className="font-medium text-purple-600">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single product
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Product:</span> {product!.name}</p>
                    <p><span className="font-medium">Price:</span> ${product!.price}</p>
                    {selectedSize && <p><span className="font-medium">Size:</span> {selectedSize}</p>}
                    {selectedColor && <p><span className="font-medium">Color:</span> {selectedColor}</p>}
                    <p><span className="font-medium">Quantity:</span> {quantity}</p>
                  </div>
                )}

                <div className="border-t pt-2 mt-3">
                  <p className="font-bold text-gray-900">Total: ${orderSummary.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>You will be redirected to WhatsApp to complete your purchase with our team.</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceed}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-cardinal-pink-900 text-white rounded-lg font-medium hover:bg-cardinal-pink-950 transition-colors"
              >
                <FaWhatsapp size={20} />
                <span>Proceed to WhatsApp</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Share Modal Component remains unchanged
export const ShareModal = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity
}: {
  isOpen: boolean,
  onClose: () => void,
  product: Product,
  selectedSize: string,
  selectedColor: string,
  quantity: number
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const productUrl = `${window.location.origin}/sports-retail/${product.productId}`;

  const whatsappMessage = `Check out this amazing product!
  
${product.name}
Price: $${product.price}
${selectedSize ? `Size: ${selectedSize}` : ''}
${selectedColor ? `Color: ${selectedColor}` : ''}
${quantity > 1 ? `Quantity: ${quantity}` : ''}

${product.description}

View here: ${productUrl}`;

  const handleWhatsAppShare = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopySuccess(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Share Product</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-cardinal-pink-900 text-white rounded-lg font-medium hover:bg-cardinal-pink-950 transition-colors"
              >
                <FaWhatsapp size={20} />
                <span>Share via WhatsApp</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {copySuccess ? <FaCheck size={20} /> : <FaCopy size={20} />}
                <span>{copySuccess ? 'Link Copied!' : 'Copy Link'}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default BuyNowModal