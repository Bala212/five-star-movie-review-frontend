import React, { useEffect, useState } from "react";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import { useParams } from "react-router-dom";
import { deleteReview, getReviewByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ConfirmModal from "../modals/ConfirmModal";
import NotFoundText from "../NotFoundText";
import EditRatingModal from "../modals/EditRatingModal";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  // fetch movieId from url!!
  const { movieId } = useParams();

  // to store reviews
  const [reviews, setReviews] = useState([]);

  // title of movie
  const [movieTitle, setMovieTitle] = useState("");

  // to store review of the current/logged in user
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);

  // busy indicator while deleting the review
  const [busy, setBusy] = useState(false);

  // show, hide modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // select review which has to be edit
  const [selectedReview, setSelectedReview] = useState(null);

  const { updateNotification } = useNotification();

  const { authInfo } = useAuth();

  // get profile id of logged in user to fetch reviews of this user, i.e "find my review"
  const profileId = authInfo.profile?.id;

  const fetchReviews = async () => {
    //send request to backend and fetch reviews for this movie with movieId
    const { movie, error } = await getReviewByMovie(movieId);

    // if any error
    if (error) return updateNotification("error", error);

    //if no error, set the reviews we get from backend
    setReviews([...movie.reviews]);

    //set the movie title to display it
    setMovieTitle(movie.title);
  };

  const findProfileOwnersReview = () => {
    // if there is already set this review of the current user, set it to null, i.e when we again click, reset it
    if (profileOwnersReview) return setProfileOwnersReview(null);

    // math the owner id from reviews to profile id
    // to get the review of the user which is logged in logged in
    const matched = reviews.find((review) => review.owner.id === profileId);

    // if there is no match
    if (!matched)
      return updateNotification("error", "You don't have any review!");

    // if we have a match, store it
    setProfileOwnersReview(matched);
  };

  const handleOnEditClick = () => {
    // select the clicked review, to set the form state using initialState to edit the review
    const { id, content, rating } = profileOwnersReview;
    setSelectedReview({
      id,
      content,
      rating,
    });
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    // set the busy indicator
    setBusy(true);

    // id of review which we want to delete is the profileOwnerReview id
    const { error, message } = await deleteReview(profileOwnersReview.id);

    // reset the busy indicator
    setBusy(false);

    // if any error
    if (error) return updateNotification("error", error);

    // if no error
    updateNotification("success", message);

    //update the UI, by excluding the review we deleted from 'reviews' array and render them again
    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );

    // set the updated review!!
    setReviews([...updatedReviews]);

    // reset profileOwnersReview to null, as we deleted it
    setProfileOwnersReview(null);

    // hide the confirm modal
    hideConfirmModal();
  };

  const handleOnReviewUpdate = (review) => {
    // update the existing owner review with updated review
    const updatedReview = {
      ...profileOwnersReview, //spread other info of review!!
      rating: review.rating,
      content: review.content,
    };

    // update the owner review when we just update the review
    setProfileOwnersReview({ ...updatedReview });

    // update the existing review with updated review by iterating over them
    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      else return r;
    });

    // set the updated reviews
    setReviews([...newReviews]);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const hideEditModal = () => {
    setShowEditModal(false);
    // reset the initialStates value, the review which we selected to edit
    setSelectedReview(null);
  };

  //fetch reviews when we enter this page, whenever movie id changes
  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);
  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2 py-8">
        <div className="flex justify-between items-center">
          {/* reviews for and title */}
          <h1 className="text-2xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-medium">
              {" "}
              Reviews for:
            </span>
            {movieTitle}
          </h1>
          {/* render this of user is logged in, i.e is there a profile id?? */}
          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? "View all" : "Find my review"}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>

        {/* if there is no any review */}
        <NotFoundText text="No reviews!" visible={!reviews.length} />

        {/* Actual reviews!! */}
        {/* if there is current user review, render it otherwise render all */}
        {profileOwnersReview ? (
          <div>
            {/* current user review */}
            <ReviewCard review={profileOwnersReview} />
            {/*update and delete button */}
            <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
              <button onClick={displayConfirmModal} type="button">
                <BsTrash />
              </button>
              <button onClick={handleOnEditClick} type="button">
                <BsPencilSquare />
              </button>
            </div>
          </div>
        ) : (
          // All reviews
          <div className="space-y-3 mt-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      {/* confirm the deletion of review */}
      <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteConfirm}
        busy={busy}
        title="Are you sure?"
        subTitle="This action will remove this review permanently."
      />
      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModal}
      />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  // if no review
  if (!review) return null;
  const { owner, content, rating } = review;

  return (
    <div className="flex space-x-3">
      {/* name initial */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>
      <div className="">
        {/* name */}
        <h1 className="dark:text-white text-secondary font-semibold text-lg">
          {owner.name}
        </h1>
        {/* rating */}
        <RatingStar rating={rating} />
        {/* content */}
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
