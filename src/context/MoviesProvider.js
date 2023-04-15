// as we are using edit,delete option while rendering/displaying movies on multiple places like
//  home, movies and also when we search the movie so we cannot code those edit and delete logic
//  for every list/page we are displaying, so for that we will be creating this context of movie from
//   where we can use this edit and delete logics easily, it is same like theme and notification provider!!

import React, { createContext, useState } from "react";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";

// create a context!!
export const MovieContext = createContext();

const limit = 10;
let currentPageNo = 0;

const MoviesProvider = ({ children }) => {
  const { updateNotification } = useNotification();

  // state to store movies, we will set the movie by requesting to backend
  const [movies, setMovies] = useState([]);

  // a separate state to store latest uploads movies
  const [latestUploads, setLatestUploads] = useState([]);

  // to know whether our pages of movies end or not!
  const [reachToEnd, setReachToEnd] = useState(false);

  //FETCH LATEST UPLOADS!!
  const fetchLatestUploads = async (qty = 5) => {
    // fetch latest upload from pagination logic setting page no 0 and limit 5
    const { error, movies } = await getMovies(0, qty);

    // if any error from backend
    if (error) return updateNotification("error", error);

    // if no any error, set the fetched movies to 'movies'
    setLatestUploads([...movies]);
  };

  // a function to fetch movies for different pages
  const fetchMovies = async (pageNo=currentPageNo) => {
    // hit to backend to get the movies according to pageNo and delete, and destructure the response
    const { error, movies } = await getMovies(pageNo, limit);

    // if any error from backend
    if (error) return updateNotification("error", error);

    // if there is no data for this page request!!
    if (!movies.length) {
      // reset te current page no. to last page
      currentPageNo = pageNo - 1;
      // set reach at end to true
      return setReachToEnd(true);
    }
    // if no error then setMovies array to fetched movies from backend!
    setMovies([...movies]);
  };

  const fetchNextPage = () => {
    // check if we reach at the end of page?? i.e no more actors to fetch on 'next' click
    if (reachToEnd) return updateNotification("warning", "No more Movies!");

    // increase the currentPage number by 1 and fetch the record accordingly
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const fetchPrevPage = () => {
    // check if we are at first page or less than that??
    if (currentPageNo <= 0) return;

    //if reachToEnd is true, but it has to be false because when user clicks prev button it will
    // come to the prev page and we should set reachToEnd as false!!
    if (reachToEnd) setReachToEnd(false);

    // decrease the currentPage number by 1 and fetch the record accordingly
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        latestUploads,
        fetchLatestUploads,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MoviesProvider;
