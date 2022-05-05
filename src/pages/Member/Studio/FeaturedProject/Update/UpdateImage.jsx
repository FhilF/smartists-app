import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import Ripple from "customComponents/js/Ripple";
import { MdEdit, MdDelete } from "react-icons/md";

function UpdateImage(props) {
  const {
    setIsCompressing,
    handleMediaInputChange,
    tempMediaUrls,
    formLoading,
  } = props;
  return (
    <>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        value={tempMediaUrls ? tempMediaUrls : ""}
        type="file"
        onChange={async (e) => {
          setIsCompressing(true);
          handleMediaInputChange(e);
        }}
        disabled={formLoading}
      />

      <label
        htmlFor="raised-button-file"
        className="btn btn-icon btn-ripple btn-md-svg btn-svg-secondary"
      >
        <MdEdit className="svg-icon" />
        <Ripple color="rgba(0, 0, 0, 0.14)" />
      </label>
    </>
  );
}

export default UpdateImage;
