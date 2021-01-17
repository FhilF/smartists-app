import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Ripple from "./js/Ripple";

function TextFunctionButton(props) {
  const { children, className, onClick, size, color, label, type } = props;
  const history = useHistory();
  return (
    <button
      className={classNames(
        "btn btn-text-standard btn-ripple",
        className,
        size ? size : "btn-md",
        color ? color : "btn-standard"
      )}
      type={type ? type : "button"}
      onClick={onClick}
    >
      {children ? children : label}
      <Ripple/>
    </button>
  );
}

export default TextFunctionButton;
