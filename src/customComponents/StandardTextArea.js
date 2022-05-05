import React, { useEffect } from "react";
import classNames from "classnames";

function StandardTextArea(props) {
  const { className, placeholder, label, id, onChange, value, rows, autoComplete, disabled, required } = props;
  return (
    <div
      className={classNames("standard-text-area-root base-text-area-root", className)}
    >
      <label className="text-area-label input-label text-gray-600">{label}{required ? <span className="required">*</span>: null}</label>
      <textarea
        className="standard-text-area base-text-area text-area-secondary mt-1"
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
