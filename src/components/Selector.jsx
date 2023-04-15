import React from "react";

export default function Selector({ name, options, value, label, onChange }) {
  return (
    <select
      className="border-2 bg-white dark:bg-primary dark:border-dark-subtle border-light-subtle
       dark:focus:border-white focus:border-primary p-1 pr-10 outline-none transition rounded 
       bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary"
      value={value}
      name={name}
      id={name}
      onChange={onChange}
    >
      {/* label */}
      <option>{label}</option>
      {/* options on click */}
      {options.map(({ title, value }) => {
        return (
          // display each option
          <option key={title} value={value}>
            {title}
          </option>
        );
      })}
    </select>
  );
}
