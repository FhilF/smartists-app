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
    setFeaturedArtwork,
    featuredArtwork,
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

    if (featuredArtwork.media.fileType) {
      let file = e.target.files;
      if (file.length === 1) {
        file = file[0];
        const fileExt = file.type.split("/")[1].toLowerCase();
        if (featuredArtwork.media.fileType === "Image") {
          if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
            handleCompressPreviewImage(file)
              .then((res) => {
                if (res.result === "success") {
                  setTempMediaUrls(res.data.compressedFile);
                  setFeaturedArtwork({
                    ...featuredArtwork,
                    media: { ...featuredArtwork.media, file: res.data.rawFile },
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
        if (featuredArtwork.media.fileType === "Video") {
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
            setFeaturedArtwork({
              ...featuredArtwork,
              media: { ...featuredArtwork.media, file: file },
            });
            setIsCompressing(false);
          };
          reader.readAsDataURL(file);
        }
        if (featuredArtwork.media.fileType === "Audio") {
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
            setFeaturedArtwork({
              ...featuredArtwork,
              media: { ...featuredArtwork.media, file: file },
            });
            setIsCompressing(false);
          };
          reader.readAsDataURL(file);
        }
      } else {
        e.target.files = null;
      }
    } else {
      alert.error("No featuredArtwork type found.");
    }
  };

  return (
    <div className="mt-4">
      <div className="w-full">
        <div className="w-full lg:w-3/4 h-80">
          <div className="h-full w-full">
            {tempMediaUrls ? (
              <>
                {featuredArtwork.media.fileType === "Image" && (
                  <>
                    <div
                      className="h-full w-full bg-cover bg-center border-gray-400 border border-solid"
                      style={{
                        backgroundImage: `url(${tempMediaUrls})`,
                        borderRadius: "16px",
                      }}
                    ></div>
                  </>
                )}

                {featuredArtwork.media.fileType === "Video" && (
                  <>
                    <video
                      className="h-full w-full border-gray-400 border border-solid no-focus-media"
                      controls
                      controlsList="nodownload"
                    >
                      <source src={tempMediaUrls} type={tempMediaUrls.type} />
                      Your browser does not support the video tag.
                    </video>
                  </>
                )}

                {featuredArtwork.media.fileType === "Audio" && (
                  <div
                    className="h-full w-full"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="h-full w-full bg-cover bg-center border-gray-400 border border-solid"
                      style={{
                        backgroundImage: `url(${AudioPlaceHolder})`,
                      }}
                    ></div>
                    <div className="absolute left-0 right-0 top-0 bottom-0">
                      <div className="audio-container flex items-end w-full h-full">
                        <audio
                          className="w-full mx-4 h-10 mb-2 no-focus-media"
                          controls
                          controlsList="nodownload"
                        >
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
              <div className="h-full w-full line border-dashed border-2 border-gray-300">
                <input
                  accept={handleInputType(featuredArtwork.media.fileType)}
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                  onChange={async (e) => {
                    setIsCompressing(true);
                    handleMediaInputChange(e);
                  }}
                />
                <label htmlFor="raised-button-file">
                  <img
                    src={plusSign}
                    alt="upload"
                    className="h-full w-full p-28 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:w-3/4 bb mt-4">
        <StandardInput
          className=""
          label="Title"
          id="image-title"
          value={featuredArtwork.title ? featuredArtwork.title : ""}
          onChange={(e) => {
            if (!isEmptyStr(e.target.value)) {
              setFeaturedArtwork({ ...featuredArtwork, title: null });
              return false;
            }
            setFeaturedArtwork({ ...featuredArtwork, title: e.target.value });
          }}
          autoComplete="off"
          disabled={formLoading}
          required
        />
        <StandardTextArea
          className="mt-2"
          label="Description"
          id="image-description"
          rows={4}
          value={featuredArtwork.description ? featuredArtwork.description : ""}
          onChange={(e) => {
            if (!isEmptyStr(e.target.value)) {
              setFeaturedArtwork({ ...featuredArtwork, description: null });
              return false;
            }
            setFeaturedArtwork({
              ...featuredArtwork,
              description: e.target.value,
            });
          }}
          disabled={formLoading}
          required
        />
      </div>
    </div>
  );
};

export default Form;
