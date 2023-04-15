import React from "react";

const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

//all the properties are accepted as prop from movieForm
export default function PosterSelector({
  name,
  selectedPoster,
  label,
  onChange,
  className,
  accept,
}) {
  return (
    <div>
      {/* this input field with type as 'file' is helping us in selecting poster from admin */}
      <input
        accept={accept} //accept only photos stuff
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden //to hide the default ui of selecting a file
      />
      <label htmlFor={name}>
        {/* if the poster is selected display it using img tag otherwise render posterUI to select the poster */}
        {selectedPoster ? (
          <img
            className={commonPosterUI + "object-cover " +className}
            src={selectedPoster} //this is a url of a poster generated using 'URL' interface of JS, getting as a prop from 'MovieForm'
            alt=""
          />
        ) : (
          //render this if we have to select a poster
          <PosterUI label = {label} className={className}/>
        )}
      </label>
    </div>
  );
}

// The <span> tag is an inline container used to mark up a part of a text, or a part
// of a document. The <span> tag is easily styled by CSS or manipulated with JavaScript
// using the class or id attribute. The <span> tag is much like the <div> element, but
// <div> is a block-level element and <span> is an inline element.

const PosterUI = ({label, className}) => {
  return (
    <div className={commonPosterUI+ ' ' + className}>
      <span className="dark:text-dark-subtle text-light-subtle">
        {label}
      </span>
    </div>
  );
};
