import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAlert } from "react-alert";
import classNames from "classnames";
import { handleCompress, handleCompressPreviewImage } from "lib/image";
import { isValidURL, formatStrData } from "lib/data";
import { addFileToStorage } from "utils/stacks-util/storage";
import AudioPlaceHolder from "assets/images/audio-placeholder.jpg";
import { ReactComponent as UploadIcon } from "assets/svg-icon/UploadIcon.svg";
import { ReactComponent as DeleteImageIcon } from "assets/svg-icon/DeleteImageIcon.svg";
import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
} from "utils/constant";
// import DeleteModal from "../DeleteModal";
import axios from "axios";
import { apiServer } from "config";
import { pushFeaturedWork } from "utils/redux/slice/featuredWorkSlice";
import { userSession, signOut } from "utils/stacks-util/auth";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import imageCompression from "browser-image-compression";

export default function ArtworkModal(props) {
  const { open, setOpen, smartistsUserData, mediaType, setFeaturedWorks } =
    props;
  const alert = useAlert();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const [tempMedia, setTempMedia] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [mediaFile, setMediaFile] = useState(null);

  const previewImageOptions = {
    maxSizeMB: 7,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
  };

  const checkFormat = (fileExt, formats) => {
    if (!formats.includes(fileExt)) {
      return false;
    }
    return true;
  };

  const handleClose = () => {
    setFormLoading(false)
    setTempMedia(null);
    setTitle("");
    setDescription("");
    setBlogUrl("");
    setMediaFile("");
    setOpen(false);
  };

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    if (mediaType) {
      let file = e.target.files;
      if (file.length === 1) {
        file = file[0];
        const fileExt = file.type.split("/")[1].toLowerCase();
        if (mediaType === "Image" || mediaType === "Text") {
          if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
            handleCompressPreviewImage(file)
              .then((res) => {
                if (res.result === "success") {
                  setTempMedia(res.data.compressedFile);
                  setMediaFile(file);
                } else {
                  alert.error("Error compressing file");
                }
              })
              .catch((error) => {
                alert.error("Error compressing file");
              });
          } else {
            e.target.files = null;
            alert.error("Media file type is not supported!");
          }
        }
        if (mediaType === "Video") {
          if (file.size > 25000000) {
            e.target.files = null;
            alert.error("Maximum file size of video is 25mb!");
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
            setTempMedia(tempUrl.length > 0 ? tempUrl : null);

            setMediaFile(file);
          };
          reader.readAsDataURL(file);
        }
        if (mediaType === "Audio") {
          if (file.size > 25000000) {
            e.target.files = null;
            alert.error("Maximum file size of video is 25mb!");
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
            setTempMedia(tempUrl.length > 0 ? tempUrl : null);

            setMediaFile(file);
          };
          reader.readAsDataURL(file);
        }
      } else {
        e.target.files = null;
      }
    } else {
      alert.error("No artwork type found.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const userWalletAddress = userData.profile.stxAddress.mainnet;

      if (
        mediaFile === null ||
        isEmpty(title) ||
        !title.trim() ||
        isEmpty(description) ||
        !description.trim()
      ) {
        alert.error("Please fill up the form");
        setFormLoading(false);
        return true;
      }

      if(description.length > 500){
        alert.error("Your description length should only be a maximum of 500 characters");
        setFormLoading(false);
        return null;
      }

      if (mediaType === "Text" && (blogUrl === null || !blogUrl.trim())) {
        if (!isValidURL(blogUrl)) {
          alert.error("Please input a proper url");
          setFormLoading(false);
          return true;
        }
        alert.error("Please fill up the form");
        setFormLoading(false);
        return true;
      }

      let featuredWorkForSubmit = {
        title: formatStrData(title),
        description: formatStrData(description),
        media: {
          fileType: mediaType,
          fileUrl: null,
          fileName: null,
          blogUrl: mediaType === "Text" ? blogUrl : null,
        },
      };

      if (
        featuredWorkForSubmit.media.fileType === "Image" ||
        featuredWorkForSubmit.media.fileType === "Text"
      ) {
        imageCompression(mediaFile, previewImageOptions)
          .then((res) => {
            return addFileToStorage({dir:"smartists/featuredWork"}, res, {
              encrypt: false,
            });
          })
          .then((res) => {
            featuredWorkForSubmit.media.fileUrl = res.url;
            featuredWorkForSubmit.media.fileName = res.fileName;
            return axios.post(`${apiServer}/featuredworks`, {
              ...featuredWorkForSubmit,
              userWalletAddress,
            });
          })
          .then((res) => {
            return dispatch(pushFeaturedWork(res.data.FeaturedWork));
          })
          .then((res) => {
            setFeaturedWorks((featuredWorks) => [
              ...featuredWorks,
              res.payload,
            ]);
            alert.success("Successfully added your artwork!");
            handleClose();
          })
          .catch((err) => {
            handleClose()
            alert.error("There was a problem submitting your form");
          });
      } else {
        addFileToStorage({dir: "smartists/featuredWork"}, mediaFile, {
          encrypt: false,
        })
          .then((res) => {
            featuredWorkForSubmit.media.fileUrl = res.url;
            featuredWorkForSubmit.media.fileName = res.fileName;
            return axios.post(`${apiServer}/featuredworks`, {
              ...featuredWorkForSubmit,
              userWalletAddress,
            });
          })
          .then((res) => {
            return dispatch(pushFeaturedWork(res.data.FeaturedWork));
          })
          .then((res) => {
            setFeaturedWorks((featuredWorks) => [
              ...featuredWorks,
              res.payload,
            ]);
            alert.success("Successfully added your artwork!");
            handleClose();
          })
          .catch((err) => {
            handleClose()
            alert.error("There was a problem submitting your form");
          });
      }
    } else {
      alert.error("Please sign in to continue");
      signOut();
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={handleClose}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all my-[10vh] sm:my-[10vh] sm:align-middle w-3/4 2xl:w-2/5 sm:p-14">
                <p className="w-72 text-xl font-semibold leading-7 text-gray-900">
                  Publish {mediaType === "Image" ? "an" : "a"} {mediaType}
                </p>
                <div className="flex flex-col space-y-10 items-start justify-start">
                  <div className="flex flex-col space-y-6 items-start justify-start w-full">
                    <div className="mt-6 w-full">
                      {tempMedia ? (
                        <>
                          {(mediaType === "Image" || mediaType === "Text") && (
                            <div className="relative">
                              <img
                                src={tempMedia}
                                alt="media"
                                className="rounded-lg"
                              />
                              <DeleteImageIcon
                                className="absolute top-4 left-4 cursor-pointer"
                                onClick={() => setTempMedia(null)}
                              />
                            </div>
                          )}
                          {mediaType === "Video" && (
                            <div className="relative">
                              <video
                                className="h-full w-full border-gray-400 border border-solid no-focus-media"
                                controls
                                controlsList="nodownload"
                              >
                                <source src={tempMedia} />
                                Your browser does not support the video tag.
                              </video>
                              <DeleteImageIcon
                                className="absolute top-4 left-4 cursor-pointer"
                                onClick={() => setTempMedia(null)}
                              />
                            </div>
                          )}
                          {mediaType === "Audio" && (
                            <div className="relative">
                              <div className="h-64 w-full">
                                <div
                                  className="h-full w-full bg-cover bg-center rounded-t-xl"
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
                                      <source src={tempMedia} />
                                      Your browser does not support the video
                                      tag.
                                    </audio>
                                  </div>
                                </div>
                              </div>
                              <DeleteImageIcon
                                className="absolute top-4 left-4 cursor-pointer"
                                onClick={() => setTempMedia(null)}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            disabled={formLoading}
                            onChange={async (e) => {
                              handleMediaInputChange(e);
                            }}
                          />
                          <label htmlFor="file-upload">
                            <div className="flex justify-center h-72 px-6 pt-16 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer">
                              <div className="space-y-1 text-center">
                                <UploadIcon className="m-auto" />
                                <p className="w-48 text-xl font-medium leading-7 text-center m-auto">
                                  Upload{" "}
                                  {mediaType === "Text" ? "Image" : mediaType}
                                </p>
                                <p className="w-64 text-base leading-normal text-center text-gray-500">
                                  Publish a featured work.
                                </p>
                              </div>
                            </div>
                          </label>
                        </>
                      )}
                    </div>
                    {mediaType === "Text" && (
                      <div className="flex flex-col space-y-1 items-start justify-start w-full">
                        <p className="text-sm font-medium leading-tight text-gray-700">
                          Blog URL
                        </p>
                        <input
                          className="text-base leading-normal text-gray-900 px-3 py-2 w-full bg-white shadow border rounded-md border-gray-300"
                          value={blogUrl}
                          onChange={(e) => setBlogUrl(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        Title
                      </p>
                      <input
                        className="text-base leading-normal text-gray-900 px-3 py-2 w-full bg-white shadow border rounded-md border-gray-300"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={formLoading}
                      />
                    </div>
                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        Description
                      </p>
                      <textarea
                        className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                        rows={8}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={formLoading}
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-start justify-end">
                    <div className="flex items-start justify-start">
                      <button
                        className={classNames(
                          "btn text-base rounded-lg font-medium leading-normal text-gray-900 px-4 py-2"
                        )}
                        disabled={formLoading}
                        onClick={(e) => {
                          if (!formLoading) handleClose();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={classNames(
                          "btn btn-bg bg-red-900 text-base rounded-lg font-medium leading-normal text-white px-4 py-2"
                        )}
                        disabled={formLoading}
                        onClick={(e) => {
                          if (!formLoading) handleSave(e);
                        }}
                      >
                        {formLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
