import React from "react";
import classNames from "classnames";
import Ripple from "./js/Ripple";

function ContainedNavButton(props) {
  const { children, className, onClick, size, color, label, type, disabled } = props;
  return (
    <button
      className={classNames(
        "contained-function-button-root btn btn-ripple",
        className,
        size ? size : "btn-md",
        color ? color : "btn-standard"
      )}
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled}
    >
      {children ? children : label}
      {!disabled && <Ripple/>}
    </button>
  );
}

export default ContainedNavButton;
