import React from "react";

export default function NextAndPrevButton({
  className = "",
  onNextClick,
  onPrevClick,
}) {
  const getClasses = () => {
    return "flex justify-end items-center space-x-3 ";
  };
  return (
    <div className={getClasses() + className}>
      {/* prev */}
      <Button onClick={onPrevClick} title="Prev" />
      {/* next */}
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
}

const Button = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className="text-primary dark:text-white hover:underline"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
