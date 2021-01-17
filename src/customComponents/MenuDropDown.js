import React from "react";

function MenuDropDown(props) {
  const { children, handleMenuClose } = props;
  return (
    <div className="root-dropdown">
      <div
        className="dropdown-backdrop"
        onClick={(e) => {
          e.preventDefault();
          handleMenuClose();
        }}
      ></div>
      <div className="dropdown-content">{children}</div>
    </div>
  );
}

export default MenuDropDown;
