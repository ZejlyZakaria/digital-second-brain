// lib/tmdb-utils.ts

export const genreIdToName: Record<number, string> = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Sci-Fi',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10759: 'Action & Adventure',  // pour séries
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',  // pour animes/séries
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  10770: 'TV Movie',
  // Ajoute si besoin (ex. : Mecha n'est pas standard, mappe à Sci-Fi ou custom)
};

export function mapTmdbGenres(genreIds: number[]): string[] {
  return genreIds.map(id => genreIdToName[id] || 'Unknown').filter(g => g !== 'Unknown');
}