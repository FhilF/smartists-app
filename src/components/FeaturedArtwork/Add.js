import React, { useState, useEffect } from "react";

import { useAlert } from "react-alert";

import Dialog from "../../customComponents/Dialog";
import Button from "../../customComponents/Button";
import ButtonDropdown from "../../customComponents/ButtonDropdown";

import { handleCompress } from "../../lib/image";
import Loader from "react-loader-spinner";

import Form from "./Form";

import FeaturedArtworkModel from "models/FeaturedArtwork";

import { uploadFile } from "../../lib/media";

const MaxFeaturedArtwork = (props) => {
  const { handleModal } = props;
  return (
    <div className="dialog-content">
      <div className="dialog-header">
        <h1 className="component-header">Add Featured Artwork</h1>
      </div>
      <div className="dialog-body mt-5">
        <p className="p-paragraph text-gray-600">
          Sorry you have reached the maximum number of Featured Artwork. Please
          delete some to add again.
        </p>
      </div>
      <div className="dialog-footer mt-5">
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleModal();
          }}
        >
          Got it
        </Button>
      </div>
    </div>
  );
};

function AddArtWork(props) {
  const {
    userSession,
    userStudio,
    handleFeaturedArtwork,
    featuredArtworks,
    handleAdd,
    isModifyingFeaturedArtwork,
  } = props;

  const [handleDialog, setHandleDialog] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [tempMediaUrls, setTempMediaUrls] = useState(null);

  const [featuredArtwork, setFeaturedArtwork] = useState({
    media: { fileType: null, file: null },
    title: null,
    description: null,
  });

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

  // useEffect(() => {
  //   console.log(featuredArtwork);
  // }, [featuredArtwork]);

  const handleDropDown = (e) => {
    if (e.target.value) {
      setFeaturedArtwork({
        media: { fileType: e.target.value, file: null },
        title: null,
        description: null,
      });

      setTempMediaUrls(null);
    } else {
      setFeaturedArtwork({
        media: { fileType: null, file: null },
        title: null,
        description: null,
      });
      setTempMediaUrls(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!userSession.isUserSignedIn) {
      alert.error("Please sign in to continue");
      userSession.signUserOut(window.location.origin);
      setFormLoading(false);
      return true;
    }

    if (
      featuredArtwork.media.fileType === null ||
      featuredArtwork.media.file === null ||
      featuredArtwork.title === null ||
      featuredArtwork.description === null
    ) {
      alert.error("Please fill up the form");
      setFormLoading(false);
      return true;
    }

    const featuredArtworkForSubmit = featuredArtwork;

    uploadFile(userSession, "smartists", featuredArtworkForSubmit.media.file, {
      encrypt: false,
    })
      .then((result) => {
        featuredArtworkForSubmit.media.fileName = result.fileName;
        delete featuredArtworkForSubmit.media["file"];
        const featuredArtworkModel = new FeaturedArtworkModel({
          ...featuredArtworkForSubmit,
          studioId: userStudio._id,
        });
        return featuredArtworkModel.save();
      })
      .then((result) => {
        handleModal();
        alert.success("Successfully added your artwork!");
        setFeaturedArtwork({
          media: { fileType: null, file: null },
          title: null,
          description: null,
        });
        setFormLoading(false);
        handleAdd(result);
        // handleFeaturedArtwork();
      })
      .catch((error) => {
        console.log(error);
        alert.error("There was a problem submitting your form");
        setTempMediaUrls(null);
        setFormLoading(false);
      });
  };

  useEffect(() => {
    return () => {
      if (tempMediaUrls) {
        window.URL.revokeObjectURL(tempMediaUrls);
      }
    };
  }, [tempMediaUrls]);

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
        disabled={formLoading || isModifyingFeaturedArtwork}
        color="secondary"
        variant="contained"
      >
        Add
      </Button>

      {handleDialog ? (
        <Dialog
          handleClose={handleModal}
          style={{
            marginTop: "10vh",
            marginBottom: "10vw",
            // width: featuredArtworks.length > 2 ? "500px" : "800px",
          }}
          className="md: max-w-screen-md lg:max-w-screen-md w-full"
        >
          {featuredArtworks.length > 2 ? (
            <MaxFeaturedArtwork handleModal={handleModal} />
          ) : (
            <div className="dialog-content">
              <div className="dialog-header">
                <h1 className="component-header">Add Featured Artwork</h1>
              </div>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="dialog-body mt-5">
                  <div>
                    <div className="lg:w-2/4">
                      <ButtonDropdown
                        label="FeaturedArtwork type"
                        id="role"
                        onChange={(e) => {
                          handleDropDown(e);
                        }}
                        required
                        disabled={formLoading}
                      >
                        <option value="">
                          Choose what type of featured artwork to upload
                        </option>
                        <option value="Image">Image</option>
                        <option value="Video">Video</option>
                        <option value="Audio">Audio</option>
                      </ButtonDropdown>
                    </div>
                    {featuredArtwork.media.fileType && (
                      <Form
                        setIsCompressing={setIsCompressing}
                        setFeaturedArtwork={setFeaturedArtwork}
                        featuredArtwork={featuredArtwork}
                        formLoading={formLoading}
                        setFormLoading={setFormLoading}
                        tempMediaUrls={tempMediaUrls}
                        setTempMediaUrls={setTempMediaUrls}
                      />
                    )}
                  </div>
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
                      {formLoading ? <>Submitting...</> : <>Submit</>}
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
          )}
        </Dialog>
      ) : null}
    </>
  );
}

export default AddArtWork;
