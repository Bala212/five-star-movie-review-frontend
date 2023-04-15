import React, { useState } from "react";
import { searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import { renderItem } from "../../utils/helper";
import { commonInputClasses } from "../../utils/theme";
import LiveSearch from "../LiveSearch";

//const cast = [{actor:id, roleAs: "", leadActor: true}];

//DEFAULT CAST VALUES
const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};

export default function CastForm({ onSubmit }) {
  //to capture values from form
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  // profiles array to keep track of search results of cast
  const [profiles, setProfiles] = useState([]);

  const { updateNotification } = useNotification();

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;
    if (name === "leadActor")
      return setCastInfo({ ...castInfo, leadActor: checked });
    setCastInfo({ ...castInfo, [name]: value });
  };

  const handleProfileSelect = (profile) => {
    setCastInfo({ ...castInfo, profile });
  };

  const handleSubmit = () => {
    const { profile, roleAs } = castInfo;
    //if name is empty
    if (!profile.name)
      return updateNotification("error", "Cast profile is missing!");
    //if role as is empty
    if (!roleAs.trim())
      return updateNotification("error", "Cast role is missing!");

    //submit the cast info to movieInfo, which will be passed through props
    onSubmit(castInfo);

    //after submitting the cast, set all fields to default to take another cast
    // and set name i.e input field empty to add/search another cast
    setCastInfo({ ...defaultCastInfo, profile: { name: "" } });

    // reset the search and make the profiles array(results of search) empty
    resetSearch();
    setProfiles([]);
  };

  const handleProfileChange = ({ target }) => {
    // destructure value from target
    const { value } = target;
    //destructure profile of cast!
    const { profile } = castInfo;
    //set input field to cast name (name is inside 'value')
    profile.name = value;
    //set cast's info with name
    setCastInfo({ ...castInfo, ...profile });
    // now search that name in backend using debounce function
    // and fetch the result in 'profiles' state
    // value  will be 'name' we entered in input field
    handleSearch(searchActor, value, setProfiles);
  };

  const { leadActor, profile, roleAs } = castInfo;
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="leadActor"
        className="w-4 h-4"
        checked={leadActor} //true or false
        onChange={handleOnChange}
        title="Set as lead actor" //tip on hover!
      />
      <LiveSearch
        value={profile.name} //name of selected profile
        placeholder="Search profile"
        results={profiles}
        onSelect={handleProfileSelect} //update the selected profile as cast
        renderItem={renderItem} //to render the search result
        onChange={handleProfileChange}
      />
      <span className="dark:text-dark-subtle text-light-subtle font-semibold">
        as
      </span>

      {/* take only available space */}
      <div className="flex-grow">
        <input
          type="text"
          className={commonInputClasses + "rounded p-1 text-lg border-2"}
          placeholder="Role as"
          name="roleAs"
          value={roleAs}
          onChange={handleOnChange}
        />
      </div>

      <button
        onClick={handleSubmit}
        type="button"
        className="bg-secondary dark:bg-white dark:text-primary
          text-white px-1 rounded"
      >
        Add
      </button>
    </div>
  );
}
