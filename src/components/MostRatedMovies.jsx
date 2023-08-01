import React, { useEffect, useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import { useNotification } from "../hooks";
import RatingStar from "./RatingStar";
import { convertReviewCount } from "../utils/helper";

export default function MostRatedMovies() {
  //store most rated movies
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();

  const fetchMostRatedMovies = async () => {
    // send a backend request to fetch most rated movies
    const { error, movies } = await getMostRatedMovies();

    console.log(movies);

    // if any error
    if (error) return updateNotification("error", error);

    // if no error store the movies
    setMovies([...movies]);
  };

  // fetch most rated movies when we render this component
  useEffect(() => {
    fetchMostRatedMovies();
  }, []);

  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
      {/* display the movies by iterating them */}
      <h1 className="font-semibold text-xl mb-2 text-primary dark:text-white">
        Most Rated Movies
      </h1>
      <ul className="space-y-3">
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h1 className="text-secondary dark:text-white font-semibold">
                {movie?.title}
              </h1>
              <div className="flex space-x-2">
                <RatingStar rating={movie.reviews?.ratingAvg} />
                <p className="text-light-subtle dark:text-dark-subtle">
                  {convertReviewCount(movie.reviews?.reviewCount)} Reviews
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
