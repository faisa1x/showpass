import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Ticket, Play } from 'lucide-react';
import { HERO_BANNERS, MOVIES_DATA } from '../data/moviesData';
import { Movie } from '../types';

interface HeroCarouselProps {
  onBookMovie: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onBookMovie,
  onSelectMovie,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = HERO_BANNERS[currentIndex];
  const matchedMovie = MOVIES_DATA.find(m => m.id === currentBanner.movieId) || MOVIES_DATA[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % HERO_BANNERS.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          
          {/* Banner Image with measured contrast scrim (§1.F) */}
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />

          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent flex flex-col justify-end sm:justify-center p-6 sm:p-12" />

          {/* Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-12 max-w-2xl z-10">
            <div className="flex items-center gap-2 mb-2 text-xs text-slate-300">
              <span className="bg-[#f84464] text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
                FEATURED BLOCKBUSTER
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline uppercase font-medium">{currentBanner.certification}</span>
              <span>·</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="tabular-nums">{currentBanner.rating}/10</span>
                <span className="text-slate-400 text-[11px] font-normal">({currentBanner.votes})</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight line-clamp-1">
              {currentBanner.title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl">
              {currentBanner.tagline}
            </p>

            {/* Language & Format pill tags */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span className="text-slate-400">Available in:</span>
              <span className="font-medium text-white">{currentBanner.languages.slice(0, 3).join(', ')}</span>
              <span className="text-slate-500">·</span>
              <div className="flex gap-1">
                {currentBanner.formats.map(fmt => (
                  <span key={fmt} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => onBookMovie(matchedMovie)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#f84464]/30 transition-all hover:scale-102"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </button>

              <button
                onClick={() => onSelectMovie(matchedMovie)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-medium backdrop-blur-md transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Trailer & Details</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-opacity opacity-0 group-hover:opacity-100 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-opacity opacity-0 group-hover:opacity-100 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
            {HERO_BANNERS.map((banner, idx) => (
              <button
                key={banner.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-[#f84464]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
