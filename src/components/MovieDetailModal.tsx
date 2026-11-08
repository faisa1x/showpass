import React, { useState } from 'react';
import { X, Star, Heart, Calendar, Clock, Film, Share2, ThumbsUp, MessageSquarePlus, Ticket } from 'lucide-react';
import { Movie, UserReview } from '../types';
import { MoviePoster } from './MoviePoster';
import { getStoredReviews, addReview } from '../utils/storage';

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onBookMovie: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  isOpen,
  onClose,
  onBookMovie,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!isOpen || !movie) return null;

  const [reviews, setReviews] = useState<UserReview[]>(() => getStoredReviews(movie.id));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(10);
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const updated = addReview(movie.id, {
      userName: userName.trim() || 'Film Enthusiast',
      rating: userRating,
      comment: userComment.trim(),
      tags: ['Verified Booking']
    });

    setReviews(updated);
    setUserComment('');
    setShowReviewForm(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#16161a] border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover blur-sm scale-110 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-[#16161a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16161a] via-transparent to-transparent" />

          {/* Floating Content Over Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
            <div className="w-28 sm:w-36 shrink-0 shadow-2xl rounded-xl overflow-hidden border border-white/20 hidden xs:block">
              <MoviePoster movie={movie} showBadge={false} />
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-slate-300">
                <span className="px-2 py-0.5 rounded bg-white/10 font-bold uppercase text-[10px] text-white">
                  {movie.type === 'movie' ? 'In Cinemas' : movie.type === 'show' ? 'OTT Binge' : 'Live Show'}
                </span>
                <span className="font-semibold uppercase tracking-wider text-slate-400">
                  {movie.certification}
                </span>
                <span>·</span>
                <span className="font-medium">{movie.duration}</span>
                <span>·</span>
                <span>{movie.releaseDate}</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                {movie.genres.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Rating and CTAs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white tabular-nums">{movie.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">{movie.votes} reviews</div>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-[1px] bg-white/10" />

              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-[#f84464]" />
                <span>Rate Now</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => onToggleWatchlist(movie.id, e)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWatchlisted
                    ? 'bg-rose-500/15 border-rose-500 text-rose-400'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
                title="Add to Watchlist"
              >
                <Heart className={`w-4 h-4 ${isWatchlisted ? 'fill-rose-400' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookMovie(movie);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white text-sm font-bold shadow-lg shadow-[#f84464]/25 transition-all hover:scale-102"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </button>
            </div>
          </div>

          {copiedLink && (
            <div className="p-2 text-center text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
              Movie page link copied to clipboard!
            </div>
          )}

          {/* Formats and Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Available Languages
              </div>
              <div className="flex flex-wrap gap-1.5">
                {movie.languages.map(lang => (
                  <span key={lang} className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-200 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Projection & Sound Formats
              </div>
              <div className="flex flex-wrap gap-1.5">
                {movie.formats.map(fmt => (
                  <span key={fmt} className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-white font-mono font-semibold">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              About the Movie
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Director & Cast */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Cast & Crew
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Director</span>
                <p className="text-xs font-bold text-white mt-0.5 truncate">{movie.director}</p>
              </div>

              {movie.cast.map(c => (
                <div key={c.name} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider truncate block">
                    {c.role}
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 truncate">{c.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive User Review Form (Stored in localStorage!) */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-white/5 border border-[#f84464]/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Write Your Review & Rating</h4>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        userRating >= star
                          ? 'bg-amber-400 text-slate-900 shadow-sm'
                          : 'bg-white/10 text-slate-400 hover:bg-white/20'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f84464]"
                />
              </div>

              <textarea
                placeholder="Share your thoughts on the performances, music, direction, and plot..."
                value={userComment}
                onChange={e => setUserComment(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f84464]"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white text-xs font-bold transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          {/* User Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Audience Reviews ({reviews.length})
              </h3>
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs font-semibold text-[#f84464] hover:underline"
                >
                  + Add Your Review
                </button>
              )}
            </div>

            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#f84464]/20 text-[#f84464] font-bold text-xs flex items-center justify-center">
                        {rev.userName[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{rev.userName}</div>
                        <div className="text-[10px] text-slate-500">{rev.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating}/10</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {rev.tags.map(t => (
                        <span key={t} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Mobile/Desktop Footer Booking CTA */}
        <div className="p-4 sm:p-6 bg-[#121214] border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Standard Tickets From</span>
            <span className="text-lg font-black text-white tabular-nums">₹{movie.basePrice}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookMovie(movie);
            }}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#f84464] hover:bg-[#e03756] text-white text-sm font-bold shadow-lg shadow-[#f84464]/30 transition-all hover:scale-102"
          >
            <Ticket className="w-4 h-4" />
            <span>Select Showtimes & Seats</span>
          </button>
        </div>

      </div>
    </div>
  );
};
