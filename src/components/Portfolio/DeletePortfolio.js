import React, { useState } from "react";

import IconButton from "../../customComponents/IconButton";
import Button from "../../customComponents/Button";
import { ReactComponent as DeleteIcon } from "../../assets/svg-icon/DeleteIcon.svg";
import Dialog from "../../customComponents/Dialog";
import { useAlert } from "react-alert";
import Loader from "react-loader-spinner";

import { deleteMediaFile } from "../../lib/media";

function DeletePortfolio(props) {
  const { portfolio, handlePortfolio } = props;
  const [handleDialog, setHandleDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const alert = useAlert();
  const handleModal = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    setHandleDialog(!handleDialog);
  };

  const handleSubmit = () => {
    setFormLoading(true);
    deleteMediaFile(portfolio.attrs.media.fileName)
      .then(() => {
        return portfolio.destroy();
      })
      .then(() => {
        alert.success("Successfully delete your portfolio");
        setFormLoading(false);
        handleModal();
        handlePortfolio();
      })
      .catch((err) => {
        console.error(err);
        alert.error("There was a problem submitting your request!");
        setFormLoading(false);
        handleModal();
      });
  };

  return (
    <div>
      <IconButton
        size="small"
        color="secondary"
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
      >
        <DeleteIcon className="svg-icon" />
      </IconButton>
      {handleDialog ? (
        <Dialog
          handleClose={handleModal}
          style={{ marginTop: "10vh", marginBottom: "10vw", width: "500px" }}
        >
          <div className="dialog-content">
            <div className="dialog-header">
              <h1 className="component-header">Delete portfolio</h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="dialog-body mt-20">
                <p className="p-paragraph text-gray-600">
                  Are you sure you want to delete this featured portfolio?
                </p>
              </div>
              <div className="dialog-footer mt-20">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleModal();
                  }}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <div style={{ position: "relative" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={formLoading}
                  >
                    {formLoading ? <>Deleting...</> : <>Delete</>}
                  </Button>
                  {formLoading && (
                    <Loader
                      className="btn-loader"
                      type="Oval"
                      color="#00BFFF"
                      height={25}
                      width={25}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default DeletePortfolio;
