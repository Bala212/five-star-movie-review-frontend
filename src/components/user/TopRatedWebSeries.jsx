import React, { useEffect, useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";

import MovieList from "./MovieList";

export default function TopRatedWebSeries() {
  const updateNotification = useNotification();

  // state to store movies!!
  const [movies, setMovies] = useState([]);

  const fetchMovies = async (signal) => {
    // send a backend request, to get top rated movies!

    // send the type of movies we want to render!! her it is 'web Series'
    const { error, movies } = await getTopRatedMovies("Web Series",signal);

    // if any error
    if (error) return updateNotification("error", error);

    // if no error then setMovies to the top rated movies
    setMovies([...movies]);
  };

  // we have to fetch the top rated movies whenever we visit/render this component!!
  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);
    // while leaving this page abort all the async tasks.
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewers choice (Web Series)" />;
}
