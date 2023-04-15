import React, { useState } from "react";
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs";
import { deleteMovie } from "../api/movie";
import { useNotification } from "../hooks";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";
import { getPoster } from "../utils/helper";

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  // to hide/show confirm delete modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // to render  busy icon
  const [busy, setBusy] = useState(false);

  // to hide/show updateMovie modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // to select the movie id which want to update
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { updateNotification } = useNotification();

  const handleOnDeleteConfirm = async () => {
    // delete logic

    //set busy to true to indicate the user
    setBusy(true);
    // the which has to be deleted is selected by 'handleOnDeleteClick' method
    // fetch that movie id and send delete request to backend with that id!
    const { error, message } = await deleteMovie(movie.id);

    //set busy to false once we delete the movie or performed thea action of delete
    setBusy(false);

    // if any error
    if (error) return updateNotification("error", error);

    // hide the confirm modal
    hideConfirmModal();

    // if no error
    updateNotification("success", message);

    // if we ant to we can use this method, to update the state of page instead it is same like fetching the data!!
    afterDelete(movie);

    //THE BELOW TASK IS DONE BY ABOVE FUNCTION!!
    // fetch the movie again, so that there would be avoidance of empty place in page
    // fetchMovies(currentPageNo);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleOnEditClick = () => {
    setShowUpdateModal(true);
    // set the selected movie id for update to send it to update modal
    setSelectedMovieId(movie.id);
  };

  const handleOnUpdate = (movie) => {
    // it will fetch the movies again, i.e updating the UI
    afterUpdate(movie);

    // hide the update modal on success!
    setShowUpdateModal(false);

    // set selectedMovie id to null, as updation has done!
    setSelectedMovieId(null);
  };

  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
      />
      <div className="p-0">
        {/* CONFIRM MODAL */}
        <ConfirmModal
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          title="Are you sure?"
          subTitle="This action will remove movie permanently!"
          busy={busy}
        />
        {/* Update movie modal */}
        {/* initialState of the movie to be updated ih fetched from backend and set as 'initialState' */}
        <UpdateMovie
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
};

const MovieCard = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
  const { poster, title, responsivePosters, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      {/* table body */}
      <tbody>
        {/* table row */}
        <tr>
          {/* table data */}
          <td>
            {/* poster */}
            <div className="w-24">
              <img
                className="w-full aspect-video "
                src={getPoster(responsivePosters) || poster}
                alt={title}
              />
            </div>
          </td>
          {/* Title and genre */}
          <td className=" w-full pl-5">
            <div>
              {/* title */}
              <h1 className="text-lg font-semibold text-primary dark:text-white">
                {title}
              </h1>
              {/* genre */}
              <div className="space-x-1">
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className="font-serif text-primary dark:text-white text-xs"
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>
          {/* status */}
          <td className="px-5">
            <p className=" text-primary dark:text-white">{status}</p>
          </td>
          {/* buttons */}
          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white">
              <button onClick={onDeleteClick} type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MovieListItem;
