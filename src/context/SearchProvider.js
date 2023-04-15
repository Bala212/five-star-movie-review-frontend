import React, { createContext, useState } from "react";
import { useNotification } from "../hooks";

export const SearchContext = createContext();

let timeoutId;
const debounce = (func, delay) => {
  //args is the argument we are getting to search, from input field
  // we will return a function over here with return type as void and which will accept argument as 'args'
  return (...args) => {
    //if any previous time interval is going on, clear it
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      //call func after every 500ms
      //apply args to function 'func'
      func.apply(null, args); //call function with arguments as args, and initial 'args' is null
    }, delay);
  };
};

export default function SearchProvider({ children }) {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  // to use this notification context, wrap search provider context inside notification context
  const { updateNotification } = useNotification();

  //updater function is to update the respective results for different roles(director, writer, cast, etc)
  // it is optional!!
  const search = async (method, query, updaterFunction) => {
    //hitting 'method' to backend to get the actor corresponding to query
    const { error, results } = await method(query);

    // if any error from backend regarding result
    if (error) return updateNotification("error", error);

    // if no result not found
    if (!results.length) {
      // set search results to empty array
      setResults([]);
      // also set updaterFunction to empty array
      updaterFunction && updaterFunction([]);
      return setResultNotFound(true);
    }

    //if there is any result, set resultNotFound to false
    setResultNotFound(false);

    // otherwise we got our result and set them
    setResults(results);

    // Update the state inside updaterFunction to respective role
    updaterFunction && updaterFunction([...results]);
  };

  const debounceFunction = debounce(search, 300);

  const handleSearch = (method, query, updaterFunction) => {
    //query is what we want to search
    //set that we are searching
    setSearching(true);
    //if there is no query i.e no value to search from input field
    if (!query.trim()) {
      // set updater function to empty!!
      updaterFunction && updaterFunction([]);
      return resetSearch();
    }
    //if there is query then call debounce function and pass 'method' and 'query'
    // method is function which we are sending to this context, to search actual actor
    debounceFunction(method, query, updaterFunction); //the same thing will be passed to search function() ans as a func in debounce
  };

  const resetSearch = () => {
    setSearching(false);
    setResults([]);
    setResultNotFound(false);
  };

  return (
    <SearchContext.Provider
      //things we are going to export from this context provider/hook
      value={{ handleSearch, resetSearch, searching, resultNotFound, results }}
    >
      {children}
    </SearchContext.Provider>
  );
}