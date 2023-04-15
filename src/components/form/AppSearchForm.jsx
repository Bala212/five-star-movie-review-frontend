import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const defaultInputStyle =
  " dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-white text-lg ";

export default function AppSearchForm({
  showResetIcon,
  placeholder,
  inputClassName = defaultInputStyle,
  onSubmit,
  onReset,
}) {
  // to capture the input entered by the user
  const [value, setValue] = useState("");

  const handleOnsubmit = (e) => {
    e.preventDefault();
    // send this value to onSubmit the input given by user to search!
    onSubmit(value);
  };

  const handleReset = () => {
    //set the input field to empty
    setValue("");
    onReset();
  };

  return (
    <form className="relative" onSubmit={handleOnsubmit}>
      <input
        type="text"
        className={
          "border-2 transition bg-transparent rounded p-1 outline-none " +
          inputClassName
        }
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {/* reset button, render it if and only if there are search results */}
      {showResetIcon ? (
        <button
          onClick={handleReset} //reset the page to all actors
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 text-secondary dark:text-white"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
}
