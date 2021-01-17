import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Ripple from "./js/Ripple";

function handleButton(size, color, variant) {
  let x = [];
  if (variant === "contained") {
    x.push("btn-contained");
    if (color === "primary") {
      x.push("btn-primary");
    } else if (color === "secondary") {
      x.push("btn-secondary");
    } else {
      x.push("btn-standard");
    }
  } else {
    x.push("btn-text");
    if (color === "primary") {
      x.push("btn-text-primary");
    } else if (color === "secondary") {
      x.push("btn-text-secondary");
    } else {
      x.push("btn-text-standard");
    }
  }

  if (size === "small") {
    x.push("btn-sm");
  } else {
    x.push("btn-md");
  }

  return x;
}

function TextFunctionButton(props) {
  const {
    children,
    className,
    onClick,
    size,
    color,
    label,
    type,
    variant,
  } = props;

  return (
    <button
      className={classNames(
        "btn btn-ripple",
        className,
        ...handleButton(size, color, variant)
      )}
      type={type ? type : "button"}
      onClick={onClick}
    >
      {children ? children : label}
      <Ripple color="rgba(0, 0, 0, 0.14)" />
    </button>
  );
}

export default TextFunctionButton;
