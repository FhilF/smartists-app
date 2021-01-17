import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Ripple from "./js/Ripple";

function TextNavButton(props) {
  const {
    children,
    className,
    onClick,
    size,
    color,
    label,
    link,
    disabled,
  } = props;
  const history = useHistory();
  return (
    <a
      className={classNames(
        "btn btn-text-standard btn-text-standard-nav btn-ripple",
        className,
        size ? size : "btn-md",
        color ? color : "btn-standard"
      )}
      href={link}
      onClick={(e) => {
        e.preventDefault();
        !disabled && history.push(link);
      }}
      disabled={disabled}
    >
      <div className="">{label ? label : children}</div>
      {!disabled && <Ripple />}
    </a>
  );
}

export default TextNavButton;
