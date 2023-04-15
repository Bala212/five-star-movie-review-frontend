import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../../hooks";
import { useNavigate } from "react-router-dom";
import AppSearchForm from "../form/AppSearchForm";

export default function Header({ onAddMovieClick, onAddActorClick }) {
  //hook to know status of the option field i.. add movie and add actor
  const [showOptions, setShowOptions] = useState(false);
  const { toggleTheme } = useTheme();

  const navigate = useNavigate();

  const options = [
    { title: "Add movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];

  const handleSearchSubmit = (query) => {
    // if there is some query(value submitted in input field), then navigate to the '/search' component
    if (!query.trim()) return;

    //else navigate to searchMovie component
    // add query to the url as a title of movie, so that in that component we can search/send 
    // a request to backend to fet the movie with title as 'query'
    navigate("/search?title=" + query);
  };
  return (
    <div className="flex items-center justify-between relative p-5">
      <AppSearchForm
        onSubmit={handleSearchSubmit}
        placeholder="Search Movies..."
      />
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="dark:text-white text-light-subtle"
        >
          <BsFillSunFill size={24} />
        </button>
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle dark:text-dark-subtle text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
        <CreateOptions
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          options={options}
        />
      </div>
    </div>
  );
}

const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef();
  const containerID = "option-container";

  //to handle, close the options when admin clicks anywhere except options
  useEffect(() => {
    const handleClose = (e) => {
      //if options are not displayed yet then what to close? just return
      if (!visible) return;
      //when clicked on add movie or add actor or container containing them, that animation should not go up
      const { parentElement, id } = e.target;
      if (parentElement.id === containerID || id === containerID) return;

      //depending upon the visible status classes would be added to current classList
      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };
    //when clicked anywhere!!
    document.addEventListener("click", handleClose);
    return () => {
      //while returning remove eventListener
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("animate-scale-reverse")) onClose();
    e.target.classList.remove("animate-scale");
  };

  const handleClick = (fn) => {
    //first call onClick and then close it(do not show options)
    fn();
    onClose();
  };

  if (!visible) return null;
  return (
    <div
      id={containerID}
      ref={container}
      className="absolute right-0 top-12 z-50 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      //when animation ends replace the top to bottom animation class
      onAnimationEnd={handleAnimationEnd}
    >
      {options.map(({ title, onClick }) => {
        return (
          <Option key={title} onClick={() => handleClick(onClick)}>
            {title}
          </Option>
        );
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};
