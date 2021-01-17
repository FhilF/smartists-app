import React from "react";
import classNames from "classnames";

function Dialog(props) {
  const { children, handleClose, className, style } = props;
  return (
    <div className="dialog-root">
      <div className="dialog-backdrop"></div>
      <div
        className="dialog-container"
        onClick={(e) => {
          handleClose();
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
