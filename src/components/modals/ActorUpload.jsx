import React, { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

export default function ActorUpload({ visible, onClose }) {
  //ignoreContainer is to ignore the default container!
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (data) => {
    //first set busy indicator inside button
    setBusy(true);
    //data of actor is coming from frontend
    //send to the backend API
    const { error, actor } = await createActor(data);
    //if any error
    if (error) return updateNotification("error", error);
    //remove busy indicator
    setBusy(false);
    //notify actor has been created and hide modal after actor has created
    updateNotification("success", "Actor created Successfully.");
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        //submit when not busy
        onSubmit={!busy ? handleSubmit : null}
        title="Create New Actor"
        buttonTitle="Create"
        busy={busy}
      />
    </ModalContainer>
  );
}
