import React from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import Ripple from "./js/Ripple";

function IconButton(props) {
  const {
    children,
    className,
    onClick,
    size,
    color,
    label,
    type,
    disabled,
    full,
    link,
  } = props;

  const navigate = useNavigate();

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
    <>
      {link ? (
        <a
          href={link}
          className={classNames(
            "btn btn-icon btn-ripple",
            className,
            handleButtonSize(size),
            full && "btn-full",
            handleColor(color).btnColor,
            disabled ? "btn-disabled-svg" : null
          )}
          type={type ? type : "button"}
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
          disabled={disabled}
        >
          {children ? children : label}
          {!disabled && <Ripple color={handleColor(color).rippleColor} />}
        </a>
      ) : (
        <button
          className={classNames(
            "btn btn-icon btn-ripple",
            className,
            handleButtonSize(size),
            full && "btn-full",
            handleColor(color).btnColor,
            disabled ? "btn-disabled-svg" : null
          )}
          type={type ? type : "button"}
          onClick={onClick}
          disabled={disabled}
        >
          {children ? children : label}
          {!disabled && <Ripple color={handleColor(color).rippleColor} />}
        </button>
      )}
    </>

    // <button
    //   className={classNames(
    //     "btn btn-icon btn-ripple",
    //     className,
    //     handleButtonSize(size),
    //     full && "btn-full",
    //     handleColor(color).btnColor,
    //     disabled ? "btn-disabled-svg" : null
    //   )}
    //   type={type ? type : "button"}
    //   onClick={onClick}
    //   disabled={disabled}
    // >
    //   {children ? children : label}
    //   {!disabled && <Ripple color={handleColor(color).rippleColor} />}
    // </button>
  );
}

export default IconButton;
