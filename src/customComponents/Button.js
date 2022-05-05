import React from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
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
  } else if (variant === "outlined"){
    x.push("btn-contained");
    if (color === "primary") {
      x.push("btn-outlined-primary");
    } else if (color === "secondary") {
      x.push("btn-outlined-secondary");
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
  } else if (size === "large") {
    x.push("btn-lg");
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
    disabled,
    link,
    style,
  } = props;
  const navigate = useNavigate();

  return (
    <>
      {link ? (
        <a
          className={classNames(
            "btn btn-ripple",
            className,
            ...handleButton(size, color, variant),
            disabled ? "btn-disabled" : null
          )}
          type={type ? type : "button"}
          disabled={disabled}
          href={link}
          style={style}
          onClick={
            disabled
              ? (e) => {
                  e.preventDefault();
                }
              : onClick
              ? onClick
              : (e) => {
                  e.preventDefault();
                  navigate(link);
                }
          }
        >
          {children ? children : label}
          {!disabled && <Ripple color="rgba(0, 0, 0, 0.14)" />}
        </a>
      ) : (
        <button
          className={classNames(
            "btn btn-ripple",
            className,
            ...handleButton(size, color, variant)
          )}
          type={type ? type : "button"}
          onClick={onClick}
          disabled={disabled}
          style={style}
        >
          {children ? children : label}
          {!disabled && <Ripple color="rgba(0, 0, 0, 0.14)" />}
        </button>
      )}
    </>
  );
}

export default TextFunctionButton;
