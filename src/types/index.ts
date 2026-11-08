export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'show' | 'event';
  languages: string[];
  formats: string[];
  genres: string[];
  duration: string;
  rating: number; // 0 - 10
  votes: string;
  certification: 'U' | 'U/A' | 'U/A 16+' | 'A';
  releaseDate: string;
  synopsis: string;
  director: string;
  cast: { name: string; role: string }[];
  posterUrl: string;
  backdropUrl?: string;
  themeColor: string;
  badge?: 'BLOCKBUSTER' | 'PREMIERE' | 'TRENDING' | 'SELLING FAST' | 'NEW RELEASE';
  status: 'now-showing' | 'upcoming' | 'binge-stream';
  origin: 'bollywood' | 'south' | 'hollywood' | 'regional' | 'live';
  basePrice: number;
}

export interface CinemaShowtime {
  time: string;
  format: string;
  price: number;
  status: 'available' | 'fast-filling' | 'almost-full';
}

export interface Cinema {
  id: string;
  name: string;
  area: string;
  distance: string;
  amenities: string[];
  showtimes: CinemaShowtime[];
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Snacks' | 'Beverages' | 'Combos';
  price: number;
  isVeg: boolean;
  calories: string;
  description: string;
}

export interface Booking {
  bookingId: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  city: string;
  date: string;
  time: string;
  format: string;
  audi: string;
  seats: string[];
  seatTier: string;
  ticketAmount: number;
  convenienceFee: number;
  foodItems: { name: string; qty: number; price: number }[];
  discount: number;
  totalPaid: number;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface UserReview {
  id: string;
  movieId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  tags?: string[];
}
