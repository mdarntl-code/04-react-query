import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setMovies([]);

      const results = await fetchMovies({ query });
  
      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
  
      setMovies(results);
    } catch {
      setIsError(true);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {isLoading ? (
        <Loader />
      ) : (
        <MovieGrid movies={movies} onSelect={handleOpenModal} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;