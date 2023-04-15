import React, { useEffect, useState } from "react";
import { getMovieForUpdate, updateMovie } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieForm from "../admin/MovieForm";
import ModalContainer from "./ModalContainer";

export default function UpdateMovie({ visible, movieId, onSuccess }) {
  const [busy, setBusy] = useState(false);

  // ready to show previous data of movie to be updated on movie form??
  const [ready, setReady] = useState(false);
  const { updateNotification } = useNotification();

  // to set selected movie for update
  const [selectedMovie, setSelectedMovie] = useState(null);

  //here we are getting form filled by the user and instead of sending request to creating a movie
  // we are sending request to update the movie! that's it!!!
  // this 'data' is coming from 'MovieForm'
  const handleSubmit = async (data) => {
    // set the busy
    setBusy(true);
    //update the movie in database by sending id and data of the movie
    const { error, movie, message } = await updateMovie(movieId, data);
    //set busy to false
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    // for changing the state of the page immediately
    onSuccess(movie);
  };

  // set 'selectedMovie' to the formatted movie info, by requesting to backend
  // fetch formatted movie from backend API, using movieId getting as a prop!!
  const fetchMovieToUpdate = async () => {
    // get the formatted info of movie by sending request to backend!!
    // movieId we will be getting from the 'updateMovie as a prop
    const { movie, error } = await getMovieForUpdate(movieId);

    // if any error from backend
    if (error) return updateNotification("error", error);

    //set the received movie from backend as to set that movie info to movie form and then update it
    setSelectedMovie(movie);

    // we are ready to update the movie now!
    setReady(true);

    //after selecting the movie, open the model(movie form) to update the movie
    // setShowUpdateModal(true);
  };

  // whenever movieId is changing, we want to fetch the movies
  // i.e whenever we open this update modal
  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  return (
    <ModalContainer visible={visible}>
      {/* whenever the data fetched from backend is ready to show on movie form then only show the movie form!
      or render the div showing Please wait */}
      {ready ? (
        <MovieForm
          initialState={selectedMovie}
          buttonTitle="Update"
          onSubmit={!busy ? handleSubmit : null}
          busy={busy}
        />
      ) : (
        // if not ready!
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-light-subtle dark:text-dark-subtle animate-pulse text-xl">
            Please wait...
          </p>
        </div>
      )}
    </ModalContainer>
  );
}
