import React, { useState } from "react";
import { updateActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

export default function UpdateActor({
  visible,
  onClose,
  onSuccess,
  initialState,
}) {
  //ignoreContainer is to ignore the default container!
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (data) => {
    //first set busy indicator inside button
    setBusy(true);
    //data of actor is coming from frontend
    //send to the backend API
    const { error, actor } = await updateActor(initialState.id, data);
    //if any error
    if (error) return updateNotification("error", error);
    //remove busy indicator
    setBusy(false);

    // send the updated data to 'Actors' for changing the state on Actors page
    onSuccess(actor);

    //notify actor has been updated and hide modal after actor has updated
    updateNotification("success", "Actor updated Successfully.");
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        //submit when not busy
        onSubmit={!busy ? handleSubmit : null}
        title="Update Actor"
        buttonTitle="Update"
        busy={busy}
        initialState={initialState} // coming from 'Actors' the one which we selected to edit
      />
    </ModalContainer>
  );
}
