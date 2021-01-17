import React, { useState, useEffect } from "react";

import Button from "../../customComponents/Button";
import Dialog from "../../customComponents/Dialog";
import ButtonDropdown from "../../customComponents/ButtonDropdown";
import { useAlert } from "react-alert";
import { handleMediaInputChange, handleCompress } from "../../lib/image";
import { isEmpty } from "../../lib/data";

import FormImage from "./FormImage";
import FormVideo from "./FormVideo";

function AddPortfolio() {
  const [handleDialog, setHandleDialog] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [tempMediaUrls, setTempMediaUrls] = useState();
  const [porfolio, setPortfolio] = useState({
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

  useEffect(() => {
    console.log(porfolio);
  }, [porfolio]);

  const handleDropDown = (e) => {
    if (e.target.value) {
      setPortfolio({
        media: { fileType: e.target.value, file: null },
        title: null,
        description: null,
      });
    } else {
      setPortfolio({
        media: { fileType: null, file: null },
        title: null,
        description: null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert.success("Please fill the up the required details!");
  };
  return (
    <div className="add-portfolio-root">
      <Button
        color="secondary"
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
      >
        Add
      </Button>
      {handleDialog && (
        <Dialog
          handleClose={handleModal}
          style={{ marginTop: "10vh", marginBottom: "10vw", width: "900px" }}
        >
          <div className="dialog-content">
            <div className="dialog-header">
              <h1 className="component-header">Add portfolio</h1>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="dialog-body mt-20">
                <div>
                  <div className="col-lg-6">
                    <label className="input-label">
                      Portfolio type<span className="required">*</span>
                    </label>
                    <ButtonDropdown
                      label={false}
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
                  <div>
                    <FormImage
                      setIsCompressing={setIsCompressing}
                      handleMediaInputChange={handleMediaInputChange}
                      setTempMediaUrls={setTempMediaUrls}
                      tempMediaUrls={tempMediaUrls}
                      setPortfolio={setPortfolio}
                      porfolio={porfolio}
                      formLoading={formLoading}
                      setFormLoading={setFormLoading}
                    />

                    <FormVideo
                      setIsCompressing={setIsCompressing}
                      handleMediaInputChange={handleMediaInputChange}
                      setTempMediaUrls={setTempMediaUrls}
                      tempMediaUrls={tempMediaUrls}
                      setPortfolio={setPortfolio}
                      porfolio={porfolio}
                      formLoading={formLoading}
                      setFormLoading={setFormLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="dialog-footer mt-20">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleModal();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" color="secondary" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default AddPortfolio;
