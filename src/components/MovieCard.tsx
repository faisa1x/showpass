import React from 'react';
import { Heart, Ticket } from 'lucide-react';
import { Movie } from '../types';
import { MoviePoster } from './MoviePoster';

interface MovieCardProps {
  movie: Movie;
  isWatchlisted: boolean;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isWatchlisted,
  onToggleWatchlist,
  onSelectMovie,
  onBookMovie,
}) => {
  return (
    <div 
      className="group relative flex flex-col rounded-2xl bg-[#18181c] border border-white/5 p-2.5 transition-all duration-200 hover:-translate-y-1 hover:border-white/15 hover:shadow-xl hover:shadow-black/50"
    >
      {/* Poster Container with Watchlist Overlay */}
      <div 
        className="relative cursor-pointer overflow-hidden rounded-xl"
        onClick={() => onSelectMovie(movie)}
      >
        <MoviePoster movie={movie} />

        {/* Watchlist Floating Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie.id, e);
          }}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
            isWatchlisted
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
              : 'bg-black/50 text-white/80 hover:bg-black/80 hover:text-white'
          }`}
          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Movie Details (Clean Unboxed Metadata per §1.A) */}
      <div className="flex flex-col flex-1 pt-3 pb-1 px-1">
        <h3 
          onClick={() => onSelectMovie(movie)}
          className="text-sm font-bold text-white group-hover:text-[#f84464] transition-colors line-clamp-1 cursor-pointer"
          title={movie.title}
        >
          {movie.title}
        </h3>

        {/* Clean unboxed metadata with subtle typographic separators */}
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="truncate">{movie.genres.slice(0, 2).join('/')}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0 uppercase text-[10px] font-semibold text-slate-300">
            {movie.certification}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-slate-300 font-medium truncate">
            {movie.languages.slice(0, 2).join(', ')}
          </span>
          <span className="font-mono text-[10px] text-slate-400 shrink-0">
            {movie.formats.slice(0, 2).join(', ')}
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">From</span>
            <span className="text-xs font-bold text-slate-200 tabular-nums">
              ₹{movie.basePrice}
            </span>
          </div>

          <button
            onClick={() => onBookMovie(movie)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f84464] hover:bg-[#e03756] text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm shadow-[#f84464]/20"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
