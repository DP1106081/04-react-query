import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { Toaster } from "react-hot-toast";

import { fetchMovies } from "../../services/movieService";

import { useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

import Loader from "../Loader/Loader";

import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { useQuery } from "@tanstack/react-query";
type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;
function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.trim().length > 0,
  });
  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && searchQuery.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
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
