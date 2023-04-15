import React from "react";

export default function ModalContainer({
  visible,
  ignoreContainer, // to not use the default container i/e to modify the container according to our
  //need ( need is as accepted children)
  children,
  onClose,
}) {
  const handleClick = (e) => {
    //close when a click event is on id containing 'modal-container'
    if (e.target.id === "modal-container") onClose && onClose();
  };

  const renderChildren = () => {
    //to avoid a big container to view writers and return the max-w-[45rem] max-h-[39rem]
    //vala container which will be smaller one
    if (ignoreContainer) return children;

    return (
      //{/* this is a box of uploading trailer */}
      <div
        className="dark:bg-primary  bg-white rounded w-[45rem] h-[39rem]
      overflow-auto p-2 custom-scroll-bar"
      >
        {children}
      </div>
    );
  };
  //if we dom't want to show writers page
  if (!visible) return null;
  return (
    //THE BLURRED PART
    <div
      onClick={handleClick}
      id="modal-container"
      //fixed is used to make all the fields static/not-working mode
      className="fixed inset-0 dark:bg-white bg-primary dark:bg-opacity-50 
        bg-opacity-50 backdrop-blur-sm
        flex items-center justify-center"
    >
      {renderChildren()}
    </div>
  );
}
