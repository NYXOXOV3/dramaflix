import type { Movie, Episode, Provider, VipPlan } from "./types";

// ============== PROVIDERS ==============
export const providers: Provider[] = [
  { id: "p1", name: "CubeTV", slug: "cubetv", logo: "", totalMovies: 120, isVipOnly: false, isComingSoon: false },
  { id: "p2", name: "ReelShort", slug: "reelshort", logo: "", totalMovies: 200, isVipOnly: false, isComingSoon: false },
  { id: "p3", name: "DramaNova", slug: "dramanova", logo: "", totalMovies: 85, isVipOnly: false, isComingSoon: false },
  { id: "p4", name: "GoodShort", slug: "goodshort", logo: "", totalMovies: 150, isVipOnly: false, isComingSoon: false },
  { id: "p5", name: "ShortMax", slug: "shortmax", logo: "", totalMovies: 95, isVipOnly: false, isComingSoon: false },
  { id: "p6", name: "DramaWave", slug: "dramawave", logo: "", totalMovies: 110, isVipOnly: false, isComingSoon: false },
  { id: "p7", name: "MeloShort", slug: "meloshort", logo: "", totalMovies: 70, isVipOnly: false, isComingSoon: false },
  { id: "p8", name: "NetShort", slug: "netshort", logo: "", totalMovies: 60, isVipOnly: false, isComingSoon: false },
  { id: "p9", name: "StardustTV", slug: "stardusttv", logo: "", totalMovies: 45, isVipOnly: false, isComingSoon: false },
  { id: "p10", name: "BiliTV", slug: "bilitv", logo: "", totalMovies: 80, isVipOnly: false, isComingSoon: false },
  { id: "p11", name: "FlexTV", slug: "flextv", logo: "", totalMovies: 90, isVipOnly: false, isComingSoon: false },
  { id: "p12", name: "FreeReels", slug: "freereels", logo: "", totalMovies: 55, isVipOnly: false, isComingSoon: false },
  { id: "p13", name: "StarShort", slug: "starshort", logo: "", totalMovies: 40, isVipOnly: false, isComingSoon: false },
  { id: "p14", name: "FlickShort", slug: "flickshort", logo: "", totalMovies: 35, isVipOnly: false, isComingSoon: false },
  { id: "p15", name: "DramaBite", slug: "dramabite", logo: "", totalMovies: 65, isVipOnly: false, isComingSoon: false },
  { id: "p16", name: "SarosTV", slug: "sarostv", logo: "", totalMovies: 30, isVipOnly: true, isComingSoon: false },
  { id: "p17", name: "Sereal", slug: "sereal", logo: "", totalMovies: 25, isVipOnly: true, isComingSoon: false },
  { id: "p18", name: "FlareFlow", slug: "flareflow", logo: "", totalMovies: 20, isVipOnly: true, isComingSoon: false },
  { id: "p19", name: "SodaReels", slug: "sodareels", logo: "", totalMovies: 0, isVipOnly: false, isComingSoon: true },
];

// ============== MOVIES ==============
const coverBase = "https://picsum.photos/seed";

