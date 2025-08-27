'use client'

import { motion } from 'framer-motion'
import { FaShoppingCart } from 'react-icons/fa'
import { useState } from 'react'
import Cart from './cart'
import { useCustomerAuth } from '@/providers/customer-auth-context'

export default function FloatingCartButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems } = useCustomerAuth()

  const toggleCart = () => setIsCartOpen(!isCartOpen)

  return (
    <>
      {/* Floating Cart Button */}
      <motion.div
        onClick={toggleCart}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="fixed z-50 top-[30%] right-0"
        initial={{ width: 56 }}
        animate={{ width: isHovered ? 150 : 56 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 bg-cardinal-pink-800 hover:bg-cardinal-pink-800 text-white rounded-l-full px-4 py-3 shadow-lg transition-all duration-200 overflow-hidden">
          <FaShoppingCart className="text-xl" />
          {isHovered && <span className="whitespace-nowrap text-sm font-medium">Open Cart</span>}
        </div>
      </motion.div>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart
          items={cartItems || []}
          toggleCart={toggleCart}
          isCartOpen={isCartOpen}
        />
      )}
    </>
  )
}
