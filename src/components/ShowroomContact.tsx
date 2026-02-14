import React from "react";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export function ShowroomContact() {
  return (
    <section className="py-24 bg-white relative z-10" id="contact">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16">
                <div>
                    <h2 className="font-['Belleza'] text-4xl text-[#1D2A2A] mb-4">Request an Appointment</h2>
                    <p className="text-gray-600 mb-8">Please fill out the form below and one of our advisors will contact you shortly.</p>
                </div>
                
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
                            <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-600 transition-colors bg-transparent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                            <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-600 transition-colors bg-transparent" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                        <input type="email" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-600 transition-colors bg-transparent" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                        <textarea rows={3} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-600 transition-colors bg-transparent resize-none"></textarea>
                    </div>

                    <button type="button" className="h-14 rounded-full bg-[#1D2A2A] text-white hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.25)] w-full md:w-auto px-10">
                        <span className="font-['Belleza'] text-xs font-bold uppercase tracking-[0.15em]">
                            Submit Request
                        </span>
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 text-[#D4AF37]" />
                    </button>
                </form>
            </div>
        </div>
    </section>
  );
}
