import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CatalogSection } from './components/CatalogSection';
import { MovieDetailModal } from './components/MovieDetailModal';
import { BookingFlowModal } from './components/BookingFlowModal';
import { CityModal } from './components/CityModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';
import { MOVIES_DATA } from './data/moviesData';
import { Movie, Booking } from './types';
import { 
  getStoredCity, setStoredCity, 
  getStoredBookings, 
  getStoredWatchlist, toggleWatchlist 
} from './utils/storage';
import { Film, Tv, Music, Ticket, Heart } from 'lucide-react';

export default function App() {
  // Local storage synced states
  const [selectedCity, setSelectedCityState] = useState<string>(() => getStoredCity());
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings());
  const [watchlist, setWatchlist] = useState<string[]>(() => getStoredWatchlist());

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<Movie | null>(null);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);

  // Modals & Drawers state
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [isWatchlistDrawerOpen, setIsWatchlistDrawerOpen] = useState(false);

  const handleCityChange = (newCityId: string) => {
    setSelectedCityState(newCityId);
    setStoredCity(newCityId);
  };

  const handleToggleWatchlist = (movieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleWatchlist(movieId);
    setWatchlist(updated);
  };

  const handleRemoveFromWatchlist = (movieId: string) => {
    const updated = toggleWatchlist(movieId);
    setWatchlist(updated);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-slate-100 flex flex-col font-sans selection:bg-[#f84464] selection:text-white pb-16 sm:pb-0">
      
      {/* Main Header with Top Bar Contract & Predictive Search */}
      <Header
        selectedCity={selectedCity}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        movies={MOVIES_DATA}
        onSelectMovie={movie => setSelectedMovieForDetail(movie)}
        bookingsCount={bookings.filter(b => b.status === 'confirmed').length}
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistDrawerOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={cat => setActiveCategory(cat)}
      />

      <main className="flex-1">
        {/* Blockbuster Hero Carousel (Shown on 'all' or 'movies' view) */}
        {(activeCategory === 'all' || activeCategory === 'movies') && (
          <HeroCarousel
            onBookMovie={movie => setSelectedMovieForBooking(movie)}
            onSelectMovie={movie => setSelectedMovieForDetail(movie)}
          />
        )}

        {/* 100 Movies and Shows Catalog Grid */}
        <CatalogSection
          movies={MOVIES_DATA}
          category={activeCategory}
          isWatchlisted={id => watchlist.includes(id)}
          onToggleWatchlist={handleToggleWatchlist}
          onSelectMovie={movie => setSelectedMovieForDetail(movie)}
          onBookMovie={movie => setSelectedMovieForBooking(movie)}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectCity={handleCityChange}
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
      />

      {/* Mobile Bottom Quick Bar for quick navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16161a]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400">
        <button
          onClick={() => {
            setActiveCategory('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1 ${activeCategory === 'movies' ? 'text-[#f84464] font-bold' : ''}`}
        >
          <Film className="w-4 h-4 mb-0.5" />
          <span>Movies</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('shows');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1 ${activeCategory === 'shows' ? 'text-[#f84464] font-bold' : ''}`}
        >
          <Tv className="w-4 h-4 mb-0.5" />
          <span>Stream</span>
        </button>

        <button
          onClick={() => {
            setActiveCategory('events');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1 ${activeCategory === 'events' ? 'text-[#f84464] font-bold' : ''}`}
        >
          <Music className="w-4 h-4 mb-0.5" />
          <span>Live</span>
        </button>

        <button
          onClick={() => setIsWatchlistDrawerOpen(true)}
          className="relative flex flex-col items-center p-1"
        >
          <Heart className="w-4 h-4 mb-0.5 text-rose-400" />
          <span>Watchlist</span>
          {watchlist.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setIsBookingsDrawerOpen(true)}
          className="relative flex flex-col items-center p-1"
        >
          <Ticket className="w-4 h-4 mb-0.5 text-[#f84464]" />
          <span>Bookings</span>
          {bookings.filter(b => b.status === 'confirmed').length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#f84464]" />
          )}
        </button>
      </nav>

      {/* Modals & Drawers */}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={handleCityChange}
      />

      <MovieDetailModal
        movie={selectedMovieForDetail}
        isOpen={!!selectedMovieForDetail}
        onClose={() => setSelectedMovieForDetail(null)}
        onBookMovie={movie => setSelectedMovieForBooking(movie)}
        isWatchlisted={selectedMovieForDetail ? watchlist.includes(selectedMovieForDetail.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <BookingFlowModal
        movie={selectedMovieForBooking}
        isOpen={!!selectedMovieForBooking}
        onClose={() => setSelectedMovieForBooking(null)}
        selectedCity={selectedCity}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <MyBookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        bookings={bookings}
        onUpdateBookings={setBookings}
      />

      <WatchlistDrawer
        isOpen={isWatchlistDrawerOpen}
        onClose={() => setIsWatchlistDrawerOpen(false)}
        watchlistIds={watchlist}
        allMovies={MOVIES_DATA}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onSelectMovie={movie => setSelectedMovieForDetail(movie)}
        onBookMovie={movie => setSelectedMovieForBooking(movie)}
      />

    </div>
  );
}
