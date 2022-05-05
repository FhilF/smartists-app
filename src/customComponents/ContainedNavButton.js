import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

function ContainedNavButton(props) {
  const { children, className, link, disabled } = props;
  const history = useHistory();
  return (
    <a
      className={classNames(
        "contained-nav-button-root btn-circle btn-secondary",
        className
      )}
      href={link}
      onClick={(e) => {
        e.preventDefault();
        history.push(link);
      }}
      disabled={disabled}
    >
      <div className="contained-nav-button">{children}</div>
    </a>
  );
}

export default ContainedNavButton;
