import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import RatingForm from "../form/RatingForm";
import { useParams } from "react-router-dom";
import { useNotification } from "../../hooks";
import { updateReview } from "../../api/review";

export default function EditRatingModal({
  visible,
  onClose,
  initialState,
  onSuccess,
}) {
  const { updateNotification } = useNotification();

  const [busy,setBusy] = useState(false);

  const handleSubmit = async (data) => {

    // set the busy indicator
    setBusy(true);
    // send a patch request to backend for updating the review
    const { error, message } = await updateReview(initialState.id, data);

    // reset the busy indicator
    setBusy(false);

    // if any error
    if (error) return updateNotification("error", error);

    // we want to update  the state of UI immediately
    onSuccess({ ...data });

    // if no error, update the notification
    updateNotification("success", message);

    // close the modal
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm busy={busy} initialState={initialState} onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
