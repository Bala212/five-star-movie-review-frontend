import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function TagsInput({ name, value, onChange }) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  //to stay with the further input field
  const input = useRef();
  const tagsInput = useRef();

  //accept a single tag
  const handleOnChange = ({ target }) => {
    const { value } = target; //e.target.value
    if (value !== ",") setTag(value);

    //update the tags in array
    onChange(tags);
  };

  // on comma or enter pressed, put that tag in array of tags
  const handleKeyDown = ({ key }) => {
    // console.log(key);

    //key is the name of pressed key
    if (key === "," || key === "Enter") {
      //if there is no any tag
      if (!tag) return;

      //if tag is already present
      if (tags.includes(tag)) return setTag("");

      //is there is some tag and not included before then include it in array of tags
      setTags([...tags, tag]);

      //reset the tag to empty for better UI experience
      setTag("");
    }

    // (!tag) is written because, we don't want ro remove the last entered tag while
    //erasing the text to add new tag
    if (key === "Backspace" && !tag && tags.length) {
      //remove last element from tags array, filter it not taking last element of tags array
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };

  //change the tags array as the user enters them
  useEffect(() => {
    onChange(tags);
  }, [tags]);

  const removeTag = (tagToRemove) => {
    //remove 'tagToRemove' tag  from tags array, filter it not taking tagToRemove wala
    //tag in newTags array
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  const handleOnFocus = () => {
    //remove and add classes to change the color

    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  };

  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  };

  //set input field of tag when we try to submit the form i.e whenever value of tags changes
  useEffect(()=>{
    if(value.length) setTags(value)
  },[value]);

  //whenever tag is changing, scroll input field to the View i.r don't let move the input
  //field further input field is refer by the 'useRef' hook
  useEffect(() => {
    input.current?.scrollIntoView(false); //false is to set 'align to top' false!!
  }, [tag]);

  return (
    <div>
      <div
        //referencing to add the hover, focus kind of stuff on field
        ref={tagsInput}
        //this property is used to perform some action on key press
        onKeyDown={handleKeyDown}
        className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle
          px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto 
          custom-scroll-bar transition"
      >
        {tags.map((t) => (
          //on click, remove the clicked tag
          <Tag onClick={() => removeTag(t)} key={t}>
            {t}
          </Tag>
        ))}
        <input
          ref={input}
          type="text"
          id={name}
          className="h-full flex-grow bg-transparent outline-none dark:text-white text-black"
          placeholder="Tag one, Tag two"
          value={tag}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
}

const Tag = ({ children, onClick }) => {
  return (
    <span
      className="dark:bg-white bg-primary dark:text-primary text-white flex 
    items-center text-sm px-1 whitespace-nowrap"
    >
      {children}
      {/* x button */}
      {/* type is given because we have to avoid submitting/onClick event after pressing
      enter key, otherwise it will delete the tag from our form */}
      <button type="button" onMouseDown={onClick}>
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
