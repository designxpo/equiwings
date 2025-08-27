"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiShoppingCart, FiSearch, FiChevronLeft, FiChevronRight, FiStar, FiChevronDown, FiX } from "react-icons/fi";
import axiosInstance from "@/lib/config/axios";
import toast from "react-hot-toast";
import { useCustomerAuth } from "@/providers/customer-auth-context";
import Link from "next/link";
import LoginModal from "@/components/modals/login";

// ---------------------------------------------
// Type definitions
// ---------------------------------------------
interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ratings: {
    average: number;
    count: number;
  };
  mainImage: string;
  additionalImages: string[];
  inCart: boolean;
  sizes: string[];
  colors: string[];
  quantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (cartItem: CartItem) => void;
  isAdding: boolean;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  isAdding
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product && isOpen) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0] || "");
      setQuantity(1);
    }
  }, [product, isOpen]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    onAddToCart({
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Add to Cart</h2>
          <p className="text-gray-600">{product.name}</p>
          <p className="text-xl font-bold text-cardinal-pink-900 mt-2">
            ${product.price.toLocaleString()}
          </p>
        </div>

        <div className="space-y-4">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size *
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cardinal-pink-900 focus:ring-2 focus:ring-cardinal-pink-800"
              required
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cardinal-pink-900 focus:ring-2 focus:ring-cardinal-pink-800"
              required
            >
              {product.colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !selectedSize || !selectedColor}
            className="flex-1 bg-cardinal-pink-900 text-white px-4 py-2 rounded-lg hover:bg-cardinal-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ---------------------------------------------
// Category Dropdown Component
// ---------------------------------------------
interface CategoryDropdownProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showDropdown: boolean;
  onToggleDropdown: () => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showDropdown,
  onToggleDropdown
}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggleDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, onToggleDropdown]);

  return (
    <div className="w-full md:w-auto relative" ref={dropdownRef}>
      <button
        onClick={onToggleDropdown}
        className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:border-cardinal-pink-900 focus:ring-2 focus:ring-cardinal-pink-800 transition-all duration-300"
      >
        <span className="text-gray-700">
          {selectedCategory || "All Categories"}
        </span>
        <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${!selectedCategory ? 'bg-cardinal-pink-50 text-cardinal-pink-900' : 'text-gray-700'}`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedCategory === category ? 'bg-cardinal-pink-50 text-cardinal-pink-900' : 'text-gray-700'}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------
// Product Card Component
// ---------------------------------------------
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdding }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <Link href={`/sports-retail/${product.productId}`} className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSfFF9UFTnrQIB3tvlzBH4S9gOszZ7CqnR53afJPf0kJ-WGH8Fkje1-ecptKRe9Lyuz_f4g8KwsFDHXQx74YNbeiQa43RrLkJ4DnxFyMzeMcbmSWIS3UCr3GQ&usqp=CAc"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.inCart && (
          <div className="absolute top-2 right-2 bg-yellow-300 font-bold text-cardinal-pink-900 px-2 py-1 rounded-full text-xs">
            In Cart
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-gray-800">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {renderStars(Math.round(product.ratings.average))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.ratings.count})
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            disabled={isAdding || product.inCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${product.inCart
              ? "bg-yellow-300 text-cardinal-pink-900 cursor-not-allowed"
              : isAdding
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-cardinal-pink-900 text-white hover:bg-cardinal-pink-700 shadow-lg hover:shadow-xl"
              }`}
          >
            <FiShoppingCart className="w-4 h-4" />
            {product.inCart
              ? "Added"
              : isAdding
                ? "Adding..."
                : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------
// Search Bar Component
// ---------------------------------------------
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, onSearch }) => {
  return (
    <div className="w-full md:w-1/3">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch(e)}
          placeholder="Search products..."
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-cardinal-pink-900 focus:ring-2 focus:ring-cardinal-pink-800 transition-all duration-300"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};

// ---------------------------------------------
// Pagination Component
// ---------------------------------------------
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex justify-center items-center gap-4"
    >
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <FiChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${currentPage === pageNum
                ? "bg-cardinal-pink-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        Next
        <FiChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ---------------------------------------------
// Main Component
// ---------------------------------------------
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isAuthenticated, fetchCart } = useCustomerAuth();
  const categories = ["New Arrival", "Trending", "BAGS", "CLOTHING", "ACCESSORIES"];

  // -------------------------------------------
  // Fetch products
  // -------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/customers/products?page=${page}&limit=${limit}`;

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const res = await axiosInstance.get(url);
        const data = res.data;
        setProducts(data.products);
        if (data.pagination?.pages) {
          setTotalPages(data.pagination.pages);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, searchTerm, selectedCategory]);

  // -------------------------------------------
  // Handle product card add to cart click
  // -------------------------------------------
  const handleAddToCartClick = (product: Product) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setSelectedProduct(product);
    setShowAddToCartModal(true);
  };

  // -------------------------------------------
  // Add to cart with selected options
  // -------------------------------------------
  const addToCart = async (cartItem: CartItem) => {
    if (!selectedProduct) return;

    try {
      setAddingId(selectedProduct._id);
      const res = await axiosInstance.post(`/customers/products/${cartItem.productId}/cart`, {
        size: cartItem.size,
        color: cartItem.color,
        quantity: cartItem.quantity,
        productId: cartItem.productId
      });

      // Update only the specific product's inCart status
      setProducts(prev =>
        prev.map(product =>
          product._id === selectedProduct._id
            ? { ...product, inCart: true }
            : product
        )
      );

      toast.success("Added to cart!");
      setShowAddToCartModal(false);
      fetchCart();
      setSelectedProduct(null);
    } catch (err) {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingId(null);
    }
  };

  // -------------------------------------------
  // Handle search
  // -------------------------------------------
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  // -------------------------------------------
  // Handle category filter
  // -------------------------------------------
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setPage(1);
    setShowDropdown(false);
  };

  // -------------------------------------------
  // Animation variants
  // -------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')]"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.h2 className="text-3xl md:text-5xl text-center mb-18 text-white" variants={headerVariants}>
              Our Products
            </motion.h2>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-cover bg-center bg-[url('/assets/images/bg-4.webp')]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
              />
              <CategoryDropdown
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                showDropdown={showDropdown}
                onToggleDropdown={() => setShowDropdown(!showDropdown)}
              />
            </div>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cardinal-pink-900"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FiShoppingCart className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No Items Found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCartClick}
                  isAdding={addingId === product._id}
                />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={() => {
          setShowAddToCartModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onAddToCart={addToCart}
        isAdding={addingId !== null}
      />
    </div>
  );
};

const ComingSoon: React.FC = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat bg-[url('/assets/images/bg-2.webp')]"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-5xl text-center mb-18 text-white font-bold animate-pulse">
            Coming Soon
          </h2>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto">
            We are working hard on building a new and improved experience for
            you. Stay tuned for more updates.
          </p>
        </motion.div>
      </div>
    </div>);
};


export default ComingSoon;