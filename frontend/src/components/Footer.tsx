import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, CheckCircle2, ChevronRight, Send, Globe, Lock } from 'lucide-react';

interface FooterProps {
  onNotify: (type: 'success' | 'error', message: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNotify }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      onNotify('error', 'Please enter a valid email address.');
      return;
    }
    onNotify('success', 'Thank you for subscribing to ApexMotors VIP inventory updates!');
    setNewsletterEmail('');
  };

  return (
    <footer id="contact" className="w-full bg-[#07050e] border-t border-[#a484d7]/15 font-manrope text-white/70 pt-16 pb-8">
      {/* Container with full scaled width alignment */}
      <div className="w-full px-6 lg:px-[120px] space-y-12">
        
        {/* Top Section: Brand + Newsletter Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#a484d7]/15 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center space-x-3">
              <svg width="29" height="28" viewBox="0 0 29 28" fill="none">
                <path
                  d="M1.04356 6.35771L13.6437 0.666504C14.0754 0.471504 14.5681 0.471504 14.9998 0.666504L27.5999 6.35771C28.2435 6.64831 28.6565 7.28471 28.6565 7.98971V19.3437C28.6565 20.0487 28.2435 20.6851 27.5999 20.9757L14.9998 26.6669C14.5681 26.8619 14.0754 26.8619 13.6437 26.6669L1.04356 20.9757C0.399961 20.6851 -0.0130386 20.0487 -0.0130386 19.3437V7.98971C-0.0130386 7.28471 0.399961 6.64831 1.04356 6.35771Z"
                  fill="#7b39fc"
                />
              </svg>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Apex<span className="text-[#7b39fc]">Motors</span>
              </span>
            </div>
            <p className="text-sm text-white/60 font-inter max-w-lg leading-relaxed">
              India&apos;s premier luxury, electric, and performance motor vehicle inventory platform. Experience real-time stock allocation, certified vehicle specs, and atomic instant purchases.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 bg-[#17112c] p-6 rounded-[16px] border border-[#a484d7]/20">
            <h4 className="text-base font-bold text-white mb-1 font-cabin">Subscribe to VIP Inventory Alerts</h4>
            <p className="text-xs text-white/50 mb-4 font-inter">Get real-time notifications for newly arrived luxury models, EV drops, and exclusive price updates.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-[#2b2344] border border-[#a484d7]/30 text-white placeholder-white/40 text-xs px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#7b39fc] font-inter"
              />
              <button
                type="submit"
                className="bg-[#7b39fc] hover:bg-[#6826e3] text-white font-cabin font-medium text-xs px-5 py-3 rounded-[10px] transition-all flex items-center gap-1.5 shadow-md shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-inter">
          
          {/* Col 1: Dealership Centers in India */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm font-cabin tracking-wide uppercase text-[#a484d7]">
              Experience Centers (India)
            </h5>
            <ul className="space-y-2.5 text-white/60">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#7b39fc] shrink-0 mt-0.5" />
                <span><strong>Mumbai:</strong> Bandra Kurla Complex (BKC), Mumbai 400051</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#7b39fc] shrink-0 mt-0.5" />
                <span><strong>Bengaluru:</strong> UB City, Vittal Mallya Road, Bengaluru 560001</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#7b39fc] shrink-0 mt-0.5" />
                <span><strong>Delhi NCR:</strong> Golf Course Road, Gurugram 122002</span>
              </li>
            </ul>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm font-cabin tracking-wide uppercase text-[#a484d7]">
              Customer Support & Concierge
            </h5>
            <ul className="space-y-2.5 text-white/60">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#7b39fc] shrink-0" />
                <span>Toll-Free: +91 (022) 800-APEX (2739)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#7b39fc] shrink-0" />
                <span>Email: concierge@apexmotors.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#7b39fc] shrink-0" />
                <span>Hours: Mon – Sun (9:00 AM – 9:00 PM IST)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Vehicle Fleet Categories */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm font-cabin tracking-wide uppercase text-[#a484d7]">
              Vehicle Fleet Categories
            </h5>
            <ul className="space-y-2 text-white/60">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-[#7b39fc]" /> Electric Vehicles (EV)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-[#7b39fc]" /> Premium SUVs & 4x4 Off-Roaders
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-[#7b39fc]" /> Executive Luxury Sedans
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-[#7b39fc]" /> High-Performance Coupes
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-[#7b39fc]" /> Eco-Friendly Hybrids
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Security & Tech Stack */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm font-cabin tracking-wide uppercase text-[#a484d7]">
              System Architecture & Trust
            </h5>
            <div className="space-y-2 text-white/60">
              <div className="flex items-center space-x-2 bg-[#17112c] p-2.5 rounded-[8px] border border-[#a484d7]/15">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Neon Cloud PostgreSQL Database</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#17112c] p-2.5 rounded-[8px] border border-[#a484d7]/15">
                <Lock className="w-4 h-4 text-[#7b39fc] shrink-0" />
                <span className="text-[11px]">256-Bit JWT Encrypted Auth</span>
              </div>
              <div className="flex items-center space-x-2 bg-[#17112c] p-2.5 rounded-[8px] border border-[#a484d7]/15">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px]">Atomic Transaction Stock Safety</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 border-t border-[#a484d7]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40 font-inter">
          <p>© 2026 ApexMotors India Pvt. Ltd. All rights reserved. Full-Stack TDD Project.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Compliance</span>
            <span className="hover:text-white transition-colors cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
