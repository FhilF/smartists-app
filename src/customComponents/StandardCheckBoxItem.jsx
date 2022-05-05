import React from "react";
import classNames from "classnames";

function StandardCheckBoxItem(props) {
  const { className, label, id, onChange, checked, disabled, style } = props;

  return (
    <label 
      className={
        classNames(`flex space-x-4 items-start justify-start px-6 py-4 bg-white shadow border rounded-lg ${
          checked? "border-red-900" :"border-gray-100"
        }`,
          className
        )
      } 
      style={{width: 391, height: 91, ...style}}
    >
      <div className="flex items-center justify-center w-4 h-1/3 pt-0.5">
        <input 
          type="checkbox" 
          id={id}
          checked={checked} 
          onChange={onChange}
          disabled={disabled}
          value={checked}
          className="form-checkbox text-red-900"
        />
      </div>
      {label}
    </label>
  );
}

export default StandardCheckBoxItem;