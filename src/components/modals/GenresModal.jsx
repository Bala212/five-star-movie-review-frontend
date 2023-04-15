import React, { useEffect, useState } from "react";
import genres from "../../utils/genres";
import Submit from "../form/Submit";
import ModalContainer from "./ModalContainer";

export default function GenresModal({ visible, onClose, onSubmit, previousSelection }) {
  //state of array to know selected genres!!
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenresSelector = (gen) => {
    //create a new genre array depending on selected or unselected state of clicked genre
    let newGenres = [];

    //if clicked genre was selected previously, remove it by filtering the old genre array
    if (selectedGenres.includes(gen)) {
      newGenres = selectedGenres.filter((genre) => genre !== gen);
    } else {
      //if clicked genre was not selected previously, add that genre to selected array of genre
      // i.e this is a fresh genre
      newGenres = [...selectedGenres, gen];
    }

    // set/update the newGenre list!!!
    setSelectedGenres([...newGenres]);
  };

  const handleSubmit = () => {
    //submit the selected genres!! (this method will be accepted as a prop)
    onSubmit(selectedGenres);
    // after submitting the genres close the  page
    onClose();
  };

  //when we close genres page, all selected genres will gone!!
  const handleClose = () => {
    //set selectedGenre array to empty
    setSelectedGenres(previousSelection);
    //close the page
    onClose();
  };

  useEffect(() => {
    setSelectedGenres(previousSelection);
  },[])

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* THIS IS LIST OF GENRES!! */}
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>
          <div className="space-y-3">
            {/* display all genres by mapping them 
      and each genre will displayed as a button*/}
            {genres.map((gen) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(gen)}
                  selected={selectedGenres.includes(gen)} // This is to select styling of genre if the genre is
                  key={gen} //selected, i.e it is in selectedGenre array
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <div className="w-56 self-end">
          <Submit value="Select" type="button" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
}

//handle a single genre!!!
const Genre = ({ children, selected, onClick }) => {
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "text-primary dark:text-white ";
  };
  return (
    <button
      onClick={onClick}
      className={
        getSelectedStyle() +
        " border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3 "
      }
    >
      {children}
    </button>
  );
};
