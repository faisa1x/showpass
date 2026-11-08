import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Ticket, Heart, ChevronDown, X, Film, Tv, Music, Star } from 'lucide-react';
import { Movie } from '../types';
import { CITIES } from '../data/moviesData';

interface HeaderProps {
  selectedCity: string;
  onOpenCityModal: () => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  bookingsCount: number;
  onOpenBookings: () => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onOpenCityModal,
  movies,
  onSelectMovie,
  bookingsCount,
  onOpenBookings,
  watchlistCount,
  onOpenWatchlist,
  activeCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cityName = CITIES.find(c => c.id === selectedCity)?.name || 'Mumbai';

  // Instant predictive search results (match title, cast, genre, language)
  const searchResults = searchQuery.trim().length > 1
    ? movies.filter(m => {
        const query = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(query) ||
          m.genres.some(g => g.toLowerCase().includes(query)) ||
          m.languages.some(l => l.toLowerCase().includes(query)) ||
          m.cast.some(c => c.name.toLowerCase().includes(query)) ||
          m.director.toLowerCase().includes(query)
        );
      }).slice(0, 6)
    : [];

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#16161a]/95 backdrop-blur-md border-b border-white/10">
      {/* Top Bar Zone Contract: Brand - 4-5 Nav Links - Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left flex items-center gap-1.5 focus:outline-none"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Show<span className="text-[#f84464]">Pass</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                Tickets
              </span>
            </button>

            {/* City Selector Quick Button */}
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              title="Change your current city"
            >
              <MapPin className="w-3.5 h-3.5 text-[#f84464]" />
              <span className="truncate max-w-[100px]">{cityName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Zone 2: Global Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies, series, shows, actors, or genres..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#f84464] focus:bg-white/10 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Predictive Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c20] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium px-3">
                  <span>Found {searchResults.length} matches</span>
                  <span>Press Esc to close</span>
                </div>
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto custom-scrollbar">
                  {searchResults.map(movie => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        onSelectMovie(movie);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-10 h-14 rounded overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#f84464] transition-colors truncate">
                          {movie.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {movie.genres.join(', ')} · {movie.languages[0]}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {movie.rating}
                          </span>
                          <span>·</span>
                          <span>{movie.duration}</span>
                          <span>·</span>
                          <span className="uppercase">{movie.certification}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Zone 3: Primary Actions (Watchlist + My Bookings) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Watchlist Button */}
            <button
              onClick={onOpenWatchlist}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
              title="View your saved movies"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="rounded-full bg-rose-500/20 text-rose-300 px-1.5 py-0.2 text-[10px] font-bold">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* My Bookings Button */}
            <button
              onClick={onOpenBookings}
              className="relative px-3.5 py-2 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white transition-colors flex items-center gap-2 text-xs font-semibold shadow-md shadow-[#f84464]/20"
              title="View booked movie tickets"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">My Bookings</span>
              {bookingsCount > 0 && (
                <span className="rounded-full bg-white text-[#f84464] px-1.5 py-0.2 text-[10px] font-bold">
                  {bookingsCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Secondary Navigation Row: Category Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2.5 border-t border-white/5 text-xs font-medium">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeCategory === 'all'
                ? 'text-[#f84464] font-bold border-b-2 border-[#f84464]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All 100 Releases
          </button>
          <button
            onClick={() => onSelectCategory('movies')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeCategory === 'movies'
                ? 'text-[#f84464] font-bold border-b-2 border-[#f84464]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Movies in Cinemas
          </button>
          <button
            onClick={() => onSelectCategory('shows')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeCategory === 'shows'
                ? 'text-[#f84464] font-bold border-b-2 border-[#f84464]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Stream & Web Series
          </button>
          <button
            onClick={() => onSelectCategory('events')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeCategory === 'events'
                ? 'text-[#f84464] font-bold border-b-2 border-[#f84464]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Live Comedy & Events
          </button>
          <button
            onClick={() => onSelectCategory('upcoming')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeCategory === 'upcoming'
                ? 'text-[#f84464] font-bold border-b-2 border-[#f84464]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Anticipated
          </button>
        </div>
      </div>
    </header>
  );
};
