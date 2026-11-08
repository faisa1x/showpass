import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Sparkles, X, ChevronDown } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface CatalogSectionProps {
  movies: Movie[];
  category: string;
  isWatchlisted: (id: string) => boolean;
  onToggleWatchlist: (id: string, e: React.MouseEvent) => void;
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
}

const LANGUAGES = ['All', 'Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada', 'Punjabi'];
const FORMATS = ['All', '2D', '3D', 'IMAX 3D', '4DX', 'Dolby Cinema'];
const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Horror', 'Animation', 'Biography'];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  movies,
  category,
  isWatchlisted,
  onToggleWatchlist,
  onSelectMovie,
  onBookMovie,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest'>('popularity');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter based on active category, language, format, and genre
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      // Category filter
      if (category === 'movies' && movie.type !== 'movie') return false;
      if (category === 'shows' && movie.type !== 'show') return false;
      if (category === 'events' && movie.type !== 'event') return false;
      if (category === 'upcoming' && movie.status !== 'upcoming') return false;

      // Language filter
      if (selectedLanguage !== 'All' && !movie.languages.includes(selectedLanguage)) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'All' && !movie.formats.includes(selectedFormat)) {
        return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      // Popularity default
      return parseFloat(b.votes.replace('K', '')) - parseFloat(a.votes.replace('K', ''));
    });
  }, [movies, category, selectedLanguage, selectedFormat, selectedGenre, sortBy]);

  const hasActiveFilters = selectedLanguage !== 'All' || selectedFormat !== 'All' || selectedGenre !== 'All';

  const resetFilters = () => {
    setSelectedLanguage('All');
    setSelectedFormat('All');
    setSelectedGenre('All');
    setSortBy('popularity');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>
              {category === 'movies' ? 'Movies in Theatres' :
               category === 'shows' ? 'Top Stream & OTT Shows' :
               category === 'events' ? 'Live Events & Stand-Up Comedy' :
               category === 'upcoming' ? 'Anticipated Upcoming Releases' :
               'Explore 100 Latest Indian & International Blockbusters'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing <span className="font-bold text-white tabular-nums">{filteredMovies.length}</span> titles with verified showtimes & instant pass booking
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#f84464]" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#1c1c20] text-white border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#f84464]"
            >
              <option value="popularity">Most Popular (Votes)</option>
              <option value="rating">Top Rated (Rating ⭐)</option>
              <option value="newest">Release Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bars (Desktop & Mobile Drawer) */}
      <div className={`mt-4 space-y-3 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
        
        {/* Languages Segmented Row (§1.A interactive button tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
            Language:
          </span>
          {LANGUAGES.map(lang => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#f84464] text-white font-bold shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Genres & Formats Secondary Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Genre select pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
              Genre:
            </span>
            {GENRES.map(g => {
              const isSelected = selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-white text-slate-900 font-bold'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {/* Reset Filters button if any are applied */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] text-[#f84464] hover:underline font-semibold ml-auto"
            >
              <X className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Movies */}
      <div className="mt-8">
        {filteredMovies.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white/2 border border-white/5 p-8">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Matching Titles Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any movie or show matching the selected filters. Try choosing different genres or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#f84464] text-white text-xs font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isWatchlisted={isWatchlisted(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
                onSelectMovie={onSelectMovie}
                onBookMovie={onBookMovie}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
};
