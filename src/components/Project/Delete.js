import React, { useState } from "react";

import IconButton from "../../customComponents/IconButton";
import Button from "../../customComponents/Button";
import Dialog from "../../customComponents/Dialog";
import { useAlert } from "react-alert";
import Loader from "react-loader-spinner";
import { MdDelete } from "react-icons/md";

import { deleteMediaFile } from "../../lib/media";

function Delete(props) {
  const {
    project,
    handleDeleteUpdateList,
    handlePreview,
    setViewProjectCopy,
    isModifyingProject,
  } = props;
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
    deleteMediaFile(project.data.attrs.fileName)
      .then(
        (res) => {
          return project.data.destroy();
        },
        (err) => {
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          if (error.code === "file_not_found") {
            return project.data.destroy();
          } else {
            throw err;
          }
        }
      )
      .then(() => {
        handleModal();
        handleDeleteUpdateList(project.index);
        handlePreview(null, {});
        alert.success("Successfully delete your project");
        setViewProjectCopy({ index: null, data: {} });
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
        disabled={isModifyingProject}
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
              <h1 className="component-header">Delete project</h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="dialog-body mt-5">
                <p className="p-paragraph text-gray-600">
                  Are you sure you want to delete this featured Project?
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
    </div>
  );
}

export default Delete;
