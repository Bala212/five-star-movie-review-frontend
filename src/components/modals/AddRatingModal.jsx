import React from "react";
import ModalContainer from "./ModalContainer";
import RatingForm from "../form/RatingForm";
import { addReview } from "../../api/review";
import { useParams } from "react-router-dom";
import { useNotification } from "../../hooks";

export default function AddRatingModal({ visible, onClose, onSuccess }) {
  // get/fetch movieId from url as a parameter
  const { movieId } = useParams();

  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    // console.log(data);
    const { error, message, reviews } = await addReview(movieId, data);

    // if error
    if (error) return updateNotification("error", error);

    // if no error
    updateNotification("success", message);

    //update the UI
    onSuccess(reviews);

    // close the modal
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
