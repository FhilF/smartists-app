import React, { useState, useEffect } from "react";

import { useAlert } from "react-alert";

import Dialog from "../../customComponents/Dialog";
import Button from "../../customComponents/Button";
import ButtonDropdown from "../../customComponents/ButtonDropdown";

import { handleCompress } from "../../lib/image";
import Loader from "react-loader-spinner";

import Form from "./Form";

import PortfolioModel from "../../models/Portfolio";

import { uploadFile } from "../../lib/media";

const MaxPortfolio = (props) => {
  const { handleModal } = props;
  return (
    <div className="dialog-content">
      <div className="dialog-header">
        <h1 className="component-header">Add portfolio</h1>
      </div>
      <div className="dialog-body mt-20">
        <p className="p-paragraph text-gray-600">
          Sorry you have reached the maximum number featured portfolio. Please
          delete some to add again.
        </p>
      </div>
      <div className="dialog-footer mt-20">
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
  const { userSession, userStudio, handlePortfolio, portfolioList } = props;
  const [handleDialog, setHandleDialog] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [tempMediaUrls, setTempMediaUrls] = useState(null);

  const [portfolio, setPortfolio] = useState({
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
  //   console.log(portfolio);
  // }, [portfolio]);

  const handleDropDown = (e) => {
    if (e.target.value) {
      setPortfolio({
        media: { fileType: e.target.value, file: null },
        title: null,
        description: null,
      });

      setTempMediaUrls(null);
    } else {
      setPortfolio({
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

    const portfolioForSubmit = portfolio;

    uploadFile(userSession, "smartists", portfolioForSubmit.media.file, {
      encrypt: false,
    })
      .then((result) => {
        portfolioForSubmit.media.fileName = result.fileName;
        delete portfolioForSubmit.media["file"];
        const portfolioModel = new PortfolioModel({
          ...portfolioForSubmit,
          studioId: userStudio[0].attrs._id,
        });
        return portfolioModel.save();
      })
      .then((result) => {
        alert.success("Successfully added your artwork!");
        setPortfolio({
          media: { fileType: null, file: null },
          title: null,
          description: null,
        });
        handleModal();
        setFormLoading(false);
        handlePortfolio();
      })
      .catch((error) => {
        alert.error("There was a problem submitting your form");
        setPortfolio({
          ...portfolio,
          media: { ...portfolio.media, file: null },
        });
        setTempMediaUrls(null);
        setFormLoading(false);
      });

    // PortfolioModel.fetchOwnList()
    //   .then((result) => {
    //     if (result.length === 0) {
    //       const studioModel = new StudioModel({
    //         username: userData.username,
    //         banner: null,
    //         artworks: [],
    //       });

    //       setLoadingProgress(90);
    //       return studioModel.save();
    //     } else {
    //       console.log("You already have one");
    //       return result;
    //     }
    //   })
    //   .then((result) => {
    //     setFormLoading(false);
    //     setUserStudio(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setFormLoading(false);
    //   });
    // console.log(portfolioModel);
    // alert.error("Please fill the up the required details!");
  };

  // useEffect(() => {
  //   return () => {
  //     if (tempImgUrls) {
  //       window.URL.revokeObjectURL(tempImgUrls);
  //     }
  //   };
  // }, [tempImgUrls]);

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
        disabled={formLoading}
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
            width: portfolioList.length > 2 ? "500px" : "800px",
          }}
        >
          {portfolioList.length > 2 ? (
            <MaxPortfolio handleModal={handleModal} />
          ) : (
            <div className="dialog-content">
              <div className="dialog-header">
                <h1 className="component-header">Add portfolio</h1>
              </div>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="dialog-body mt-20">
                  <div>
                    <div className="col-lg-6">
                      <ButtonDropdown
                        label="Portfolio type"
                        id="role"
                        onChange={(e) => {
                          handleDropDown(e);
                        }}
                        required
                      >
                        <option value="">
                          Choose what type of portfolio to upload
                        </option>
                        <option value="Image">Image</option>
                        <option value="Video">Video</option>
                        <option value="Audio">Audio</option>
                      </ButtonDropdown>
                    </div>
                    {portfolio.media.fileType && (
                      <Form
                        setIsCompressing={setIsCompressing}
                        setPortfolio={setPortfolio}
                        portfolio={portfolio}
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
