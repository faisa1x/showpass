import React, { useState } from 'react';
import { 
  X, ChevronLeft, Calendar, Clock, MapPin, Check, 
  Sparkles, Ticket, ShieldCheck, ArrowRight, Utensils, QrCode 
} from 'lucide-react';
import { Movie, Cinema, CinemaShowtime, Booking, FoodItem } from '../types';
import { CINEMAS_BY_CITY, FOOD_ITEMS, CITIES } from '../data/moviesData';
import { saveBooking } from '../utils/storage';

interface BookingFlowModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onBookingConfirmed: (booking: Booking) => void;
}

type BookingStep = 'showtimes' | 'seats' | 'snacks' | 'checkout' | 'confirmed';

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  movie,
  isOpen,
  onClose,
  selectedCity,
  onBookingConfirmed,
}) => {
  if (!isOpen || !movie) return null;

  // Generate next 7 dates for showtime tabs
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      full: d.toISOString().split('T')[0],
      dayOfWeek: i === 0 ? 'TODAY' : i === 1 ? 'TOM' : dayNames[d.getDay()],
      dayNumber: d.getDate(),
      month: monthNames[d.getMonth()]
    };
  });

  const [step, setStep] = useState<BookingStep>('showtimes');
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<CinemaShowtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [cartFood, setCartFood] = useState<{ [id: string]: number }>({});
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Available cinemas for the city (fallback to mumbai cinemas)
  const cinemas = CINEMAS_BY_CITY[selectedCity] || CINEMAS_BY_CITY['mumbai'];
  const cityName = CITIES.find(c => c.id === selectedCity)?.name || 'Mumbai';

  // Seat Configuration: Rows and tiers
  const ROWS = [
    { row: 'A', tier: 'Recliner', price: 450 },
    { row: 'B', tier: 'Recliner', price: 450 },
    { row: 'C', tier: 'Prime Plus', price: 280 },
    { row: 'D', tier: 'Prime Plus', price: 280 },
    { row: 'E', tier: 'Prime Plus', price: 280 },
    { row: 'F', tier: 'Classic', price: 180 },
    { row: 'G', tier: 'Classic', price: 180 },
    { row: 'H', tier: 'Classic', price: 180 },
  ];

  // Deterministically mark some seats occupied based on showtime/movie
  const isSeatOccupied = (row: string, num: number) => {
    const hash = (row.charCodeAt(0) * 7 + num * 13 + (selectedShowtime?.price || 100)) % 10;
    return hash === 2 || hash === 7;
  };

  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 seats allowed per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatTierPrice = (seatId: string) => {
    const rowChar = seatId[0];
    const rowDef = ROWS.find(r => r.row === rowChar);
    return rowDef ? rowDef.price : 200;
  };

  const getSeatTierName = (seatId: string) => {
    const rowChar = seatId[0];
    const rowDef = ROWS.find(r => r.row === rowChar);
    return rowDef ? rowDef.tier : 'Classic';
  };

  // Financial Calculations
  const ticketAmount = selectedSeats.reduce((acc, seatId) => acc + getSeatTierPrice(seatId), 0);
  const convenienceFee = selectedSeats.length * 30; // ₹30 per ticket
  const gst = Math.round((ticketAmount + convenienceFee) * 0.18);

  const foodItemsSelected = Object.entries(cartFood)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = FOOD_ITEMS.find(f => f.id === id)!;
      return { name: item.name, qty, price: item.price };
    });

  const foodTotal = foodItemsSelected.reduce((sum, item) => sum + item.price * item.qty, 0);

  const discount = appliedPromo ? appliedPromo.discount : 0;
  const grandTotal = Math.max(0, ticketAmount + convenienceFee + gst + foodTotal - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'SHOWPASS50') {
      setAppliedPromo({ code: 'SHOWPASS50', discount: 50 });
    } else if (clean === 'BMSFREE') {
      setAppliedPromo({ code: 'BMSFREE', discount: convenienceFee });
    } else if (clean === 'FIRST100') {
      setAppliedPromo({ code: 'FIRST100', discount: 100 });
    } else {
      alert('Invalid promo code. Try SHOWPASS50 or BMSFREE');
    }
  };

  const handleConfirmPayment = () => {
    if (!selectedCinema || !selectedShowtime || selectedSeats.length === 0) return;

    const bookingId = `BMS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      bookingId,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      cinemaName: selectedCinema.name,
      city: cityName,
      date: `${selectedDate.dayNumber} ${selectedDate.month} (${selectedDate.dayOfWeek})`,
      time: selectedShowtime.time,
      format: selectedShowtime.format,
      audi: 'AUDI 03 (Dolby Atmos)',
      seats: selectedSeats,
      seatTier: getSeatTierName(selectedSeats[0]),
      ticketAmount,
      convenienceFee,
      foodItems: foodItemsSelected,
      discount,
      totalPaid: grandTotal,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'confirmed'
    };

    saveBooking(newBooking);
    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#16161a] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Navigation & Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121214] shrink-0">
          <div className="flex items-center gap-3">
            {step !== 'showtimes' && step !== 'confirmed' && (
              <button
                onClick={() => {
                  if (step === 'seats') setStep('showtimes');
                  if (step === 'snacks') setStep('seats');
                  if (step === 'checkout') setStep('snacks');
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{movie.title}</span>
                <span className="text-xs font-normal text-slate-400 uppercase tracking-wider">
                  ({movie.certification})
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {cityName} · {movie.languages[0]} · {movie.genres.join(', ')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SHOWTIMES & CINEMA SELECTION */}
        {step === 'showtimes' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Date Picker Bar */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Date
              </p>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {dates.map((d, idx) => {
                  const isSelected = selectedDate.full === d.full;
                  return (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-2.5 px-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#f84464] border-[#f84464] text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{d.dayOfWeek}</span>
                      <span className="text-lg font-black">{d.dayNumber}</span>
                      <span className="text-[10px] font-semibold">{d.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cinema Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Available Multiplexes in {cityName}</span>
                <span className="text-[11px] text-slate-500">M-Ticket & F&B Available</span>
              </div>

              {cinemas.map(cinema => (
                <div 
                  key={cinema.id} 
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{cinema.name}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{cinema.area} · {cinema.distance}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cinema.amenities.slice(0, 3).map(a => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes Row */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {cinema.showtimes.map(st => (
                      <button
                        key={st.time}
                        onClick={() => {
                          setSelectedCinema(cinema);
                          setSelectedShowtime(st);
                          setStep('seats');
                        }}
                        className="group flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-white/5 hover:bg-[#f84464] border border-white/10 hover:border-[#f84464] transition-all text-center min-w-[90px]"
                      >
                        <span className="text-xs font-bold text-white group-hover:text-white">
                          {st.time}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-white/80">
                          {st.format}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400 group-hover:text-white">
                          ₹{st.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: INTERACTIVE SEAT MAP */}
        {step === 'seats' && selectedCinema && selectedShowtime && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col justify-between">
            {/* Show info bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-slate-300">
              <div>
                <span className="font-bold text-white">{selectedCinema.name}</span>
                <span className="text-slate-500 mx-2">|</span>
                <span>{selectedDate.dayOfWeek}, {selectedDate.dayNumber} {selectedDate.month}</span>
                <span className="text-slate-500 mx-2">|</span>
                <span className="font-semibold text-[#f84464]">{selectedShowtime.time} ({selectedShowtime.format})</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Max 8 seats per booking</span>
              </div>
            </div>

            {/* Interactive Audi Seating Layout */}
            <div className="py-6 flex flex-col items-center">
              
              {/* Screen Top Arc with BookMyShow "All eyes this way" */}
              <div className="w-full max-w-lg mb-8 text-center">
                <div className="h-2 w-full rounded-t-full bg-gradient-to-r from-transparent via-[#f84464] to-transparent shadow-[0_-8px_20px_rgba(248,68,100,0.4)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mt-2">
                  SCREEN THIS WAY
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-2.5 w-full max-w-xl">
                {ROWS.map(r => (
                  <div key={r.row} className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="w-4 text-[10px] font-bold text-slate-400 text-center">{r.row}</span>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {Array.from({ length: 14 }).map((_, seatIdx) => {
                        const seatNum = seatIdx + 1;
                        const seatId = `${r.row}${seatNum}`;
                        const isOccupied = isSeatOccupied(r.row, seatNum);
                        const isSelected = selectedSeats.includes(seatId);

                        // Aisle gap after seat 4 and seat 10
                        const isAisle = seatNum === 4 || seatNum === 10;

                        return (
                          <React.Fragment key={seatId}>
                            <button
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seatId)}
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                                isOccupied
                                  ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#f84464] text-white border border-[#f84464] shadow-md shadow-[#f84464]/30 scale-105'
                                  : 'bg-white/10 hover:bg-white/25 text-slate-200 border border-white/15'
                              }`}
                              title={`${seatId} - ${r.tier} (₹${r.price})`}
                            >
                              {seatNum}
                            </button>
                            {isAisle && <div className="w-3 sm:w-5" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/10 border border-white/15" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#f84464]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/5 border border-white/5 opacity-50" />
                  <span>Sold Out</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Selected Seats & Next Step */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">
                  {selectedSeats.length > 0 ? `${selectedSeats.length} Seat(s): ${selectedSeats.join(', ')}` : 'No seats selected'}
                </span>
                <span className="text-base font-bold text-white tabular-nums">
                  ₹{ticketAmount}
                </span>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('snacks')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedSeats.length > 0
                    ? 'bg-[#f84464] hover:bg-[#e03756] text-white shadow-lg shadow-[#f84464]/30'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Add Snacks & Combos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SNACKS & BEVERAGES */}
        {step === 'snacks' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>Grab a Bite & Save Up to 20%</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Delivered right to your seat in Audi 03 before interval
                </p>
              </div>

              <button
                onClick={() => setStep('checkout')}
                className="text-xs text-[#f84464] font-semibold hover:underline"
              >
                Skip to Checkout →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {FOOD_ITEMS.map(item => {
                const qty = cartFood[item.id] || 0;
                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-slate-200 tabular-nums">₹{item.price}</span>
                        <span className="text-[10px] text-slate-500">{item.calories}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 bg-white/10 rounded-xl p-1 border border-white/10">
                      <button
                        onClick={() => setCartFood({ ...cartFood, [item.id]: Math.max(0, qty - 1) })}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white tabular-nums">{qty}</span>
                      <button
                        onClick={() => setCartFood({ ...cartFood, [item.id]: qty + 1 })}
                        className="w-7 h-7 rounded-lg bg-[#f84464] hover:bg-[#e03756] text-white flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Food & Beverage Subtotal</span>
                <span className="text-base font-bold text-white tabular-nums">₹{foodTotal}</span>
              </div>

              <button
                onClick={() => setStep('checkout')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#f84464]/30 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CHECKOUT & ORDER BREAKDOWN */}
        {step === 'checkout' && selectedCinema && selectedShowtime && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Booking Summary
              </h4>

              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h5 className="text-base font-bold text-white">{movie.title}</h5>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedCinema.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedDate.dayOfWeek}, {selectedDate.dayNumber} {selectedDate.month} · {selectedShowtime.time} ({selectedShowtime.format})
                  </p>
                  <p className="text-xs text-[#f84464] font-semibold mt-1">
                    Audi 03 · Seats: {selectedSeats.join(', ')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{selectedSeats.length} Ticket(s)</span>
                  <span className="text-sm font-bold text-white tabular-nums">₹{ticketAmount}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code (SHOWPASS50, BMSFREE)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-500 uppercase focus:outline-none focus:border-[#f84464]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                  <span>Code <b>{appliedPromo.code}</b> applied!</span>
                  <span className="font-bold">-₹{appliedPromo.discount}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span>Tickets Base Subtotal</span>
                  <span className="tabular-nums">₹{ticketAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Integrated Convenience Fee</span>
                  <span className="tabular-nums">₹{convenienceFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Integrated GST (18%)</span>
                  <span className="tabular-nums">₹{gst}</span>
                </div>

                {foodTotal > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>Food & Snacks Subtotal</span>
                    <span className="tabular-nums">+₹{foodTotal}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold text-white">
                  <span>Grand Total to Pay</span>
                  <span className="text-lg text-[#f84464] tabular-nums">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 px-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Guaranteed Official M-Ticket with Instant QR Entry</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep('seats')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Change Seats
              </button>

              <button
                onClick={handleConfirmPayment}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white text-sm font-bold shadow-xl shadow-[#f84464]/30 transition-all hover:scale-102"
              >
                <Check className="w-4 h-4" />
                <span>Pay ₹{grandTotal} & Confirm</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMED E-TICKET PASS */}
        {step === 'confirmed' && confirmedBooking && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white">Booking Confirmed!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your ticket has been booked and saved to Local Storage. Show this pass at the cinema turnstile.
              </p>
            </div>

            {/* Cinematic M-Ticket Card */}
            <div className="max-w-md mx-auto rounded-3xl bg-[#1c1c22] border border-white/15 shadow-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f84464] via-amber-400 to-[#f84464]" />

              <div className="flex items-start justify-between gap-4 pb-4 border-b border-dashed border-white/20">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#f84464] block">
                    BOOKING REFERENCE
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {confirmedBooking.bookingId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">TOTAL PAID</span>
                  <span className="text-base font-bold text-white tabular-nums">₹{confirmedBooking.totalPaid}</span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <h5 className="text-base font-bold text-white">{confirmedBooking.movieTitle}</h5>
                <p className="text-xs text-slate-300">{confirmedBooking.cinemaName}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>📅 {confirmedBooking.date}</span>
                  <span>⏰ {confirmedBooking.time}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-500 uppercase block">AUDITORIUM</span>
                    <span className="text-xs font-bold text-white">{confirmedBooking.audi}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-500 uppercase block">SEATS ({confirmedBooking.seats.length})</span>
                    <span className="text-xs font-bold text-[#f84464]">{confirmedBooking.seats.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="pt-4 border-t border-dashed border-white/20 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-white block">Scan for Turnstile Entry</span>
                  <span className="text-[10px]">Gate opens 20 mins prior</span>
                </div>

                {/* Styled SVG QR Code */}
                <div className="p-2 bg-white rounded-xl shadow-md">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
