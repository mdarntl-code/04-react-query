import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}): Promise<Movie[]> => {
  const { data } = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`, {
    params: {
        query,
        page,
        include_adult: false,
        language: "en-US",
    },
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
  });
  return data.results;
};
