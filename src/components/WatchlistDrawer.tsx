import React from 'react';
import { X, Heart, Star, Ticket, Trash2 } from 'lucide-react';
import { Movie } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistIds: string[];
  allMovies: Movie[];
  onRemoveFromWatchlist: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onBookMovie: (movie: Movie) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistIds,
  allMovies,
  onRemoveFromWatchlist,
  onSelectMovie,
  onBookMovie,
}) => {
  if (!isOpen) return null;

  const savedMovies = allMovies.filter(m => watchlistIds.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#16161a] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#121214]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-base font-bold text-white">Your Watchlist</h3>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-bold tabular-nums">
              {savedMovies.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Movies List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
          {savedMovies.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Heart className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-sm font-bold text-white">Your Watchlist is Empty</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Tap the heart icon on any movie poster to bookmark it for later booking.
              </p>
            </div>
          ) : (
            savedMovies.map(movie => (
              <div
                key={movie.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-all flex items-center gap-3.5 group"
              >
                <div 
                  className="w-14 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectMovie(movie);
                  }}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      onClose();
                      onSelectMovie(movie);
                    }}
                    className="text-xs font-bold text-white hover:text-[#f84464] transition-colors truncate cursor-pointer"
                  >
                    {movie.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {movie.genres.join(', ')} · {movie.languages[0]}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {movie.rating}
                    </span>
                    <span>·</span>
                    <span className="uppercase">{movie.certification}</span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onBookMovie(movie);
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#f84464] hover:bg-[#e03756] text-white text-[11px] font-bold transition-colors"
                    >
                      <Ticket className="w-3 h-3" />
                      <span>Book</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWatchlist(movie.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121214] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with Local Storage</span>
          <button onClick={onClose} className="text-white hover:underline font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
