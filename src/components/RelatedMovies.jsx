import React, { useEffect, useState } from "react";
import { getRelatedMovies } from "../api/movie";
import { useNotification } from "../hooks";
import MovieList from "./user/MovieList";

export default function RelatedMovies({movieId}) {

   // to store related movies 
    const [movies, setMovies] = useState([]);
     
    const {updateNotification} = useNotification();

  const fetchRelatedMovies = async () => {
    // fetch related movies from backend
    const { error, movies } = await getRelatedMovies(movieId);

    //if any error
    if(error) return updateNotification('error',error)

    //set the movie
    setMovies([...movies])
  };

  useEffect(() => {
    if (movieId) fetchRelatedMovies();
  }, [movieId]);


  return <MovieList title='Related Movies' movies={movies}/>
}
