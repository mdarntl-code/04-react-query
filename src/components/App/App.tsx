import { useState } from "react";
import { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies({ query: searchQuery, page }),
    enabled: !!searchQuery,
  });

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
        <MovieGrid movies={data?.results || []} onSelect={handleOpenModal} />
      )}
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
