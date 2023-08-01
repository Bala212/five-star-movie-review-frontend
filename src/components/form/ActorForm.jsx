import React, { useEffect } from "react";
import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing!" };
  if (!about.trim()) return { error: "Actor about is empty!" };
  if (!gender.trim()) return { error: "Actor gender is missing!" };
  //avatar is optional field so use & and, avatar.type is "image/jpeg,png,jpg"&
  //if there is avatar and its type is not image!!
  if (avatar && !avatar.type?.startsWith("image")) {
    return { error: "Invalid image/avatar file!" };
  }
  //if everything is ok!
  return { error: null };
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

export default function ActorForm({
  title,
  initialState,
  buttonTitle,
  busy,
  onSubmit,
}) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  const { updateNotification } = useNotification();

  const updatePosterForUI = (poster) => {
    const url = URL.createObjectURL(poster);
    setSelectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    //files is for poster
    const { value, files, name } = target;

    //handle file separately
    if (name === "avatar") {
      const avatar = files[0];
      //convert into url
      updatePosterForUI(avatar);
      //set the movieInfo and return
      return setActorInfo({ ...actorInfo, avatar: avatar });
    }

    //set name and about!!!
    setActorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //validate actorInfo
    const { error } = validateActor(actorInfo);
    //if there is error then notify !!
    if (error) {
      return updateNotification("error", error);
    }

    //submit form

    //create form data(JSON we can say), and send it to backend
    const formData = new FormData();
    //append each actorInfo
    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]);
    }
    onSubmit(formData);
  };

  //useEffect hook to set initialState of the form when we are editing/updating the actor!!
  // but this initialState is optional, it can be and cannot be, but it will be definitely when we admin is updating the actor
  //whenever initial state changes this function will run
  useEffect(() => {
    // set Actor info to initialState if any
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, initialState);

  const { name, about, gender } = actorInfo;

  return (
    //CONTAINER
    <form
      className="dark:bg-primary bg-white p-3 w-[35rem] rounded"
      onSubmit={handleSubmit}
    >
      {/* TITLE and BUTTON corresponding to that title */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className="h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          type="submit"
        >
          {/* if busy in creating actor, render the spinner otherwise buttonTitle */}
          {busy ? <ImSpinner3 className="animate-spin" /> : buttonTitle}
        </button>
      </div>
      {/* FORM ELEMENTS ( image, name and about) */}
      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36  aspect-square object-cover rounded"
          label="Select avatar"
          name="avatar"
          onChange={handleChange}
          accept="image/jpg, image/jpeg, image/png" // accept only photo
        />
        {/* NAME,GENDER and ABOUT */}
        <div className="flex-grow flex flex-col space-y-2">
          {/* Name*/}
          <input
            placeholder="Enter name"
            type="text"
            className={commonInputClasses + "border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />
          {/* About */}
          <textarea
            name="about"
            value={about}
            onChange={handleChange}
            placeholder="About"
            className={commonInputClasses + "border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>
      {/* GENDER */}
      <div className="mt-3">
        <Selector
          label="Gender"
          options={genderOptions}
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>
    </form>
  );
}
