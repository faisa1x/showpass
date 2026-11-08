import React, { useState } from 'react';
import { Film, Star, Sparkles, Tv, Music } from 'lucide-react';
import { Movie } from '../types';

interface MoviePosterProps {
  movie: Movie;
  className?: string;
  showBadge?: boolean;
  priority?: boolean;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  movie,
  className = '',
  showBadge = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback icon based on type
  const renderIcon = () => {
    if (movie.type === 'show') return <Tv className="w-8 h-8 text-white/40" />;
    if (movie.type === 'event') return <Music className="w-8 h-8 text-white/40" />;
    return <Film className="w-8 h-8 text-white/40" />;
  };

  return (
    <div className={`relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-900 shadow-md ${className}`}>
      {/* Background Styled Fallback Always Rendered Underneath */}
      <div 
        className="absolute inset-0 flex flex-col justify-between p-4"
        style={{
          background: `linear-gradient(145deg, #18181b 0%, ${movie.themeColor}33 50%, #09090b 100%)`
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            {movie.certification}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {movie.duration}
          </span>
        </div>

        <div className="my-auto flex flex-col items-center text-center">
          <div className="mb-2 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            {renderIcon()}
          </div>
          <h4 className="text-sm font-bold text-white leading-tight px-1 line-clamp-2">
            {movie.title}
          </h4>
          <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
            {movie.genres.join(', ')}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {movie.languages[0]}
          </span>
          <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>

      {/* Main Image Layer (Graceful transition once loaded, hidden if failed) */}
      {!imageError && movie.posterUrl && (
        <img
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Dark gradient scrim at the bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Ribbon / Badge (if applicable and requested) */}
      {showBadge && movie.badge && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 rounded bg-[#f84464] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            {movie.badge}
          </span>
        </div>
      )}

      {/* Rating Strip at bottom of poster - BookMyShow Signature Pattern */}
      <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between rounded-lg bg-black/75 px-2.5 py-1.5 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-white tabular-nums">{movie.rating.toFixed(1)}/10</span>
        </div>
        <span className="text-[10px] font-medium text-slate-300 tabular-nums">{movie.votes}</span>
      </div>
    </div>
  );
};
