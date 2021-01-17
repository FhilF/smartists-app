import React, { useEffect } from "react";
import classNames from "classnames";

function StandardTextArea(props) {
  const { className, placeholder, label, id, onChange, value, rows, autoComplete, disabled } = props;
  return (
    <div
      className={classNames("standard-text-area-root base-text-area-root", className)}
    >
      <label className="text-area-label input-label">{label}</label>
      <textarea
        className="standard-text-area base-text-area text-area-secondary mt-5"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        id={id}
        value={value}
        rows={rows}
        autoComplete={autoComplete}
        disabled={disabled}
      ></textarea>
    </div>
  );
}

export default StandardTextArea;
