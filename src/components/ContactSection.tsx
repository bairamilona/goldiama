import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSuccess(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Header - Full Width */}
      <div className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p 
              className="text-[11px] tracking-[0.3em] uppercase text-[#B8A07E] mb-8 font-['Inter']"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Get in Touch
            </motion.p>
            
            <motion.h2 
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.04em] font-light text-[#1A1A1A] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              START A<br />CONVERSATION
            </motion.h2>

            <motion.p 
              className="text-[17px] leading-[1.9] text-[#1A1A1A]/60 font-['Inter'] max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Whether you're interested in acquiring gold, exploring custom creations,<br />
              or discussing wholesale partnerships, our team is here to guide you
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main Split Layout - Map Left, Form Right */}
      <div className="relative">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* LEFT - Map Section */}
            <motion.div
              className="relative h-[600px] lg:h-[800px] grain-effect overflow-hidden"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Map */}
              <div className="absolute inset-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.2064654268744!2d55.27937631501239!3d25.207661583888665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682829c85c07%3A0x5c2e6b7f7f8b4f8a!2sAl%20Saqr%20Business%20Tower!5e0!3m2!1sen!2sae!4v1650000000000!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(60%) contrast(1.2) brightness(0.85) hue-rotate(200deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Custom Marker Overlay - NO API NEEDED */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {/* Premium Pin Marker */}
                  <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow */}
                    <ellipse cx="24" cy="60" rx="12" ry="3" fill="black" fillOpacity="0.15" />
                    
                    {/* Pin Body - Gold Gradient */}
                    <path 
                      d="M24 0C11.297 0 1 10.297 1 23C1 35.703 24 63 24 63C24 63 47 35.703 47 23C47 10.297 36.703 0 24 0Z" 
                      fill="url(#goldGradient)"
                      stroke="#8B7355"
                      strokeWidth="1.5"
                    />
                    
                    {/* Inner Circle - White */}
                    <circle cx="24" cy="23" r="10" fill="white" />
                    
                    {/* GOLDIAMA Logo Text */}
                    <text 
                      x="24" 
                      y="26" 
                      fontFamily="'Cormorant Garamond', serif" 
                      fontSize="8" 
                      fontWeight="600"
                      fill="#B8A07E" 
                      textAnchor="middle"
                      letterSpacing="0.5"
                    >
                      GOLDIAMA
                    </text>
                    
                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="goldGradient" x1="24" y1="0" x2="24" y2="63" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#B8A07E" />
                        <stop offset="100%" stopColor="#9B8970" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>

              {/* Enhanced Gradient Overlay - Dark */}
              <div 
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: `
                    linear-gradient(to top, 
                      rgba(0, 0, 0, 0.85) 0%, 
                      rgba(0, 0, 0, 0.6) 25%,
                      rgba(0, 0, 0, 0.3) 50%,
                      rgba(0, 0, 0, 0) 75%
                    )
                  `
                }}
              />
              
              {/* Location Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-12 md:p-16 z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-[11px] tracking-[0.3em] uppercase text-white/60 mb-6 font-['Inter']">
                    Our Flagship
                  </p>
                  
                  <h3 
                    className="text-[32px] md:text-[42px] leading-[1.2] tracking-[-0.02em] font-light text-white mb-6"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Al Saqr Business Tower
                  </h3>

                  <div className="space-y-2 mb-8">
                    <p className="text-[15px] text-white/90 font-['Inter']">
                      31st Floor, Sheikh Zayed Road
                    </p>
                    <p className="text-[15px] text-white/90 font-['Inter']">
                      DIFC, Dubai, UAE
                    </p>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Al+Saqr+Business+Tower+DIFC+Dubai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-white font-['Inter'] font-medium border-b border-white/40 pb-1 hover:border-white transition-all duration-500"
                  >
                    <span>Get Directions</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT - Contact Form */}
            <motion.div
              className="relative bg-[#FAFAF8] h-[600px] lg:h-[800px] px-8 md:px-12 lg:px-16 py-12 md:py-16 flex flex-col justify-center grain-effect overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-lg mx-auto">
                
                {/* Form Header */}
                <div className="mb-10">
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8A07E] mb-4 font-['Inter']">
                    Send us a Message
                  </p>
                  
                  <h3 
                    className="text-[36px] md:text-[48px] leading-[1] tracking-[-0.03em] font-light text-[#1A1A1A]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    LET'S CONNECT
                  </h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-7">
                  
                  {/* Name Field */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="peer w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 text-[18px] text-[#1A1A1A] font-light transition-all duration-500 focus:outline-none focus:border-[#B8A07E] placeholder:text-transparent"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      placeholder="Your Name"
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-0 text-[11px] uppercase tracking-[0.2em] font-['Inter'] transition-all duration-300 pointer-events-none ${
                        focusedField === 'name' || formData.name
                          ? '-top-5 text-[#B8A07E]'
                          : 'top-3 text-[#1A1A1A]/40 text-[18px] normal-case tracking-normal'
                      }`}
                      style={{ 
                        fontFamily: focusedField === 'name' || formData.name ? "'Inter'" : "'Cormorant Garamond', serif",
                        fontWeight: focusedField === 'name' || formData.name ? 400 : 300
                      }}
                    >
                      {focusedField === 'name' || formData.name ? 'Your Name' : 'Your Name'}
                    </label>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="peer w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 text-[18px] text-[#1A1A1A] font-light transition-all duration-500 focus:outline-none focus:border-[#B8A07E] placeholder:text-transparent"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      placeholder="Email Address"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-0 text-[11px] uppercase tracking-[0.2em] font-['Inter'] transition-all duration-300 pointer-events-none ${
                        focusedField === 'email' || formData.email
                          ? '-top-5 text-[#B8A07E]'
                          : 'top-3 text-[#1A1A1A]/40 text-[18px] normal-case tracking-normal'
                      }`}
                      style={{ 
                        fontFamily: focusedField === 'email' || formData.email ? "'Inter'" : "'Cormorant Garamond', serif",
                        fontWeight: focusedField === 'email' || formData.email ? 400 : 300
                      }}
                    >
                      {focusedField === 'email' || formData.email ? 'Email Address' : 'Email Address'}
                    </label>
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="peer w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 text-[18px] text-[#1A1A1A] font-light transition-all duration-500 focus:outline-none focus:border-[#B8A07E] placeholder:text-transparent"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      placeholder="Phone Number"
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-0 text-[11px] uppercase tracking-[0.2em] font-['Inter'] transition-all duration-300 pointer-events-none ${
                        focusedField === 'phone' || formData.phone
                          ? '-top-5 text-[#B8A07E]'
                          : 'top-3 text-[#1A1A1A]/40 text-[18px] normal-case tracking-normal'
                      }`}
                      style={{ 
                        fontFamily: focusedField === 'phone' || formData.phone ? "'Inter'" : "'Cormorant Garamond', serif",
                        fontWeight: focusedField === 'phone' || formData.phone ? 400 : 300
                      }}
                    >
                      {focusedField === 'phone' || formData.phone ? 'Phone Number' : 'Phone Number'}
                    </label>
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={3}
                      className="peer w-full bg-transparent border-b border-[#1A1A1A]/20 py-3 text-[18px] text-[#1A1A1A] font-light transition-all duration-500 focus:outline-none focus:border-[#B8A07E] placeholder:text-transparent resize-none"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      placeholder="Your Message"
                    />
                    <label
                      htmlFor="message"
                      className={`absolute left-0 text-[11px] uppercase tracking-[0.2em] font-['Inter'] transition-all duration-300 pointer-events-none ${
                        focusedField === 'message' || formData.message
                          ? '-top-5 text-[#B8A07E]'
                          : 'top-3 text-[#1A1A1A]/40 text-[18px] normal-case tracking-normal'
                      }`}
                      style={{ 
                        fontFamily: focusedField === 'message' || formData.message ? "'Inter'" : "'Cormorant Garamond', serif",
                        fontWeight: focusedField === 'message' || formData.message ? 400 : 300
                      }}
                    >
                      {focusedField === 'message' || formData.message ? 'Your Message' : 'Your Message'}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`
                        group relative inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] font-['Inter'] font-medium
                        transition-all duration-500 border-b pb-1
                        ${isSuccess 
                          ? 'text-emerald-600 border-emerald-600' 
                          : 'text-[#1A1A1A] border-[#1A1A1A] hover:text-[#B8A07E] hover:border-[#B8A07E]'
                        }
                        disabled:opacity-50
                      `}
                      whileHover={{ x: 4 }}
                    >
                      <span>
                        {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent' : 'Send Message'}
                      </span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </motion.button>
                  </div>

                  {/* Privacy Note */}
                  <p className="text-[11px] text-[#1A1A1A]/40 font-['Inter'] leading-[1.8] pt-2">
                    We typically respond within 24 hours
                  </p>
                </form>

                {/* Contact Info - Compact */}
                <div className="mt-12 pt-8 border-t border-[#1A1A1A]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/40 font-['Inter']">Phone</span>
                    <a href="tel:+97143589000" className="text-[14px] text-[#1A1A1A] hover:text-[#B8A07E] transition-colors font-['Inter']">
                      +971 4 358 9000
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/40 font-['Inter']">Email</span>
                    <a href="mailto:info@goldiama.com" className="text-[14px] text-[#1A1A1A] hover:text-[#B8A07E] transition-colors font-['Inter']">
                      info@goldiama.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}