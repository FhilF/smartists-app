import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Ripple from "./js/Ripple";

function IconButton(props) {
  const { children, className, onClick, size, color, label, type } = props;

  function handleButtonSize(size) {
    if (size === "small") {
      return "btn-sm-svg";
    } else {
      return "btn-md-svg";
    }
  }

  function handleColor(color) {
    if (color === "primary") {
      return {
        btnColor: "btn-icon-primary",
        rippleColor: "rgba(0, 0, 0, 0.14)",
      };
    } else if (color === "secondary") {
        return {
            btnColor: "btn-svg-secondary",
            rippleColor: "rgba(0, 0, 0, 0.14)",
          };
    } else {
      return "btn-icon-standard";
    }
  }
  return (
    <button
      className={classNames(
        "btn btn-icon btn-ripple",
        className,
        handleButtonSize(size),
        handleColor(color).btnColor
      )}
      type={type ? type : "button"}
      onClick={onClick}
    >
      {children ? children : label}
      <Ripple color={handleColor(color).rippleColor} />
    </button>
  );
}

export default IconButton;
