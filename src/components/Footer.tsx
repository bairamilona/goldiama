import React from 'react';
import { Shield, Lock, Award, FileText, Mail, Phone, MapPin } from 'lucide-react';
import logoImage from "figma:asset/6996fefb20a009345d2866832d3a8332840c6b74.png";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] text-gray-600 font-['Inter'] border-t border-gray-200">
      {/* Trust & Compliance Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-8 md:px-16 lg:px-24 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* LBMA Certified */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B8A07E]/10 flex items-center justify-center">
                <Award className="text-[#B8A07E]" size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">LBMA Certified</div>
                <div className="text-[10px] text-gray-500">Good Delivery Standard</div>
              </div>
            </div>

            {/* Secure Vaults */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B8A07E]/10 flex items-center justify-center">
                <Lock className="text-[#B8A07E]" size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Secure Storage</div>
                <div className="text-[10px] text-gray-500">Insured Vaults</div>
              </div>
            </div>

            {/* Regulatory Compliance */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B8A07E]/10 flex items-center justify-center">
                <Shield className="text-[#B8A07E]" size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">DMCC Regulated</div>
                <div className="text-[10px] text-gray-500">Dubai Multi Commodities</div>
              </div>
            </div>

            {/* Assay Certificates */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B8A07E]/10 flex items-center justify-center">
                <FileText className="text-[#B8A07E]" size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Full Documentation</div>
                <div className="text-[10px] text-gray-500">Assay & Certificates</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-6 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Company Info */}
          <div className="space-y-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-2">
                <img src={logoImage} alt="Goldiama" className="h-10 w-auto object-contain" />
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.3em] opacity-80">ESTABLISHED 2001</span>
            </div>
            <div className="space-y-3 text-sm">
               <div className="flex items-start gap-2 justify-center md:justify-start">
                 <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                 <p className="leading-relaxed text-center md:text-left">Dubai Gold Souk, Deira<br/>Dubai, UAE 00000</p>
               </div>
               <div className="flex items-center gap-2 justify-center md:justify-start">
                 <Phone size={16} className="text-gray-400 shrink-0" />
                 <p>+971 4 358 9000</p>
               </div>
               <div className="flex items-center gap-2 justify-center md:justify-start">
                 <Mail size={16} className="text-gray-400 shrink-0" />
                 <p>institutional@goldiama.com</p>
               </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <strong className="text-gray-700">License:</strong> DMCC-123456<br/>
                <strong className="text-gray-700">VAT Reg:</strong> UAE-987654321
              </p>
            </div>
          </div>

          {/* Column 2: Institutional Services */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Institutional Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Bullion Trading</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Vault Storage</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Portfolio Management</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Market Intelligence</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Corporate Accounts</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Refining Services</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Market Reports</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Price History</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Research & Analysis</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Regulatory Compliance</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Storage Insurance</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Legal & Compliance</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Terms of Business</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Risk Disclosure</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">AML/KYC Policy</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-[#B8A07E] transition-colors">Complaints Procedure</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 text-[11px] text-gray-600 leading-relaxed">
            <p className="mb-3">
              <strong className="text-gray-900">Risk Warning:</strong> Trading in precious metals involves significant risk of loss. Prices can fluctuate significantly and past performance is not indicative of future results. This service is intended for institutional and accredited investors only.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900">Indicative Pricing:</strong> All prices displayed are indicative only and subject to market conditions. For executable quotes, please contact our trading desk directly or use the client portal.
            </p>
            <p>
              <strong className="text-gray-900">Regulatory Status:</strong> Goldiama Trading LLC is registered with the Dubai Multi Commodities Centre (DMCC) under license #DMCC-123456. We are subject to regulatory oversight and maintain comprehensive insurance for stored assets.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Goldiama Trading LLC. All Rights Reserved. Registered in Dubai, UAE.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-700 transition-colors">Sitemap</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Accessibility</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}