export const movies: Movie[] = [
  {
    id: "m1", slug: "hidden-love", title: "Hidden Love", originalTitle: "暗恋的秘密",
    synopsis: "A young woman secretly harbors feelings for her brother's best friend. Years later, fate brings them together in unexpected ways, forcing her to confront her deepest emotions.",
    coverImage: `${coverBase}/hiddenlove/300/450`, bannerImage: `${coverBase}/hiddenlove/1200/400`,
    country: "China", status: "Completed", genre: ["Romance", "Drama"], provider: "CubeTV", providerSlug: "cubetv",
    rating: 4.8, views: 1250000, totalEpisodes: 30, freeEpisodes: 5, year: 2025, isVipOnly: false,
    isTrending: true, isNew: false, category: "drama", createdAt: "2025-01-15", updatedAt: "2025-03-01",
  },
  {
    id: "m2", slug: "ceo-secret-wife", title: "CEO's Secret Wife", originalTitle: "总裁的隐婚妻子",
    synopsis: "After a contract marriage with a powerful CEO, a talented designer must navigate corporate intrigue, family drama, and an unexpected genuine romance.",
    coverImage: `${coverBase}/ceowife/300/450`, bannerImage: `${coverBase}/ceowife/1200/400`,
    country: "China", status: "Ongoing", genre: ["Romance", "Business"], provider: "ReelShort", providerSlug: "reelshort",
    rating: 4.6, views: 980000, totalEpisodes: 45, freeEpisodes: 3, year: 2025, isVipOnly: false,
    isTrending: true, isNew: true, category: "drama", createdAt: "2025-03-10", updatedAt: "2025-06-15",
  },
  {
    id: "m3", slug: "dragon-emperor", title: "The Dragon Emperor", originalTitle: "龙帝传说",
    synopsis: "An ancient warrior awakens in modern times with memories of a past life. He must reclaim his powers and protect the world from an impending darkness.",
    coverImage: `${coverBase}/dragonemp/300/450`, bannerImage: `${coverBase}/dragonemp/1200/400`,
    country: "China", status: "Completed", genre: ["Fantasy", "Action"], provider: "DramaNova", providerSlug: "dramanova",
    rating: 4.5, views: 750000, totalEpisodes: 24, freeEpisodes: 4, year: 2024, isVipOnly: false,
    isTrending: false, isNew: false, category: "donghua", createdAt: "2024-08-20", updatedAt: "2024-12-15",
  },
  {
    id: "m4", slug: "midnight-romance", title: "Midnight Romance", originalTitle: "午夜浪漫",
    synopsis: "Two strangers meet at a midnight café every night without knowing they're business rivals during the day. A sweet love story unfolds under the city lights.",
    coverImage: `${coverBase}/midnight/300/450`, bannerImage: `${coverBase}/midnight/1200/400`,
    country: "Korea", status: "Completed", genre: ["Romance", "Comedy"], provider: "GoodShort", providerSlug: "goodshort",
    rating: 4.7, views: 1100000, totalEpisodes: 20, freeEpisodes: 5, year: 2025, isVipOnly: false,
    isTrending: true, isNew: false, category: "drama", createdAt: "2025-02-01", updatedAt: "2025-04-20",
  },
  {
    id: "m5", slug: "revenge-queen", title: "The Revenge Queen", originalTitle: "复仇女王",
    synopsis: "Betrayed by those closest to her, a woman returns with a new identity to exact revenge on everyone who wronged her family. But love complicates her plans.",
    coverImage: `${coverBase}/revenge/300/450`, bannerImage: `${coverBase}/revenge/1200/400`,
    country: "China", status: "Ongoing", genre: ["Thriller", "Romance"], provider: "ShortMax", providerSlug: "shortmax",
    rating: 4.4, views: 620000, totalEpisodes: 50, freeEpisodes: 3, year: 2025, isVipOnly: false,
    isTrending: true, isNew: true, category: "drama", createdAt: "2025-04-01", updatedAt: "2025-06-10",
  },
  {
    id: "m6", slug: "spirit-blade", title: "Spirit Blade Chronicles", originalTitle: "灵剑记",
    synopsis: "In a world where spirit blades choose their wielders, a young orphan discovers she can wield the legendary Void Blade, setting her on an epic adventure.",
    coverImage: `${coverBase}/spiritblade/300/450`,
    country: "China", status: "Ongoing", genre: ["Fantasy", "Adventure"], provider: "DramaWave", providerSlug: "dramawave",
    rating: 4.3, views: 430000, totalEpisodes: 36, freeEpisodes: 6, year: 2025, isVipOnly: false,
    isTrending: false, isNew: true, category: "anime", createdAt: "2025-05-01", updatedAt: "2025-06-12",
  },
  {
    id: "m7", slug: "forbidden-love", title: "Forbidden Love", originalTitle: "禁忌之恋",
    synopsis: "A prince and a commoner fall deeply in love despite the strict rules of the royal court. Their love story spans political intrigue and deadly conspiracies.",
    coverImage: `${coverBase}/forbidden/300/450`,
    country: "China", status: "Completed", genre: ["Romance", "Historical"], provider: "MeloShort", providerSlug: "meloshort",
    rating: 4.9, views: 1450000, totalEpisodes: 28, freeEpisodes: 4, year: 2024, isVipOnly: false,
    isTrending: true, isNew: false, category: "drama", createdAt: "2024-06-15", updatedAt: "2024-11-30",
  },
  {
    id: "m8", slug: "neon-detective", title: "Neon Detective", originalTitle: "霓虹侦探",
    synopsis: "In a cyberpunk city, a detective with enhanced abilities investigates a series of mysterious disappearances that lead to a powerful tech corporation.",
    coverImage: `${coverBase}/neondet/300/450`,
    country: "Japan", status: "Completed", genre: ["Sci-Fi", "Mystery"], provider: "NetShort", providerSlug: "netshort",
    rating: 4.6, views: 560000, totalEpisodes: 16, freeEpisodes: 3, year: 2025, isVipOnly: true,
    isTrending: false, isNew: false, category: "anime", createdAt: "2025-01-20", updatedAt: "2025-03-15",
  },
  {
    id: "m9", slug: "eternal-vow", title: "Eternal Vow", originalTitle: "永恒誓言",
    synopsis: "A doctor and a soldier find love during wartime. Separated by duty, they make a vow to find each other in every lifetime. A story spanning centuries.",
    coverImage: `${coverBase}/eternalv/300/450`,
    country: "China", status: "Completed", genre: ["Romance", "Drama"], provider: "StardustTV", providerSlug: "stardusttv",
    rating: 4.7, views: 890000, totalEpisodes: 32, freeEpisodes: 5, year: 2025, isVipOnly: false,
    isTrending: true, isNew: false, category: "drama", createdAt: "2025-02-14", updatedAt: "2025-05-01",
  },
  {
    id: "m10", slug: "street-fighter-legacy", title: "Street Fighter Legacy", originalTitle: "街头霸王传承",
    synopsis: "A retired martial arts champion is forced back into the ring when his student is kidnapped by an underground fighting syndicate.",
    coverImage: `${coverBase}/fighter/300/450`,
    country: "China", status: "Completed", genre: ["Action", "Martial Arts"], provider: "BiliTV", providerSlug: "bilitv",
    rating: 4.2, views: 340000, totalEpisodes: 20, freeEpisodes: 4, year: 2024, isVipOnly: false,
    isTrending: false, isNew: false, category: "movie", createdAt: "2024-09-10", updatedAt: "2024-12-20",
  },
  {
    id: "m11", slug: "love-in-paris", title: "Love in Paris", originalTitle: "巴黎之恋",
    synopsis: "A Korean pastry chef moves to Paris and meets a charming French-Korean architect. Together they navigate cultural differences and the pursuit of dreams.",
    coverImage: `${coverBase}/parislove/300/450`,
    country: "Korea", status: "Completed", genre: ["Romance", "Comedy"], provider: "FlexTV", providerSlug: "flextv",
    rating: 4.5, views: 720000, totalEpisodes: 18, freeEpisodes: 5, year: 2025, isVipOnly: false,
    isTrending: false, isNew: true, category: "drama", createdAt: "2025-04-10", updatedAt: "2025-06-01",
  },
  {
    id: "m12", slug: "shadow-assassin", title: "Shadow Assassin", originalTitle: "影杀",
    synopsis: "An elite assassin questions her loyalty when she discovers the truth about her organization. A thrilling tale of betrayal, survival, and redemption.",
    coverImage: `${coverBase}/shadow/300/450`,
    country: "China", status: "Ongoing", genre: ["Action", "Thriller"], provider: "SarosTV", providerSlug: "sarostv",
    rating: 4.8, views: 950000, totalEpisodes: 40, freeEpisodes: 0, year: 2025, isVipOnly: true,
    isTrending: true, isNew: true, category: "drama", createdAt: "2025-05-20", updatedAt: "2025-06-15",
  },
];

