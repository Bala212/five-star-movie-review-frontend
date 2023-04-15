import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import { getActorProfile } from "../../api/actor";
import { useNotification } from "../../hooks";

export default function ProfileModal({ visible, profileId, onClose }) {
  // store all the info about actor
  const [profile, setProfile] = useState({});

  const { updateNotification } = useNotification();

  const fetchActorProfile = async () => {
    //  fetch single actor details from backend
    const { error, actor } = await getActorProfile(profileId);

    // if any error
    if (error) return updateNotification("error", error);

    // if no error, set the profile!
    setProfile(actor);
  };

  // profile id is changing then dhow then update the profile modal
  useEffect(() => {
    if (profileId) fetchActorProfile();
  }, [profileId]);

  const { avatar, name, about } = profile;

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className=" w-72 p-5 rounded flex flex-col items-center bg-white dark:bg-primary space-y-3">
        <img className="w-28 h-28 rounded-full" src={avatar} alt={name} />
        <h1 className="dark:text-white text-primary font-semibold">{name}</h1>
        <p className="dark:text-dark-subtle text-light-subtle">{about}</p>
      </div>
    </ModalContainer>
  );
}
