import React, { useState, useEffect } from "react";
import plusSign from "../../assets/icons/plus.svg";
import { handleCompress, handleCompressPreviewImage } from "../../lib/image";
import { getFileUrl } from "../../lib/media";
import { Profile } from "blockstack";
import { useAlert } from "react-alert";
import StandardInput from "../../customComponents/StandardInput";
import StandardTextArea from "../../customComponents/StandardTextArea";
import { isEmptyStr } from "../../lib/data";
import ReactPlayer from "react-player";
import AudioPlaceHolder from "../../assets/images/audio-placeholder.jpg";

import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "../../utils/constant";
const Form = (props) => {
  const {
    setIsCompressing,
    setPortfolio,
    portfolio,
    formLoading,
    setFormLoading,
    tempMediaUrls,
    setTempMediaUrls,
  } = props;

  const [mediaLoading, setMediaLoading] = useState(null);

  const checkFormat = (fileExt, formats) => {
    if (!formats.includes(fileExt)) {
      return false;
    }
    return true;
  };

  const alert = useAlert();

  const handleInputType = (fileType) => {
    if (fileType === "Image") {
      return "image/*";
    }
    if (fileType === "Video") {
      return "video/*";
    }
    if (fileType === "Audio") {
      return "audio/*";
    }
  };

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    if (portfolio.media.fileType) {
      let file = e.target.files;
      if (file.length === 1) {
        file = file[0];
        const fileExt = file.type.split("/")[1].toLowerCase();
        if (portfolio.media.fileType === "Image") {
          if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
            handleCompressPreviewImage(file)
              .then((res) => {
                if (res.result === "success") {
                  setTempMediaUrls(res.data.compressedFile);
                  setPortfolio({
                    ...portfolio,
                    media: { ...portfolio.media, file: res.data.rawFile },
                  });
                  // console.log(res.data.compressedFile)
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
          } else {
            e.target.files = null;
            alert.error("Media file type is not supported!");
          }
        }
        if (portfolio.media.fileType === "Video") {
          if (file.size > 25000000) {
            e.target.files = null;
            alert.error("Maximum file size of video is 25mb!");
            setMediaLoading(false);
            return null;
          }

          if (!checkFormat(fileExt, SUPPORTED_VIDEO_FORMATS)) {
            e.target.files = null;
            alert.error("Media file type is not supported!");
            return null;
          }

          let reader = new FileReader();

          reader.onload = (e) => {
            const tempUrl = window.URL.createObjectURL(file);
            setTempMediaUrls(tempUrl.length > 0 ? tempUrl : null);
            setPortfolio({
              ...portfolio,
              media: { ...portfolio.media, file: file },
            });
            setIsCompressing(false);
          };
          reader.readAsDataURL(file);
        }
        if (portfolio.media.fileType === "Audio") {
          console.log(file);
          if (file.size > 25000000) {
            e.target.files = null;
            alert.error("Maximum file size of video is 25mb!");
            setMediaLoading(false);
            return null;
          }

          if (!checkFormat(fileExt, SUPPORTED_AUDIO_FORMATS)) {
            e.target.files = null;
            alert.error("Media file type is not supported!");
            return null;
          }

          let reader = new FileReader();

          reader.onload = (e) => {
            const tempUrl = window.URL.createObjectURL(file);
            setTempMediaUrls(tempUrl.length > 0 ? tempUrl : null);
            setPortfolio({
              ...portfolio,
              media: { ...portfolio.media, file: file },
            });
            setIsCompressing(false);
          };
          reader.readAsDataURL(file);
        }
      } else {
        e.target.files = null;
      }
    } else {
      alert.error("No portfolio type found.");
    }
  };

  return (
    <div className="featured-portfolio-root mt-10">
      <div className="pt-10">
        <div className="col-lg-8 bb">
          <div className="upload-container-root">
            <div className="upload-container-media">
              {tempMediaUrls ? (
                <>
                  {portfolio.media.fileType === "Image" && (
                    <>
                      <div
                        className="uploaded-image-container"
                        style={{
                          backgroundImage: `url(${tempMediaUrls})`,
                          borderRadius: "16px",
                        }}
                      ></div>
                    </>
                  )}

                  {portfolio.media.fileType === "Video" && (
                    <>
                      <video className="uploaded-video-container" controls controlsList="nodownload">
                        <source src={tempMediaUrls} type={tempMediaUrls.type} />
                        Your browser does not support the video tag.
                      </video>
                    </>
                  )}

                  {portfolio.media.fileType === "Audio" && (
                    <div
                      className="uploaded-audio-container"
                      style={{ position: "relative" }}
                    >
                      <div
                        className="audio-image-placeholder"
                        style={{
                          backgroundImage: `url(${AudioPlaceHolder})`,
                        }}
                      ></div>
                      <div className="uploaded-audio">
                        <div className="audio-container">
                          <audio className="audio-player" controls controlsList="nodownload">
                            <source
                              src={tempMediaUrls}
                              type={tempMediaUrls.type}
                            />
                            Your browser does not support the video tag.
                          </audio>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    accept={handleInputType(portfolio.media.fileType)}
                    style={{ display: "none" }}
                    id="raised-button-file"
                    type="file"
                    onChange={async (e) => {
                      setIsCompressing(true);
                      handleMediaInputChange(e);
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
      </div>
      <div className="col-8 bb">
        <StandardInput
          className="mt-20"
          label="Title"
          id="image-title"
          value={portfolio.title ? portfolio.title : ""}
          onChange={(e) => {
            if (!isEmptyStr(e.target.value)) {
              setPortfolio({ ...portfolio, title: null });
              return false;
            }
            setPortfolio({ ...portfolio, title: e.target.value });
          }}
          autoComplete="off"
          disabled={formLoading}
          required
        />
        <StandardTextArea
          className="mt-20"
          label="Description"
          id="image-description"
          rows={4}
          value={portfolio.description ? portfolio.description : ""}
          onChange={(e) => {
            if (!isEmptyStr(e.target.value)) {
              setPortfolio({ ...portfolio, description: null });
              return false;
            }
            setPortfolio({ ...portfolio, description: e.target.value });
          }}
          disabled={formLoading}
          required
        />
      </div>
    </div>
  );
};

export default Form;
