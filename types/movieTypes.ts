// src/types/eventTypes.ts (o cualquier ruta que prefieras)
export interface MovieData {
  id: number;
  title: string;
  year: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  language: string | null;
  country: string | null;
  posterUrl: string;
  imdbRating: string;
  imdbID: string;
}
  