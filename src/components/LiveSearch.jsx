import React, { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/theme";

export default function LiveSearch({
  value = "",
  placeholder = "",
  results = [],
  name,
  resultContainerStyle = "", //customize result container style if any!! otherwise defaults are set
  selectedResultStyle = "",
  inputStyle,
  renderItem = null,
  onChange = null,
  onSelect = null,
}) {
  //whether to display result container or not
  const [displaySearch, setDisplaySearch] = useState(false);
  //move up and down on search using by changing focus of the index
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const [defaultValue, setDefaultValue] = useState("");

  const handleOnFocus = () => {
    if (results.length) setDisplaySearch(true);
  };

  const closeSearch = () => {
    //hide the searchResult
    setDisplaySearch(false);
    //reset the focused index to default
    setFocusedIndex(-1);
  };

  const handleOnBlur = () => {
    // setTimeout(() => {
      closeSearch();
    // }, 100);
  };

  const handleSelection = (selectedItem) => {
    if (selectedItem) {
      onSelect(selectedItem);
      //after selecting the item we will close the search field
      closeSearch();
    }
  };

  const handleKeyDown = ({ key }) => {
    //give the index which has to be focused
    let nextCount;
    //arrow keys to move up and down, enter to select and esc to hide result container
    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"];
    if (!keys.includes(key)) return;

    // move selection up and down
    if (key === "ArrowDown") {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }

    //escape will close the search field
    if (key === "Escape") return closeSearch();

    //enter will select that item
    if (key === "Enter") return handleSelection(results[focusedIndex]);

    //we will style that selected index by arrow keys in SearchResult component
    setFocusedIndex(nextCount);
  };


  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : commonInputClasses + "border-2 rounded p-1 text-lg";
  };

  // whenever results length is changing, we also want to display the results
  useEffect(()=>{
      if(results.length) return setDisplaySearch(true)
      setDisplaySearch(false)
  },[results.length])
  const handleChange=(e)=>{
    setDefaultValue(e.target.value);
    //if there is onchange, execute it
    onChange && onChange(e);
  }

  //we can backspace the name inside live search
  useEffect(() => {
    //set default value which is entered on search field
    setDefaultValue(value);
  }, [value]);

  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type="text"
        className={getInputStyle()}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        value={defaultValue}
        onChange={handleChange}
      />
      <SearchResults
        onSelect={handleSelection}
        results={results}
        visible={displaySearch}
        focusedIndex={focusedIndex}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
}

const SearchResults = ({
  visible,
  results = [],
  focusedIndex,
  onSelect,
  renderItem,
  resultContainerStyle,
  selectedResultStyle,
}) => {
  //Now, whenever the focused index changes, we want to fire this method
  // Now, whenever focusedIndex is updated, then this block of code(useEffect) will run and it
  //will try to make everything  in the center inside searchResult, by referring a
  //searchResult field
  const resultContainer = useRef();

  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  //if displaySearch is false it will return null
  if (!visible) return null;

  return (
    /* relative to input field this will render (left, right, top)
      overflow auto will add a scroll bar !!*/
    <div className="absolute z-50 right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar">
      {results.map((result, index) => {
        const getSelectedClass = () => {
          return selectedResultStyle
            ? selectedResultStyle
            : "dark:bg-dark-subtle bg-light-subtle";
        };
        return (
          <ResultCard
            ref={index === focusedIndex ? resultContainer : null}
            //key will be index itself
            key={index.toString()}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={
              index === focusedIndex ? getSelectedClass() : " "
            }
            onMouseDown={() => onSelect(result)}
          />
        );
      })}
    </div>
  );
};

// React forwardRef is a method that allows parent components pass down (i.e., “forward”) refs
// to their children. Using forwardRef in React gives the child component a reference to a DOM
// element created by its parent component. This then allows the child to read and modify that
// element anywhere it is being used.
const ResultCard = forwardRef((props, ref) => {
  const {
    item,
    renderItem,
    resultContainerStyle,
    selectedResultStyle,
    onMouseDown,
  } = props;
  const getClasses = () => {
    //if there is any resultContainer Style, add it or use selectedResult Style and default one
    if (resultContainerStyle)
      return resultContainerStyle + " " + selectedResultStyle;

    return (
      selectedResultStyle +
      " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
    );
  };
  return (
    <div
      //when we click on some actor, send the profile of that actor to 'onSelect' method and onSelect will pass it to handleSelection
      onMouseDown={onMouseDown}
      ref={ref}
      className={getClasses()}
    >
      {renderItem(item)}
    </div>
  );
});
