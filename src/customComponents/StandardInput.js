import React, { useEffect } from "react";
import classNames from "classnames";

function StandardInput(props) {
  const { className, placeholder, label, id, onChange, value, autoComplete,type, required, disabled } = props;
  return (
    <div
      className={classNames("standard-input-root base-input-root", className)}
    >
      <label className="input-label">{label}{required ? <span className="required">*</span>: null}</label>
      <input
        className="standard-input base-input-text input-secondary mt-5"
        placeholder={placeholder}
        onChange={onChange}
        id={id}
        value={value}
        autoComplete={autoComplete}
        type={type ? type : "text"}
        disabled={disabled}
      />
    </div>
  );
}

export default StandardInput;
