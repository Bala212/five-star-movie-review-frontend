import Label from "./Label";

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
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
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {/* no of selected items */}
      {renderBadge()}
    </div>
  );
};

export default LabelWithBadge;
