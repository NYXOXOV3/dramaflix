export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  synopsis: string;
  coverImage: string;
  bannerImage?: string;
  videoUrl?: string;
  tmdbId?: number;
  country: string;
  status: "Ongoing" | "Completed";
  genre: string[];
  provider: string;
  providerSlug: string;
  rating: number;
  views: number;
  totalEpisodes: number;
  freeEpisodes: number;
  year: number;
  isVipOnly: boolean;
  isTrending: boolean;
  isNew: boolean;
  category: "drama" | "movie" | "anime" | "donghua" | "tvshow";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  movieId: string;
  episodeNumber: number;
  title: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  isFree: boolean;
  isVipOnly: boolean;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  totalMovies: number;
  isVipOnly: boolean;
  isComingSoon: boolean;
}

export interface VipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number;
  durationUnit: "days" | "months" | "lifetime";
  features: string[];
  maxDevices: number;
  isPopular: boolean;
  isPromo: boolean;
  originalPrice?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  vipPlan?: string;
  vipExpiresAt?: string;
  myList: string[];
  watchHistory: WatchHistoryItem[];
}

export interface WatchHistoryItem {
  movieId: string;
  lastEpisode: number;
  progress: number;
  watchedAt: string;
}

export interface RankingItem {
  rank: number;
  movie: Movie;
  score: number;
}

export interface SearchResult {
  movies: Movie[];
  total: number;
  query: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  logo?: string;
  isAuto?: boolean;
  priority: number;
}
