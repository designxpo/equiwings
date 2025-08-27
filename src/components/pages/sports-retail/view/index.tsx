"use client"
import axiosInstance from '@/lib/config/axios';
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaTruck, FaUndo, FaChevronLeft, FaChevronRight, FaTimes, FaWhatsapp, FaCopy, FaCheck } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdVerified } from 'react-icons/md';
import { FaShield } from 'react-icons/fa6';
import { useCustomerAuth } from '@/providers/customer-auth-context';
import toast from 'react-hot-toast';
import { ShareModal } from '@/components/modals/wa';
import BuyNowModal from '@/components/modals/wa';
import LoginModal from '@/components/modals/login';

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

interface ProductResponse {
  product: Product;
}

interface SimilarProductsResponse {
  products: Product[];
  pagination?: {
    pages: number;
    currentPage: number;
    totalProducts: number;
  };
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} className="text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
  }

  return <div className="flex items-center">{stars}</div>;
};

// Image Gallery Component
const ImageGallery = ({ images, productName }: { images: string[], productName: string }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group">
        <img
          src={images[selectedImageIndex] || images[0]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSfFF9UFTnrQIB3tvlzBH4S9gOszZ7CqnR53afJPf0kJ-WGH8Fkje1-ecptKRe9Lyuz_f4g8KwsFDHXQx74YNbeiQa43RrLkJ4DnxFyMzeMcbmSWIS3UCr3GQ&usqp=CAc";
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transition-all ${selectedImageIndex === index ? 'ring-2 ring-cardinal-pink-900' : ''
                }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover hover:opacity-75 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSfFF9UFTnrQIB3tvlzBH4S9gOszZ7CqnR53afJPf0kJ-WGH8Fkje1-ecptKRe9Lyuz_f4g8KwsFDHXQx74YNbeiQa43RrLkJ4DnxFyMzeMcbmSWIS3UCr3GQ&usqp=CAc";
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Similar Product Card Component
const SimilarProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => window.location.href = `/product/${product._id}`}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSfFF9UFTnrQIB3tvlzBH4S9gOszZ7CqnR53afJPf0kJ-WGH8Fkje1-ecptKRe9Lyuz_f4g8KwsFDHXQx74YNbeiQa43RrLkJ4DnxFyMzeMcbmSWIS3UCr3GQ&usqp=CAc";
          }}
        />
        {product.inCart && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Cart
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-cardinal-pink-900 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-1 mb-2">
          <StarRating rating={product.ratings.average} />
          <span className="text-sm text-gray-600">
            ({product.ratings.count})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Review Component
const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cardinal-pink-900 to-cardinal-pink-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {review.reviewerName.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </motion.div>
  );
};

