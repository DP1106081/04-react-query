import SearchBar from "../SearchBar/SearchBar";
import "./App.module.css";
import toast, { Toaster } from "react-hot-toast";

import { fetchMovies } from "../../services/movieService";

import { useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

import Loader from "../Loader/Loader";

import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const handleSearch = async (query: string) => {
    setMovies([]);
    setHasError(false);
    setIsLoading(true);
    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(results);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const [movies, setMovies] = useState<Movie[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {hasError && <ErrorMessage />}
      {!isLoading && !hasError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      {}
    </>
  );
}

export default App;
