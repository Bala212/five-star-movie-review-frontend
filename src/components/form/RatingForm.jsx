import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Submit from "./Submit";

const createArray = (count) => {
  return new Array(count).fill("");
};

const ratings = createArray(10);

export default function RatingForm({ onSubmit, initialState, busy }) {
  // to keep track of selected stars
  const [selectedRatings, setSelectedRatings] = useState([]);

  //store content
  const [content, setContent] = useState("");

  const handleMouseEnter = (index) => {
    const ratings = createArray(index + 1);
    setSelectedRatings([...ratings]);
  };

  const handleOnChange = ({ target }) => {
    setContent(target.value);
  };

  const handleSubmit = () => {
    //if there is no rating
    if (!selectedRatings.length) return;
    const data = {
      rating: selectedRatings.length, // no. of stars!!
      content: content,
    };
    onSubmit(data);
  };

  // update the form values whenever there is some initialState, when  user request to edit the review!!
  useEffect(() => {
    if (initialState) {
      // set the content which will get displayed on review form
      setContent(initialState.content);
      setSelectedRatings(createArray(initialState.rating));
    }
  }, [initialState]);
  return (
    <div visible ignoreContainer>
      <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
        <div className="text-highlight dark:text-highlight-dark flex items-center relative">
          {/* empty stars*/}
          <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />
          {/* overlapping filled stars */}
          <div className="flex items-center absolute top-1/2 -translate-y-1/2">
            <StarsFilled
              selectedRatings={selectedRatings}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </div>
        {/* text area for content */}
        <textarea
          value={content}
          onChange={handleOnChange}
          className="h-24 w-full border-2 p-2 dark:text-white text-primary rounded bg-transparent outline-none resize-none"
        ></textarea>
        <Submit busy={busy} onClick={handleSubmit} value="Rate this movie" />
      </div>
    </div>
  );
}

const StarsOutlined = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <AiOutlineStar
        onMouseEnter={() => onMouseEnter(index)}
        className="cursor-pointer"
        key={index}
        size={24}
      />
    );
  });
};

const StarsFilled = ({ selectedRatings, onMouseEnter }) => {
  return selectedRatings.map((_, index) => {
    return (
      <AiFillStar
        onMouseEnter={() => onMouseEnter(index)}
        className="cursor-pointer"
        key={index}
        size={24}
      />
    );
  });
};
