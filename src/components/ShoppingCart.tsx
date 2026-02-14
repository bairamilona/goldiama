import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ChevronLeft, ChevronRight, CreditCard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/app/contexts/CartContext';

export function ShoppingCart() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProceedToCheckout = () => {
    setCheckoutStep('checkout');
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  const handleCompleteOrder = () => {
    alert('Order completed successfully! You will receive a confirmation email shortly.');
    setIsCartOpen(false);
    setCheckoutStep('cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white z-[70] shadow-2xl flex flex-col font-['Inter']"
          >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {checkoutStep === 'checkout' && (
                  <button
                    onClick={handleBackToCart}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors -ml-2"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <ShoppingBag size={20} className="text-[#B8A07E]" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {checkoutStep === 'cart' ? 'Shopping Cart' : 'Checkout'}
                </h2>
                {totalItems > 0 && checkoutStep === 'cart' && (
                  <span className="text-xs text-gray-500">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content - Cart or Checkout */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {checkoutStep === 'cart' ? (
                // STEP 1: Cart Items
                items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <ShoppingBag size={32} className="text-gray-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Your cart is empty</p>
                    <p className="text-sm text-gray-500">Add some precious metals to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                          
                          {/* Show specs for regular items, show description for boxes */}
                          {item.isBox ? (
                            <p className="text-xs text-gray-500 mb-2">{item.purity}</p>
                          ) : (
                            <p className="text-xs text-gray-500 mb-2">
                              {item.weight} • {item.purity} {item.metal}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls - Hide for free box items */}
                            {!item.isBox && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center hover:border-[#B8A07E] transition-colors"
                                >
                                  <Minus size={12} strokeWidth={2} />
                                </button>
                                <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center hover:border-[#B8A07E] transition-colors"
                                >
                                  <Plus size={12} strokeWidth={2} />
                                </button>
                              </div>
                            )}
                            
                            {/* Price - Show FREE for box items */}
                            <div className="text-right">
                              {item.isBox ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">
                                    Free
                                  </span>
                                </div>
                              ) : (
                                <div className="text-sm font-semibold text-gray-900">
                                  ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors self-start"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                // STEP 2: Checkout Form
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                          {item.isBox && <span className="ml-2 text-xs text-emerald-600 font-semibold">(FREE)</span>}
                        </span>
                        <span className="font-medium text-gray-900">
                          {item.isBox ? (
                            <span className="text-emerald-600">$0.00</span>
                          ) : (
                            `$${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck size={18} className="text-[#B8A07E]" />
                      <h3 className="font-semibold text-gray-900">Shipping Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingData.firstName}
                          onChange={handleShippingChange}
                          className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingData.lastName}
                          onChange={handleShippingChange}
                          className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingChange}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingData.city}
                          onChange={handleShippingChange}
                          className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingData.postalCode}
                          onChange={handleShippingChange}
                          className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-['Inter'] font-medium text-gray-500 uppercase tracking-wider mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B8A07E] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard size={18} className="text-[#B8A07E]" />
                      <h3 className="font-semibold text-gray-900">Payment Method</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-[#B8A07E] bg-[#B8A07E]/5 text-gray-900'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard size={20} className="mx-auto mb-2" />
                        Credit Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod('crypto')}
                        className={`p-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                          paymentMethod === 'crypto'
                            ? 'border-[#B8A07E] bg-[#B8A07E]/5 text-gray-900'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">₿</div>
                        Cryptocurrency
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout/Complete Button */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-xs text-emerald-600 font-medium">FREE (Insured)</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Action Button */}
                {checkoutStep === 'cart' ? (
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#B8A07E] text-white py-4 rounded-lg font-semibold uppercase tracking-wider hover:bg-[#A08F6D] transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ChevronRight size={18} strokeWidth={2} />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteOrder}
                    className="w-full bg-black text-white py-4 rounded-lg font-semibold uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors"
                  >
                    Complete Order
                  </button>
                )}

                <p className="text-xs text-center text-gray-500">
                  Secure payment • Insured shipping • 30-day return policy
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}