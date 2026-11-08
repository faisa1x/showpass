import React from 'react';
import { Film, Shield, Clock, HelpCircle, Heart } from 'lucide-react';
import { CITIES } from '../data/moviesData';

interface FooterProps {
  onSelectCity: (cityId: string) => void;
  onOpenBookings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity, onOpenBookings }) => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0e0e10] text-slate-400 text-xs">
      {/* Trust & Guarantee Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#f84464] border border-white/5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Secure M-Ticket Booking</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified cinema partners and contactless QR passes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-white/5 text-amber-400 border border-white/5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Instant Seat Reservation</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time seat mapping across 200+ screens</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-white/5 text-emerald-400 border border-white/5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Hassle-free cancellations and instant assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Popular Cities Links */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Cinemas by City
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {CITIES.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCity(c.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white">
              Show<span className="text-[#f84464]">Pass</span>
            </span>
            <span className="text-slate-500">·</span>
            <span>India's Entertainment & Cinema Destination</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={onOpenBookings} className="hover:text-white transition-colors">
              My Bookings
            </button>
            <span className="text-slate-600">·</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="text-slate-600">·</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 pt-2">
          © {new Date().getFullYear()} ShowPass Entertainment India Ltd. All rights reserved. Built with LocalStorage persistence.
        </div>
      </div>
    </footer>
  );
};
