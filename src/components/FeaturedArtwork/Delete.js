import React, { useState } from "react";

import Button from "../../customComponents/Button";
import { ReactComponent as DeleteIcon } from "../../assets/svg-icon/DeleteIcon.svg";
import Dialog from "../../customComponents/Dialog";
import { useAlert } from "react-alert";
import Loader from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import IconButton from "../../customComponents/IconButton";

import { deleteMediaFile } from "../../lib/media";

function DeleteFeaturedArtwork(props) {
  const {
    featuredArtwork,
    handleFeaturedArtwork,
    userSession,
    handleDeleteUpdateList,
    isModifyingFeaturedArtwork,
    index,
  } = props;
  const [handleDialog, setHandleDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const alert = useAlert();
  const handleModal = () => {
    console.log(featuredArtwork);
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
    if (!userSession.isUserSignedIn) {
      alert.error("Please sign in to continue");
      userSession.signUserOut(window.location.origin);
      setFormLoading(false);
      return true;
    }

    deleteMediaFile(featuredArtwork.attrs.media.fileName)
      .then(() => {
        return featuredArtwork.destroy();
      })
      .then(() => {
        alert.success("Successfully delete your featuredArtwork");
        setFormLoading(false);
        handleModal();
        handleDeleteUpdateList(index);
        // handleFeaturedArtwork();
      })
      .catch((err) => {
        console.error(err);
        alert.error("There was a problem submitting your request!");
        setFormLoading(false);
        handleModal();
      });
  };

  return (
    <>
      <IconButton
        size="small"
        color="secondary"
        disabled={isModifyingFeaturedArtwork}
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
      >
        <MdDelete className="svg-icon" />
      </IconButton>
      {handleDialog ? (
        <Dialog
          handleClose={handleModal}
          style={{ marginTop: "10vh", marginBottom: "10vw" }}
          className="md: max-w-screen-md lg:max-w-screen-md w-full"
        >
          <div className="dialog-content">
            <div className="dialog-header">
              <h1 className="component-header">Delete featured artwork</h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="dialog-body mt-5">
                <p className="p-paragraph text-gray-600">
                  Are you sure you want to delete this featured artwork?
                </p>
              </div>
              <div className="dialog-footer mt-5">
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
    </>
  );
}

export default DeleteFeaturedArtwork;
