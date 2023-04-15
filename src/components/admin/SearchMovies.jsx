import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovieForAdmin } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieListItem from "../MovieListItem";
import NotFoundText from "../NotFoundText";

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
    const { error, results } = await searchMovieForAdmin(val);

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

  const handleAfterDelete = (movie) => {
    //exclude deleted movie from search results by filtering the 'movies' and excluding the 'movie' which is deleted

    // const updatedMovies = movies.filter((m) => {
    //   // exclude the movie with id as deleted movie id
    //   if (m.id !== movie.id) return m;
    // });

    //above function is same!!
    const updatedMovies = movies.filter(
      // exclude the movie with id as deleted movie id
      (m) => m.id !== movie.id
    );

    // set the search result as updated movies
    setMovies([...updatedMovies]);
  };

  const handleAfterUpdate = (movie) => {
    // display the updated movies by mapping through them!

    const updatedMovies = movies.map((m) => {
      // change the old movie info, with updated one!! by iterating through the movies array(search result)
      if (m.id === movie.id) return movie;
      else {
        // if updated movie id is not same as current movie/old id(m) in map, return current movie 'm' as it is
        return m;
      }
    });

    // set the search result as updated movies
    setMovies([...updatedMovies]);
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
    <div className="p-5 space-y-3">
      {/* Not found !! */}
      <NotFoundText text="Record not found!" visible={resultNotFound} />
      {/* if resultNotFound is true then do not render movies  */}
      {!resultNotFound &&
        movies.map((movie) => {
          return (
            <MovieListItem
              movie={movie}
              key={movie.id}
              afterDelete={handleAfterDelete}
              afterUpdate={handleAfterUpdate}
            />
          );
        })}
    </div>
  );
}