// ============== EPISODES ==============
export function generateEpisodes(movieId: string, totalEps: number, freeEps: number): Episode[] {
  return Array.from({ length: totalEps }, (_, i) => ({
    id: `${movieId}-ep${i + 1}`,
    movieId,
    episodeNumber: i + 1,
    title: `Episode ${i + 1}`,
    duration: Math.floor(Math.random() * 10) + 8,
    videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    thumbnailUrl: `${coverBase}/${movieId}-ep${i + 1}/320/180`,
    isFree: i < freeEps,
    isVipOnly: i >= freeEps,
  }));
}

// ============== VIP PLANS ==============
export const vipPlans: VipPlan[] = [
  {
    id: "vip-lite", name: "VIP Lite", price: 30000, currency: "IDR",
    duration: 7, durationUnit: "days", maxDevices: 3, isPopular: false, isPromo: false,
    features: ["Ad-Free Experience", "HD Quality Streaming", "Limited Provider Access", "3 Devices"],
  },
  {
    id: "vip-sultan", name: "VIP Sultan", price: 65000, currency: "IDR",
    duration: 1, durationUnit: "months", maxDevices: 3, isPopular: true, isPromo: false,
    features: ["Ad-Free Experience", "HD Quality Streaming", "Access All Movies", "Limited Provider Access", "3 Devices"],
  },
  {
    id: "vip-master", name: "VIP Master", price: 99000, currency: "IDR",
    duration: 6, durationUnit: "months", maxDevices: 4, isPopular: false, isPromo: false,
    features: ["Ad-Free Experience", "HD Quality Streaming", "Access All Movies", "All Providers", "4 Devices", "Priority Support"],
  },
  {
    id: "vip-lifetime", name: "VIP Lifetime", price: 149999, currency: "IDR",
    duration: 999, durationUnit: "lifetime", maxDevices: 6, isPopular: false, isPromo: true,
    originalPrice: 299999,
    features: ["Ad-Free Experience", "HD & 4K Quality", "Access All Movies", "All Providers", "6 Devices", "Priority Support", "Early Access", "Family Sharing"],
  },
];

// ============== HELPER FUNCTIONS ==============
export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}

export function getMoviesByProvider(providerSlug: string): Movie[] {
  return movies.filter((m) => m.providerSlug === providerSlug);
}

export function getTrendingMovies(): Movie[] {
  return movies.filter((m) => m.isTrending);
}

export function getNewMovies(): Movie[] {
  return movies.filter((m) => m.isNew);
}

export function getMoviesByCategory(category: Movie["category"]): Movie[] {
  return movies.filter((m) => m.category === category);
}

export function searchMovies(query: string): Movie[] {
  const q = query.toLowerCase();
  return movies.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.synopsis.toLowerCase().includes(q) ||
      m.genre.some((g) => g.toLowerCase().includes(q)) ||
      m.provider.toLowerCase().includes(q)
  );
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

export function getRankings(period: "daily" | "weekly" | "monthly" | "yearly"): Movie[] {
  const sorted = [...movies].sort((a, b) => {
    const multiplier = period === "daily" ? 1 : period === "weekly" ? 3 : period === "monthly" ? 7 : 30;
    return (b.views * multiplier * (b.rating / 5)) - (a.views * multiplier * (a.rating / 5));
  });
  return sorted.slice(0, 10);
}
