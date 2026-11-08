import { Booking, UserReview } from '../types';
import { INITIAL_REVIEWS } from '../data/moviesData';

const STORAGE_KEYS = {
  CITY: 'showpass_selected_city',
  BOOKINGS: 'showpass_user_bookings',
  WATCHLIST: 'showpass_user_watchlist',
  REVIEWS: 'showpass_user_reviews',
  USER_PROFILE: 'showpass_user_profile'
};

export const getStoredCity = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CITY) || 'mumbai';
  } catch {
    return 'mumbai';
  }
};

export const setStoredCity = (cityId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CITY, cityId);
  } catch (e) {
    console.error('Failed to save city', e);
  }
};

export const getStoredBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveBooking = (booking: Booking): Booking[] => {
  try {
    const current = getStoredBookings();
    const updated = [booking, ...current];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save booking', e);
    return [];
  }
};

export const cancelBooking = (bookingId: string): Booking[] => {
  try {
    const current = getStoredBookings();
    const updated = current.map(b => 
      b.bookingId === bookingId ? { ...b, status: 'cancelled' as const } : b
    );
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to cancel booking', e);
    return [];
  }
};

export const getStoredWatchlist = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    // Initialize with a few popular favorites if empty for immediate delight
    return raw ? JSON.parse(raw) : ['m1', 'm2', 'm4', 'm39'];
  } catch {
    return ['m1', 'm2', 'm4', 'm39'];
  }
};

export const toggleWatchlist = (movieId: string): string[] => {
  try {
    const current = getStoredWatchlist();
    const exists = current.includes(movieId);
    const updated = exists ? current.filter(id => id !== movieId) : [...current, movieId];
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle watchlist', e);
    return [];
  }
};

export const getStoredReviews = (movieId: string): UserReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const allReviews: Record<string, UserReview[]> = raw ? JSON.parse(raw) : {};
    const movieCustomReviews = allReviews[movieId] || [];
    const initialMovieReviews = INITIAL_REVIEWS[movieId] || [];
    // Merge without duplicates
    const combined = [...movieCustomReviews, ...initialMovieReviews];
    return combined;
  } catch {
    return INITIAL_REVIEWS[movieId] || [];
  }
};

export const addReview = (
  movieId: string,
  reviewData: { userName: string; rating: number; comment: string; tags?: string[] }
): UserReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    const allReviews: Record<string, UserReview[]> = raw ? JSON.parse(raw) : {};
    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      movieId,
      userName: reviewData.userName || 'Movie Buff',
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: 'Today',
      likes: 1,
      tags: reviewData.tags || ['Verified Viewer']
    };

    allReviews[movieId] = [newReview, ...(allReviews[movieId] || [])];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
    return getStoredReviews(movieId);
  } catch (e) {
    console.error('Failed to add review', e);
    return [];
  }
};
