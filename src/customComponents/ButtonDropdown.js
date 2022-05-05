import React from "react";
import classNames from "classnames";

function ButtonDropdown(props) {
  const {
    children,
    label,
    id,
    value,
    onChange,
    name,
    required,
    className,
    disabled,
    defaultValue
  } = props;
  return (
    <div
      className={classNames("standard-select-root base-select-root", className)}
    >
      <label className="select-label input-label text-gray-600">
        {label ? (
          <>
            {label}
            {required ? <span className="required">*</span> : null}
          </>
        ) : null}
      </label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="input-select mt-1"
        disabled={disabled}
        defaultValue={defaultValue}
      >
        {children}
      </select>
    </div>
  );
}

export default ButtonDropdown;
