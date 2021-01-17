import React from "react";
import plusSign from "../../assets/icons/plus.svg";
import FormMediaInput from "./FormMediaInput"
const ImageForm = (props) => {
  const {
    setIsCompressing,
    handleMediaInputChange,
    setTempMediaUrls,
    tempMediaUrls,
    setPortfolio,
    porfolio,
    formLoading,
    setFormLoading,
  } = props;

  return (
    <div className="input-container mt-10">
      <div className="upload-container-root">
        <div className="upload-container-extra pt-20 pr-20">
          <div className="upload-container">
            {tempMediaUrls ? (
              <>
                <div
                  className="uploaded-image-container"
                  style={{
                    backgroundImage: `url(${tempMediaUrls})`,
                  }}
                ></div>
              </>
            ) : (
              <>
                <input
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                  onChange={async (e) => {
                    setIsCompressing(true);
                    handleMediaInputChange(e, setIsCompressing)
                      .then((res) => {
                        if (res.result === "success") {
                          setTempMediaUrls(res.data.compressedFile);
                          //   setFeaturedProject({
                          //     ...featuredProject,
                          //     image: res.data.rawFile,
                          //   });
                          setIsCompressing(false);
                        } else {
                          console.log(res);
                          setIsCompressing(false);
                        }
                      })
                      .catch((error) => {
                        console.log();
                        setIsCompressing(false);
                      });
                  }}
                />
                <label htmlFor="raised-button-file">
                  <img src={plusSign} alt="upload" />
                </label>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <FormMediaInput
          setPortfolio={setPortfolio}
          porfolio={porfolio}
          formLoading={formLoading}
          setFormLoading={setFormLoading}
        />
      </div>
    </div>
  );
};

export default ImageForm;
