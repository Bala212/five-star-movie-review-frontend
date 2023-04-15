import React, { useEffect } from "react";
// import { getMovieForUpdate, getMovies } from "../api/movie";
import { useMovies } from "../hooks";
import MovieListItem from "./MovieListItem";
// import ConfirmModal from "./modals/ConfirmModal";
// import { deleteMovie } from "../api/movie";
// import UpdateMovie from "./modals/UpdateMovie";

// const pageNo = 0;
// const limit = 5;

export default function LatestUploads() {
  // // to select fetched movies
  // const [movies, setMovies] = useState([]);

  // // to show/hide confirm modal
  // const [showConfirmModal, setShowConfirmModal] = useState(false);

  // // to show/hide update modal
  // const [showUpdateModal, setShowUpdateModal] = useState(false);

  // // to render  busy icon
  // const [busy, setBusy] = useState(false);

  // // to select the movie we want to update/delete
  // const [selectedMovie, setSelectedMovie] = useState(null);

  // const { updateNotification } = useNotification();

  const {
    fetchLatestUploads,
    // fetchNextPage,
    // fetchPrevPage,
    latestUploads,
  } = useMovies();

  //    WE HAVE SHIFTED THIS CODE/LOGIC TO THE MOVIE CONTEXT AS WE WERE USING THE FREQUENTLY IN OUR APPLICATION!!
  // const fetchLatestUploads = async () => {
  //   // fetch latest upload from pagination logic setting page no 0 and limit 5
  //   const { error, movies } = await getMovies(pageNo, limit);

  //   // if any error from backend
  //   if (error) return updateNotification("error", error);

  //   // if no any error, set the fetched movies to 'movies'
  //   setMovies([...movies]);
  // };

  // // set 'selectedMovie' to the formatted movie info, by requesting to backend
  // // destructuring id of that movie
  // const handleOnEditClick = async ({ id }) => {
  //   // get the formatted info of movie by sending request to backend!!
  //   const { movie, error } = await getMovieForUpdate(id);

  //   // if any error from backend
  //   if (error) return updateNotification("error", error);

  //   //set the received movie from backend as to set that movie info to movie form and then update it
  //   setSelectedMovie(movie);

  //   //after selecting the movie, open the model(movie form) to update the movie
  //   setShowUpdateModal(true);
  // };

  // const handleOnEditClick = (movie) => {};

  // const handleOnDeleteClick = (movie) => {
  //   // set the movie which have selected to delete in a state of 'selectedMovie' so that
  //   //when user clicks on 'confirm' button, then we have the movie which has to be deleted
  //   // in 'selectedMovie' which can be used by 'handleOnDeleteConfirm' method
  //   setSelectedMovie(movie);
  //   // now show the confirm modal
  //   setShowConfirmModal(true);
  // };

  // const handleOnDeleteConfirm = async () => {
  //   // delete logic

  //   //set busy to true to indicate the user
  //   setBusy(true);
  //   // the which has to be deleted is selected by 'handleOnDeleteClick' method
  //   // fetch that movie id and send delete request to backend with that id!
  //   const { error, message } = await deleteMovie(selectedMovie.id);

  //   //set busy to false once we delete the movie or performed thea action of delete
  //   setBusy(false);

  //   // if any error, zala delete!
  //   if (error) return updateNotification("error", error);

  //   // if no error
  //   updateNotification("success", message);

  //   // hide the confirm modal
  //   hideConfirmModal();

  //   //fetch new movies after updation!!
  //   //fetch the movie again, so that there would be avoidance of empty place in page
  //   fetchLatestUploads();
  // };

  // const handleOnUpdate = (movie) => {
  //   // create new array of movies which contains updated movie!
  //   const updatedMovies = movies.map((m) => {
  //     if (m.id === movie.id) {
  //       return movie;
  //     }
  //     // else return original movie 'm'
  //     return m;
  //   });

  //   // set the updatedMovies, i.e one movie has been updated!
  //   setMovies([...updatedMovies]);
  // };

  // const hideConfirmModal = () => {
  //   setShowConfirmModal(false);
  // };

  // const hideUpdateModal = () => {
  //   setShowUpdateModal(false);
  // };

  // fetch latest upload again after deleting
  const handleUIUpdate = () => {
    // after deleting/updating a movie, fetch the movies again!
    // so that the updated UI will get displayed!!
    fetchLatestUploads();
  };

  // useEffect hook to update the state of movies immediately when we open the page
  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <>
      <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2">
        {/* title of recent uploads */}
        <h1 className="font-semibold text-xl mb-2 text-primary dark:text-white">
          Recent Uploads
        </h1>
        {/* render 'movies' */}
        <div className="space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                movie={movie}
                key={movie.id}
                afterDelete={handleUIUpdate}
                // onDeleteClick={() => handleOnDeleteClick(movie)} // to share the movie where we are clicking!!
                // onEditClick={() => handleOnEditClick(movie)}
              />
            );
          })}
        </div>
      </div>

      {/* Confirm modal to delete the movie */}
      {/* <ConfirmModal
        visible={showConfirmModal}
        title="Are you Sure?"
        subTitle="This action will remove this movie permanently!"
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        busy={busy}
      /> */}
      {/* Modal to edit the movie! */}
      {/* <UpdateMovie
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
      /> */}
    </>
  );
}
