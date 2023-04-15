import React, { useState, useEffect } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateActor from "../modals/UpdateActor";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";

let currentPageNo = 0; //it will change
const limit = 20; // it will be fixed/constant

export default function Actors() {
  // to store array of actors coming from backend!
  // this actors array will change according to the page we request
  const [actors, setActors] = useState([]);
  // results on search of actor
  const [results, setResults] = useState([]);

  // to know whether our pages of actors end or not!
  const [reachToEnd, setReachToEnd] = useState(false);

  // busy indicator on deletion of actor
  const [busy, setBusy] = useState(false);
  // to show and hide actor update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // to show and hide confirm delete modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // to keep the track of selected profile for update
  const [selectedProfile, setSelectedProfile] = useState(null);

  const { updateNotification } = useNotification();

  const { handleSearch, resetSearch, resultNotFound } = useSearch();

  const fetchActors = async (pageNo) => {
    //fetch actors from backend depending on 'pageNo' and 'limit'
    const { profiles, error } = await getActors(pageNo, limit);
    // if any error
    if (error) {
      return updateNotification("error", error);
    }
    // if there is no data for this page request!!
    if (!profiles.length) {
      // reset te current page no. to last page
      currentPageNo = pageNo - 1;
      // set reach at end to true
      return setReachToEnd(true);
    }
    //if no error then set actors
    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    // check if we reach at the end of page?? i.e no more actors to fetch on 'next' click
    if (reachToEnd) return updateNotification("warning", "No more Actors!");

    // increase the currentPage number by 1 and fetch the record accordingly
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    // check if we are at first page??
    if (currentPageNo <= 0) return;

    //if reachToEnd is true, but it has to be false because when user clicks prev button it will
    // come to the prev page and we should set reachToEnd as false!!
    if (reachToEnd) setReachToEnd(false);

    // decrease the currentPage number by 1 and fetch the record accordingly
    currentPageNo -= 1;
    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile) => {
    // show the update modal
    setShowUpdateModal(true);
    // we will use the same actor create form to edit the actor
    //for that we need to fill out the form already with the info of that actor, so that admin can edit those details
    setSelectedProfile(profile);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  // value is coming from 'AppSearchForm', it is the input in search form by the user
  const handleOnSearchSubmit = (value) => {
    // handle search is an debounce function
    // which will take parameter as the 1. function which will actually search the actor from backend!
    // 2. the value/query we want to search and 3. the array in which we want to store the results
    handleSearch(searchActor, value, setResults);
  };

  const handleSearchFromReset = () => {
    // this is from useSearch hook
    resetSearch();
    //set search results to empty array
    setResults([]);
  };

  const handleOnActorUpdate = (profile) => {
    //change the actor information, which has the profile as updated info
    const updatedActors = actors.map((actor) => {
      // check which actor to update!
      if (profile.id === actor.id) {
        return profile;
      }
      //else return the same actor, if no any match found
      return actor;
    });

    // set the updatedActors, i.e one actor has been updated!
    setActors([...updatedActors]);
  };

  const handleOnDeleteClick = (actor) => {
    setSelectedProfile(actor);
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleOnDeleteConfirm = async () => {
    // //set busy to true
    // setBusy(true);

    // //use selected profile, selected by 'handleOnDeleteClick'
    // // and send the request to backed API
    // const { error, message } = await deleteActor(selectedProfile.id);

    // //set busy to false
    // setBusy(false);

    // // if any error from backend
    // if (error) return updateNotification("error", error);

    // // if no any error, notify with message
    // updateNotification("success", message);

    // //hide the confirm modal
    // hideConfirmModal();

    // //fetch the actors again, so that there would be avoidance of empty place in page
    // fetchActors(currentPageNo);
  };

  // we are using useEffect hook, as we want to fire fetchActors function on every single page of actors
  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);
  return (
    <>
      {/* Container of actors and button */}
      <div className="p-5">
        {/* Search actor form */}
        <div className="flex justify-end mb-5">
          <AppSearchForm
            onReset={handleSearchFromReset}
            onSubmit={handleOnSearchSubmit}
            placeholder="Search Actors..."
            showResetIcon={results.length || resultNotFound} //show if there are some results(i.e search has taken place) or there are no results i.e page of 'Record Not Found'
          />
        </div>
        {/* on search we don't found any record */}
        <NotFoundText text="Record not found" visible={resultNotFound} />
        {/* // GRID */}
        <div className="grid grid-cols-4 gap-5">
          {/* display each actor from actors array we fetched from backend */}
          {/* if there are some search results then display those otherwise display all actors  */}
          {results.length || resultNotFound //this is the check for search results
            ? results.map((actor) => (
                <ActorProfile
                  profile={actor}
                  key={actor.id}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                />
              )) // this are normal actors
            : actors.map((actor) => (
                <ActorProfile
                  profile={actor}
                  key={actor.id}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                />
              ))}
        </div>
        {/* PREV and NEXT button */}
        {/* render them if the actors are not searched and there some results*/}
        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            className="mt-5"
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
        ) : null}
      </div>

      {/* confirm delete */}
      <ConfirmModal
        title="Are you sure?"
        subTitle="This action will remove this actor permanently!"
        visible={showConfirmModal}
        busy={busy}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />
      {/* to update/edit the actor */}
      <UpdateActor
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnActorUpdate} //change the state of actor immediately when admin updates the actor, and we will fetch the updated actor info from 'UpdateActor' component
      />
    </>
  );
}

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
  //to hide and display the options
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };
  // if there is no profile then return
  if (!profile) return null;

  const getName = (name) => {
    // if name's length is under acceptedNameLength return name as it is
    if (name.length <= acceptedNameLength) {
      return name;
    } else {
      // return substring of length 'acceptedNameLength'
      return name.substring(0, acceptedNameLength) + "..";
    }
  };
  const { name, avatar, about = "" } = profile;
  return (
    /* Each element(card of actor) */
    <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        {/* AVATAR */}
        <img
          src={avatar}
          alt={name}
          className="w-20 aspect-square object-cover"
        />
        {/* NAME and ABOUT */}
        <div className="px-2">
          {/* name */}
          <h1 className="text-l text-primary dark:text-white font-semibold whitespace-nowrap">
            {getName(name)}
          </h1>
          {/* about */}
          <p className="text-primary dark:text-white opacity-60">
            {about.substring(0, 45)} {/* to avoid large about */}
          </p>
        </div>
        {/* hover effect, only when show options is true */}
        <Options
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
          visible={showOptions}
        />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      {/* delete */}
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      {/* edit */}
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
