import React from "react";
import classNames from "classnames";

function OutlinedInput(props) {
  const { className, placeholder } = props;
  return (
    <div className={classNames("outline-input-root", className)}>
      <input type="text" placeholder="test"/>
    </div>
  );
}

export default OutlinedInput;