// Main Component
export default function ProductDescription({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Similar products state
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarPage, setSimilarPage] = useState(1);
  const [similarTotalPages, setSimilarTotalPages] = useState(1);
  const [similarLimit] = useState(4);
  const { isAuthenticated, fetchCart } = useCustomerAuth();

  const fetchProductDescription = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/customers/products/${productId}`);
      const data: ProductResponse = response.data;
      setProduct(data.product);
      if (data.product.sizes.length > 0) {
        setSelectedSize(data.product.sizes[0]);
      }
      if (data.product.colors.length > 0) {
        setSelectedColor(data.product.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProducts = async (page: number = 1) => {
    if (!product) return;

    try {
      setSimilarLoading(true);
      const url = `/customers/products?page=${page}&limit=${similarLimit}&category=${encodeURIComponent(product.category)}`;
      const response = await axiosInstance.get(url);
      const data: SimilarProductsResponse = response.data;

      const filteredProducts = data.products.filter(p => p._id !== product._id);
      setSimilarProducts(filteredProducts);

      if (data.pagination?.pages) {
        setSimilarTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching similar products:', error);
    } finally {
      setSimilarLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDescription();
  }, [productId]);

  useEffect(() => {
    if (product) {
      fetchSimilarProducts(1);
      setSimilarPage(1);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return
    }

    try {
      const res = await axiosInstance.post(`/customers/products/${product?._id}/cart`, {
        size: selectedSize,
        color: selectedColor,
        quantity,
        productId: product?._id
      });
      toast.success("Added to cart!");
      fetchCart();
      if (product) {
        setProduct({ ...product, inCart: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add item to cart");
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return
    }
    setShowBuyNowModal(true);
  };

  const handleSimilarPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= similarTotalPages) {
      setSimilarPage(newPage);
      fetchSimilarProducts(newPage);
    }
  };

  const allImages = product ? [product.mainImage, ...product.additionalImages] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <BiLoaderAlt className="text-6xl text-cardinal-pink-900" />
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageGallery images={allImages} productName={product.name} />
          </motion.div>

          {/* Product Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title and Category */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-4 py-2 text-sm font-medium text-cardinal-pink-900 bg-yellow-300 rounded-full mb-4"
              >
                {product.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
              >
                {product.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg leading-relaxed"
              >
                {product.description}
              </motion.p>
            </div>

            {/* Rating and Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-4"
            >
              <StarRating rating={product.ratings.average} />
              <span className="text-sm text-gray-600">
                ({product.ratings.count} review{product.ratings.count !== 1 ? 's' : ''})
              </span>
              <div className="flex items-center space-x-1">
                <MdVerified className="text-green-500" />
                <span className="text-sm text-green-600">Verified Purchase</span>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-4"
            >
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              <span className="text-lg text-gray-500 line-through">$499</span>
              <span className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-full">23% OFF</span>
            </motion.div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${selectedSize === size
                        ? 'border-cardinal-pink-900 bg-cardinal-pink-900 text-white shadow-lg'
                        : 'border-gray-300 text-gray-700 hover:border-cardinal-pink-900 hover:text-cardinal-pink-900'
                        }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-gray-900">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${selectedColor === color
                        ? 'border-cardinal-pink-900 bg-cardinal-pink-900 text-white shadow-lg'
                        : 'border-gray-300 text-gray-700 hover:border-cardinal-pink-900 hover:text-cardinal-pink-900'
                        }`}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium border-x border-gray-300 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-r-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.quantity} available
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAuthenticated && product.inCart}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all bg-white border border-cardinal-pink-900 text-cardinal-pink-900 hover:bg-cardinal-pink-900 hover:text-white shadow-lg hover:shadow-xl disabled:bg-yellow-300 disabled:text-yellow-700 disabled:border-yellow-300 disabled:cursor-not-allowed`}
              >
                <FaShoppingCart />
                <span>{isAuthenticated && product.inCart ? 'Added to Cart' : 'Add to Cart'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-cardinal-pink-900 text-white rounded-lg font-medium hover:bg-cardinal-pink-950 shadow-lg hover:shadow-xl transition-all"
              >
                <FaShoppingCart />
                <span>Buy Now</span>
              </motion.button>
            </motion.div>

            {/* Secondary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center space-x-4 pt-4 border-t border-gray-200"
            >
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${isWishlisted
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
              >
                <FaHeart className={isWishlisted ? 'text-red-500' : 'text-gray-500'} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </motion.button> */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                <FaShare />
                <span>Share</span>
              </motion.button>
            </motion.div>

            {/* Product Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
            >
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <FaTruck className="text-cardinal-pink-900 text-xl" />
                <div>
                  <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <FaUndo className="text-cardinal-pink-900 text-xl" />
                <div>
                  <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <FaShield className="text-cardinal-pink-900 text-xl" />
                <div>
                  <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-600">100% secure transactions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <MdVerified className="text-cardinal-pink-900 text-xl" />
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Guarantee</h4>
                  <p className="text-sm text-gray-600">Authentic products only</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Similar Products Section */}
        {similarTotalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSimilarPageChange(similarPage - 1)}
                  disabled={similarPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  {similarPage} of {similarTotalPages}
                </span>
                <button
                  onClick={() => handleSimilarPageChange(similarPage + 1)}
                  disabled={similarPage === similarTotalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {similarLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <BiLoaderAlt className="text-4xl text-cardinal-pink-900" />
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((product) => (
                  <SimilarProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <BuyNowModal
        isOpen={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
      />

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}