import { useState, useEffect } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryType?: 'wholesale' | 'custom' | 'general';
  defaultMessage?: string;
  customType?: 'bar' | 'coin' | 'luxury' | null;
}

export function ContactFormModal({ 
  isOpen, 
  onClose, 
  inquiryType = 'general',
  defaultMessage = '',
  customType = null
}: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: inquiryType,
    message: defaultMessage,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: inquiryType,
        message: defaultMessage,
      });
      setIsSuccess(false);
      setErrors({});
    }
  }, [isOpen, inquiryType, defaultMessage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (inquiryType === 'wholesale' && !formData.company.trim()) {
      newErrors.company = 'Company name is required for wholesale inquiries';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 md:pt-24">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container - Compact on Desktop */}
      <div className="relative w-full md:max-w-xl lg:max-w-2xl max-h-[95vh] md:max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-2xl">
        {/* Animated Golden/Silver Premium Background */}
        <div className="absolute inset-0 overflow-hidden rounded-t-3xl md:rounded-3xl">
          {/* Base Gradient - Gold to Silver */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5C3 25%, #E8D7B0 50%, #C0C0C0 75%, #E8E8E8 100%)',
            }}
          />
          
          {/* Animated Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.3), transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          
          {/* Film Grain Texture */}
          <div 
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }}
          />
          
          {/* Vignette Effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
            }}
          />
        </div>

        {/* Content - More Compact */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-t-3xl md:rounded-3xl p-6 md:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors group"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#1A1A1A] group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {!isSuccess ? (
            <>
              {/* Header - More Compact */}
              <div className="mb-6">
                <h2 
                  className="text-[1.75rem] md:text-[2rem] leading-[1.15] tracking-[-0.02em] font-light text-[#1A1A1A] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {inquiryType === 'wholesale' && 'Wholesale Inquiry'}
                  {inquiryType === 'custom' && customType === 'bar' && 'Custom Bar Request'}
                  {inquiryType === 'custom' && customType === 'coin' && 'Custom Coin Request'}
                  {inquiryType === 'custom' && customType === 'luxury' && 'Luxury Packaging Request'}
                  {inquiryType === 'custom' && !customType && 'Custom Order Request'}
                  {inquiryType === 'general' && 'Get In Touch'}
                </h2>
                <p className="text-xs md:text-sm text-[#1A1A1A]/60 font-['Inter'] tracking-[0.02em]">
                  {inquiryType === 'wholesale' && 'Tell us about your wholesale requirements and we\'ll get back to you within 24 hours.'}
                  {inquiryType === 'custom' && customType === 'bar' && 'Design your own gold bar with custom engravings, weights, and finishes.'}
                  {inquiryType === 'custom' && customType === 'coin' && 'Craft personalized gold coins with bespoke designs and inscriptions.'}
                  {inquiryType === 'custom' && customType === 'luxury' && 'Premium packaging designed for gifting or personal collection.'}
                  {inquiryType === 'custom' && !customType && 'Share your vision for a bespoke piece and our artisans will bring it to life.'}
                  {inquiryType === 'general' && 'We\'re here to answer any questions about our collection.'}
                </p>
              </div>

              {/* Form - Compact Spacing */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-[10px] font-medium text-[#1A1A1A] mb-1.5 uppercase tracking-[0.1em] font-['Inter']"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-xl bg-white border ${
                      errors.name ? 'border-red-400' : 'border-[#1A1A1A]/20'
                    } focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-['Inter'] text-sm`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-['Inter']">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-[10px] font-medium text-[#1A1A1A] mb-1.5 uppercase tracking-[0.1em] font-['Inter']"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-xl bg-white border ${
                      errors.email ? 'border-red-400' : 'border-[#1A1A1A]/20'
                    } focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-['Inter'] text-sm`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-['Inter']">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-[10px] font-medium text-[#1A1A1A] mb-1.5 uppercase tracking-[0.1em] font-['Inter']"
                  >
                    Phone Number <span className="text-[#1A1A1A]/40">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#1A1A1A]/20 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-['Inter'] text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Company (for wholesale) */}
                {inquiryType === 'wholesale' && (
                  <div>
                    <label 
                      htmlFor="company" 
                      className="block text-[10px] font-medium text-[#1A1A1A] mb-1.5 uppercase tracking-[0.1em] font-['Inter']"
                    >
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-xl bg-white border ${
                        errors.company ? 'border-red-400' : 'border-[#1A1A1A]/20'
                      } focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-['Inter'] text-sm`}
                      placeholder="Your company name"
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-500 font-['Inter']">{errors.company}</p>
                    )}
                  </div>
                )}

                {/* Inquiry Type */}
                <div>
                  <label 
                    htmlFor="inquiryType" 
                    className="block text-[10px] font-medium text-[#1A1A1A] mb-1.5 uppercase tracking-[0.1em] font-['Inter']"
                  >
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#1A1A1A]/20 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-['Inter'] text-sm"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="wholesale">Wholesale Partnership</option>
                    <option value="custom">Custom Order</option>
                    <option value="investment">Investment Consultation</option>
                    <option value="authentication">Authentication Services</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-[10px] font-medium text-[#1A1A1A] mb-1.5 uppercase tracking-[0.1em] font-['Inter']"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2.5 rounded-xl bg-white border ${
                      errors.message ? 'border-red-400' : 'border-[#1A1A1A]/20'
                    } focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-['Inter'] text-sm resize-none`}
                    placeholder={
                      inquiryType === 'wholesale' 
                        ? 'Please describe your wholesale requirements, order volume, and timeline...'
                        : inquiryType === 'custom' && customType === 'bar'
                        ? 'Describe your custom bar: preferred weight (1oz-1kg), engraving text, finish preferences...'
                        : inquiryType === 'custom' && customType === 'coin'
                        ? 'Describe your custom coin: size (1/10oz-1oz), design concept, text/inscriptions...'
                        : inquiryType === 'custom' && customType === 'luxury'
                        ? 'Describe your packaging needs: material preferences, customization options...'
                        : inquiryType === 'custom'
                        ? 'Describe your custom piece: weight, design preferences, timeline...'
                        : 'Tell us how we can help you...'
                    }
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 font-['Inter']">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button - More Compact */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-full bg-[#1A1A1A] text-white font-['Inter'] text-xs font-medium uppercase tracking-[0.15em] hover:bg-[#2A2A2A] disabled:bg-[#1A1A1A]/50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2.5 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#1A1A1A]/40 text-center font-['Inter'] leading-relaxed pt-1">
                  By submitting this form, you agree to our privacy policy.<br />
                  We'll respond within 24 hours during business days.
                </p>
              </form>
            </>
          ) : (
            /* Success State - Compact */
            <div className="py-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 
                className="text-[1.75rem] leading-[1.2] tracking-[-0.02em] font-light text-[#1A1A1A] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Thank You!
              </h3>
              <p className="text-sm text-[#1A1A1A]/60 font-['Inter'] mb-1.5">
                Your inquiry has been received.
              </p>
              <p className="text-xs text-[#1A1A1A]/40 font-['Inter']">
                We'll get back to you within 24 hours.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}