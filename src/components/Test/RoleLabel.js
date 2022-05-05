import React, { useState } from "react";
import { ReactComponent as HelpOutlineOutlinedIcon } from "../assets/svg-icon/HelpOutlineOutlinedIcon.svg";
import Dialog from "../customComponents/Dialog";
import ContainedFunctionButton from "../customComponents/ContainedFunctionButton";

function RoleLabel() {
  const [showHelper, setShowHelper] = useState(false);
  const handleDialog = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible" || window.getComputedStyle(x).overflow === "auto") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    setShowHelper(!showHelper);
  };
  return (
    <div
      style={{
        display: "inline-flex",
      }}
    >
      <div
        className="btn"
        style={{
          fontSize: "inherit",
          alignItems: "center",
          display: "inline-flex",
        }}
        onClick={(e) => {
          e.preventDefault();
          handleDialog();
        }}
      >
        <span className="input-label text-gray-600">Role</span>
        <HelpOutlineOutlinedIcon className="svg-icon svg-secondary" />

        <span className="required">*</span>
      </div>

      {showHelper ? (
        <Dialog
          handleClose={handleDialog}
          style={{ marginTop: "10vh", marginBottom: "10vw", width: "600px" }}
        >
          <div className="pl-40 pr-40 pt-20 pb-20">
            <div className="mt-20">
              <p className="paragraph-header">What is this for?</p>
              <p className="paragraph mt-10">
                If you are a creator and you manage your art activities and your
                digital files, introduce yourself here as an "Author or Artist".
                If you deal with art and artists' services, professionally or
                for private use, you are welcome to introduce yourself as an
                "Art-user". This information is what you share in Smartists and
                it is required to all members for a better service and
                meaningful connections.
              </p>
            </div>
            <div className="dialog-action mt-30">
              <ContainedFunctionButton
                onClick={(e) => {
                  e.preventDefault();
                  handleDialog();
                }}
                color="btn-secondary"
              >
                Got it
              </ContainedFunctionButton>
            </div>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default RoleLabel;
