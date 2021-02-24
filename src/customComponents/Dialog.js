import React from "react";
import classNames from "classnames";

function Dialog(props) {
  const { children, handleClose, className, style, disabled } = props;
  return (
    <div className="dialog-root">
      <div className="dialog-backdrop"></div>
      <div
        className="dialog-container pl-6 pr-6"
        onClick={(e) => {
          if (typeof disabled === "undefined") {
            handleClose();
          } else {
            if (disabled === false) {
              handleClose();
            }
          }
        }}
      >
        <div
          className={classNames("dialog-paper", className)}
          style={{
            ...style,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
