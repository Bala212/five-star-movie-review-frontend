import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";
import Container from "../Container";

export default function SearchMovies() {
  const { updateNotification } = useNotification();

  // a state to store the searched movies
  const [movies, setMovies] = useState([]);

  // state for result not found!
  const [resultNotFound, setResultNotFound] = useState(false);

  // fetch the parameters(title) from url, send by the 'header' to search the movie with title as 'query'
  // for getting the params from url use the hook named 'useSearchParams'
  const [searchParams] = useSearchParams();

  // searchParams contain a 'get' method which takes parameter as a property which we want to fetch
  const query = searchParams.get("title");

  // a method to call backend API to search the movie
  const searchMovies = async (val) => {
    // call the backend api to search the movie with title 'value'
    // we will get the error or 'results' which will contain the movies with title as 'val'
    const { error, results } = await searchPublicMovies(val);

    //if any error from backend
    if (error) return updateNotification("error", error);

    //if there are no results, i.e resultNotFound will be true
    if (!results.length) {
      setResultNotFound(true);
      //set movies to empty array!! and return
      return setMovies([]);
    }

    // if there are results, set resultNotFound to false
    setResultNotFound(false);

    // set the state of movies with results we get from backend
    setMovies([...results]);
  };

  // whenever we come to this page of search we want to fetch the movies with title 'query' for that we are using useEffect hook
  // search a movie with title 'query', using useEffect hook so that whenever query(value in input field) changes
  // we want to search the movie, so call the method which will search the movie
  useEffect(() => {
    // if there is some query!1
    if (query.trim()) {
      searchMovies(query);
    }
  }, [query]);

  return (
    // display the movies, bu iterating over 'movies' which contains the search results
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container className="px-2 xl:p-0">
        {/* Not found !! */}
        <NotFoundText text="Record not found!" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}
