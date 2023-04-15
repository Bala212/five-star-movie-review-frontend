// this is all about javascript form and event handling, and also last but
// not the least PROPS in react!!!

import React, { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import TagsInput from "../TagsInput";
import Submit from "../form/Submit";
import { useNotification } from "../../hooks";
import WritersModal from "../modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WriterSelector from "../WriterSelector";
import ViewAllButton from "../ViewAllButton";
import LabelWithBadge from "../LableWithBadge";
import { validateMovie } from "../../utils/validator";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releaseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

export default function MovieForm({ onSubmit, buttonTitle, initialState, busy }) {
  //setMovieInfo is a function
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

  const { updateNotification } = useNotification();

  const handleSubmit = (e) => {
    //handle default behavior of form submission on enter key
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    // if any error
    if (error) return updateNotification("error", error);

    //cast, tags, genres, writers needs to be form data
    // i.e convert this to string format (JSON) i.e stringify them before sending to backend!!
    const { tags, genres, cast, director, poster, writers } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);
    //thing will be different for cast and writer
    // each cast ans writer are associated with id!
    const finalCast = cast.map((c) => ({
      // do it according to backend!
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);
    // writer
    // as it is optional so check!!
    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    // director
    // as it is optional so check!! as it is object so check for id
    if (director.id) {
      // no need to stringify director
      finalMovieInfo.director = director.id;
    }

    //poster
    if (poster) finalMovieInfo.poster = poster;

    // now append each property to form data
    for (let key in finalMovieInfo) {
      // 'key' is each property on finalMovieInfo
      formData.append(key, finalMovieInfo[key]);
    }

    // accepting prop from various component where this form is used (movieUpload, updateMovie!
    onSubmit(formData);
  };

  const updatePosterForUI = (poster) => {
    const url = URL.createObjectURL(poster);
    setSelectedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    //destructure value and name, files is an array of files in form
    const { value, name, files } = target;

    //handle poster selection
    if (name === "poster") {
      //the first element from files array will be the poster
      //as there is only one file accepted in the form
      const poster = files[0];
      //create a url corresponding to the poster using JavaScript 'URL' interface
      //and set the value using 'useState' hook
      updatePosterForUI(poster);
      //set received file as a poster!! we are updating state here only so return
      return setMovieInfo({ ...movieInfo, poster });
    }

    // handle writer's name
    // if(name === 'writer') return setWriterName(value);

    //update the movieInfo!!
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    //update the tags
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  const updateCast = (castInfo) => {
    //to spread all of the cast, fetch them from movieInfo
    //and update movieInfo with new castInfo
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const updateWriters = (profile) => {
    //we don't want to select same profile multiple times
    const { writers } = movieInfo;

    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected!"
        );
      }
    }
    //if the writer selected is new one
    //update writer (add in array of writers/profiles )
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const handleWriterRemove = (profileId) => {
    //fetch current writers from movieInfo
    const { writers } = movieInfo;
    //filter get newWriters without writer index 'profileId'
    // i.e exclude writer with id === profileId
    const newWriters = writers.filter(({ id }) => id !== profileId);

    //After removing writers, writers array becomes empty then disable that container
    if (!newWriters.length) hideWritersModal();
    //set movieInfo with new writers
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const handleCastRemove = (profileId) => {
    //fetch current cast from movieInfo
    const { cast } = movieInfo;
    //filter get newCasts without cast index 'profileId'
    // i.e exclude cast with id === profileId
    const newCasts = cast.filter(({ profile }) => profile.id !== profileId);

    //After removing cast, cast array becomes empty then disable that container
    if (!newCasts.length) hideCastModal();
    //set movieInfo with new casts
    setMovieInfo({ ...movieInfo, cast: [...newCasts] });
  };

  // if there is any initialState of the form (it would be at the time of updating movie only)
  // then set the movieInfo as initialState using useEffect hook
  // initialState is the movie info of the movie that has to be updated.
  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        // release date format needs to be yyyy-mm-dd but is by default "yyyy--mm-ddT00:00:00.00z"
        // hence we split it inti 'T' and first element will contain our date
        releaseDate: initialState.releaseDate.split("T")[0],
        // initial state does not contain poster!
        poster: null,
      });

      //set poster separately
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);

  //fetch the current data from movieInfo
  const {
    title,
    cast,
    tags,
    genres,
    storyLine,
    writers,
    type,
    status,
    language,
    releaseDate,
  } = movieInfo;

  return (
    <>
      {/* form is in two parts this was a form tag!!*/}
      <div className="flex space-x-3">
        {/* THIS IS THE LEFT PART OF THE FORM (TITLE AND STUFF) */}
        <div className="w-[70%] space-y-5">
          {/* TITLE */}
          <div>
            <Label htmlFor={"title"}>Title</Label>
            <input
              name="title" //should be same as value
              value={title}
              onChange={handleChange}
              placeholder="Titanic"
              id="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
            />
          </div>
          {/* STORY LINE */}
          <div>
            <Label htmlFor={"storyLine"}>Story line</Label>
            <textarea
              name="storyLine"
              value={storyLine}
              onChange={handleChange}
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24"}
              placeholder="Movie story line..."
            ></textarea>
          </div>
          {/* TAGS */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>
          {/* DIRECTOR */}
          <DirectorSelector onSelect={updateDirector} />
          {/* WRITERS */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllButton
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllButton>
            </div>
            <WriterSelector onSelect={updateWriters} />
            {/* on selecting writer update it in writers array!!  */}
          </div>
          {/* CAST A & CREW */}
          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllButton onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllButton>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>
          {/* DATE */}
          {/* when we select type as date react automatically displays the date form */}
          <input
            type="date"
            className={commonInputClasses + "border-2 rounded p-1 w-auto"}
            onChange={handleChange}
            name="releaseDate"
            value={releaseDate}
          />
          {/* UPLOAD BUTTON */}
          <Submit
            busy={busy}
            value={buttonTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
        {/* THIS IS THE RIGHT PART OF THE FORM (POSTER VALA) */}

        <div className="w-[30%] space-y-5">
          {/* POSTER */}
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpeg, image/png" // accept only photo
            label="Select poster"
          />
          {/* GENRES */}
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />
          {/* TYPE */}
          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            options={typeOptions}
            label="Type"
          />
          {/* LANGUAGE */}
          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            options={languageOptions}
            label="Language"
          />
          {/* STATUS */}
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>
      {/* WRITERS DISPLAY */}
      <WritersModal
        //We are playing with data using PROPS, for example we are sending below data as a prop
        //to the ModalContainer, like we are passing below onClose function to the ModalContainer
        //through WritersModal, and same thing for others too( profiles is used in writers
        //modal and visible is used in ModalContainer ) !! Wowwwww

        //All below properties  are send as a prop
        onClose={hideWritersModal}
        profiles={writers}
        visible={showWritersModal}
        onRemoveClick={handleWriterRemove}
      />
      {/* CAST DISPLAY */}
      <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      />
      {/* GENRES DISPLAY */}
      <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        previousSelection={genres} //stay selected genres over there only
      />
    </>
  );
}
