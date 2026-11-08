import React, { useState } from 'react';
import { X, Ticket, Calendar, Clock, MapPin, QrCode, AlertCircle, Ban } from 'lucide-react';
import { Booking } from '../types';
import { cancelBooking } from '../utils/storage';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onUpdateBookings: (updated: Booking[]) => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateBookings,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? Refund will be initiated to your original payment method.')) {
      const updated = cancelBooking(bookingId);
      onUpdateBookings(updated);
      if (selectedTicket && selectedTicket.bookingId === bookingId) {
        setSelectedTicket({ ...selectedTicket, status: 'cancelled' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#16161a] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#121214]">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-5 h-5 text-[#f84464]" />
            <h3 className="text-base font-bold text-white">My Movie Bookings</h3>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-bold tabular-nums">
              {bookings.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List or Selected Full Pass View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {bookings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Ticket className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-white">No Bookings Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Your booked movie passes and live event tickets will appear here with instant digital QR entry.
              </p>
            </div>
          ) : (
            bookings.map(b => {
              const isCancelled = b.status === 'cancelled';
              return (
                <div
                  key={b.bookingId}
                  className={`relative rounded-2xl border p-4.5 transition-all ${
                    isCancelled
                      ? 'bg-white/2 border-white/5 opacity-60'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Top Row: Ref and Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs">
                    <span className="font-mono font-bold text-[#f84464]">{b.bookingId}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCancelled
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Movie Info */}
                  <div className="py-3 flex gap-3.5">
                    <div className="w-14 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src={b.moviePoster}
                        alt={b.movieTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{b.movieTitle}</h4>
                      <p className="text-xs text-slate-300 truncate mt-0.5">{b.cinemaName}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <span>{b.date}</span>
                        <span>·</span>
                        <span>{b.time}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-semibold text-[#f84464]">{b.seats.join(', ')}</span>
                        <span className="text-[10px] text-slate-400">({b.audi})</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Entry & Cancel Action */}
                  <div className="pt-3 border-t border-dashed border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-md">
                        <QrCode className="w-6 h-6 text-slate-900" />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        <span className="font-semibold text-white block">Paid: ₹{b.totalPaid}</span>
                        <span>M-Ticket QR Ready</span>
                      </div>
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(b.bookingId)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121214] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Synced locally in browser storage</span>
          <button onClick={onClose} className="text-white hover:underline font-semibold">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
