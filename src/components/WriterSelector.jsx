import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import LiveSearch from "./LiveSearch";

export default function WriterSelector({ onSelect }) {
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
    //Search Actor is written in api
    handleSearch(searchActor, value, setProfiles);
  };

  const handleOnSelect = (profile) => {
    //we want empty input field after adding a new actor
    setValue("");
    // call selector function!
    onSelect(profile);
    //after updating/setting, reset the profiles (result) tpo empty and resetSearch
    setProfiles([]);
    resetSearch();
  };
  return (
    <LiveSearch
      name="writers"
      placeholder="Search profile"
      results={profiles} //separate array state !!
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
    />
  );
}