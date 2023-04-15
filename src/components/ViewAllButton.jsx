const ViewAllButton = ({ visible, children, onClick }) => {
    if (!visible) return null;
    return (
      <button
        onClick={onClick}
        className="dark:text-white text-primary hover:underline transition"
        type="button"
      >
        {children}
      </button>
    );
  };

  export default ViewAllButton;