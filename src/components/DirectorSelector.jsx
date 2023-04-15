import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import Label from "./Label";
import LiveSearch from "./LiveSearch";

export default function DirectorSelector({ onSelect }) {
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    //fetch the 'value' corresponding to the target
    const { value } = target;
    //set 'values' state
    setValue(value);
    // handle search, by calling debounce function (hitting to backend!)
    // and set the profile i.e separate results of that field(director!!
    handleSearch(searchActor, value, setProfiles);
  };

  const handleOnSelect = (profile) => {
    // we want to render name in search field after selection of director!!
    setValue(profile.name);
    // call selector function!
    onSelect(profile);
    //after updating/setting, reset the profiles (result) tpo empty and resetSearch
    setProfiles([]);
    resetSearch();
  };

  return (
    <div>
      <Label htmlFor="director">Director</Label>
      <LiveSearch
        name="director"
        //value will be director's name after selection
        value={value}
        placeholder="Search profile"
        results={profiles} //separate array state !! Created in updateProfileChange
        renderItem={renderItem}
        onSelect={handleOnSelect}
        onChange={handleOnChange}
      />
    </div>
  );
}
