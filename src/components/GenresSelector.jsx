import { ImTree } from "react-icons/im";

//this is which get displayed on movie form
export default function GenresSelector({ onClick, badge }) {
  const renderBadge = () => {
    if (!badge) return null; //if there are 0 selected, don't render it
    return (
      <span
        className="dark:bg-dark-subtle bg-light-subtle text-white absolute top-0 right-0
          w-5 h-5 translate-x-2 -translate-y-1 text-xs rounded-full flex justify-center items-center"
      >
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center space-x-2 py-1 px-3 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary transition dark:text-dark-subtle text-light-subtle hover:text-primary dark:text-white rounded"
    >
      <ImTree />
      <span>Select Genres</span>
      {renderBadge()}  {/* render no. of genres selected  */}
    </button>
  );
}
