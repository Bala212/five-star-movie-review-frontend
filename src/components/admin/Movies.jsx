import React, { useEffect } from "react";
// import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import { useMovies } from "../../hooks";
// import UpdateMovie from "../modals/UpdateMovie";
// import ConfirmModal from "../modals/ConfirmModal";
import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";

// const limit = 10;
// let currentPageNo = 0;
export default function Movies() {
  // const { updateNotification } = useNotification();

  // // state to store movies, we will set the movie by requesting to backend
  // const [movies, setMovies] = useState([]);
  // // to know whether our pages of movies end or not!
  // const [reachToEnd, setReachToEnd] = useState(false);

  // // to hide/show updateMovie modal
  // const [showUpdateModal, setShowUpdateModal] = useState(false);

  // // to render  busy icon
  // const [busy, setBusy] = useState(false);
  // // to hide/show confirm delete modal
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // // to set selected movie for update
  // const [selectedMovie, setSelectedMovie] = useState(null);

  const {
    fetchMovies,
    fetchNextPage,
    fetchPrevPage,
    movies: newMovies,
  } = useMovies();

  //    WE HAVE SHIFTED THIS CODE/LOGIC TO THE MOVIE CONTEXT AS WE WERE USING THE FREQUENTLY IN OUR APPLICATION!!
  // // a function to fetch movies for different pages
  // const fetchMovies = async (pageNo) => {
  //   // hit to backend to get the movies according to pageNo and delete, and destructure the response
  //   const { error, movies } = await getMovies(pageNo, limit);

  //   // if any error from backend
  //   if (error) return updateNotification("error", error);

  //   // if there is no data for this page request!!
  //   if (!movies.length) {
  //     // reset te current page no. to last page
  //     currentPageNo = pageNo - 1;
  //     // set reach at end to true
  //     return setReachToEnd(true);
  //   }
  //   // if no error then setMovies array to fetched movies from backend!
  //   setMovies([...movies]);
  // };

  // const handleOnNextClick = () => {
  //   // check if we reach at the end of page?? i.e no more actors to fetch on 'next' click
  //   if (reachToEnd) return updateNotification("warning", "No more Movies!");

  //   // increase the currentPage number by 1 and fetch the record accordingly
  //   currentPageNo += 1;
  //   fetchMovies(currentPageNo);
  // };

  // const handleOnPrevClick = () => {
  //   // check if we are at first page or less than that??
  //   if (currentPageNo <= 0) return;

  //   //if reachToEnd is true, but it has to be false because when user clicks prev button it will
  //   // come to the prev page and we should set reachToEnd as false!!
  //   if (reachToEnd) setReachToEnd(false);

  //   // decrease the currentPage number by 1 and fetch the record accordingly
  //   currentPageNo -= 1;
  //   fetchMovies(currentPageNo);
  // };

  // set 'selectedMovie' to the formatted movie info, by requesting to backend
  // destructuring id of that movie
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

  // const handleOnDeleteClick = async (movie) => {
  //   // set 'selectedMovie' to the movie which we want to delete, by requesting to backend
  //   setSelectedMovie(movie);
  //   // show the confirm modal
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

  //   // if any error
  //   if (error) return updateNotification("error", error);

  //   // if no error
  //   updateNotification("success", message);

  //   // hide the confirm modal
  //   hideConfirmModal();

  //   //fetch the movie again, so that there would be avoidance of empty place in page
  //   fetchMovies(currentPageNo);
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

  // const hideUpdateForm = () => {
  //   setShowUpdateModal(false);
  // };

  // const hideConfirmModal = () => {
  //   setShowConfirmModal(false);
  // };

  const handleUIUpdate = () => {
    // after deleting/updating a movie, fetch the movies again!
    // so that the updated UI will get displayed!!
    fetchMovies();
  };

  // when we are visiting this page for the first time i.e this dom has render, we want to render some movies without any request,
  //for that we are using useEffect hook!!
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      {/* display movies , next and prev button */}
      <div className="space-y-3 p-5">
        {/* display each and every latest movie */}
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate} // update the UI by fetching the movies again
              afterUpdate={handleUIUpdate}
              // onEditClick={() => handleOnEditClick(movie)} // to select the movie which we want to edit
              // onDeleteClick={() => handleOnDeleteClick(movie)} // to select the movie which we want to delete
            />
          );
        })}
        <NextAndPrevButton
          className="mt-5"
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
        />
      </div>
      {/* CONFIRM MODAL */}
      {/* <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure?"
        subTitle="This action will remove movie permanently!"
        busy={busy}
      /> */}
      {/* Update movie modal */}
      {/* initialState of the movie to be updated ih fetched from backend and set as 'initialState' */}
      {/* <UpdateMovie
        visible={showUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
        onClose={hideUpdateForm}
      /> */}
    </>
  );
}
