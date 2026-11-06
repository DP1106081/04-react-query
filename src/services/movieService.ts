import axios from "axios";
import type { MovieResponse } from "../types/movie";

export async function fetchMovies(
  query: string,
  page: number,
): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: { query, page },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );

  return response.data;
}
