import React, { useState, useEffect, Fragment } from "react";
import { ReactComponent as PencilIcon } from "assets/svg-icon/PencilIcon.svg";
import { Dialog, Transition } from "@headlessui/react";
import { useAlert } from "react-alert";
import classNames from "classnames";

import { ReactComponent as DeleteImageIcon } from "assets/svg-icon/DeleteImageIcon.svg";
import { IoCloudUploadOutline, IoCloseOutline } from "react-icons/io5";

import imageCompression from "browser-image-compression";
import { apiServer } from "config";

import StandardInput from "customComponents/StandardInput";
import StandardTextArea from "customComponents/StandardTextArea";
import { isEmptyStr } from "lib/data";
import imagePlaceHolder from "assets/images/mountain-placeholder.jpg";
import IconButton from "customComponents/IconButton";
import { MdEdit, MdDelete } from "react-icons/md";

import UpdateImageComponent from "./UpdateImage";

import { SUPPORTED_IMAGE_FORMATS } from "utils/constant";
// import AddMultipleIsLookingForComponent from "./AddMultipleIsLookingFor";
import structuredClone from "@ungap/structured-clone";
import {
  deleteFileFromStorage,
  addFileToStorage,
} from "utils/stacks-util/storage";
import axios from "axios";

const checkFormat = (fileExt, formats) => {
  if (!formats.includes(fileExt)) {
    return false;
  }
  return true;
};

function Update(props) {
  const { oldFeaturedProject, setFeaturedProject } = props;
  const [open, setOpen] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const [tempMediaUrls, setTempMediaUrls] = useState(null);
  const [newMedia, setNewMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [other, setOther] = useState(false);
  const [dynamicInput, setDynamicInput] = useState([]);

  const [tempMedia, setTempMedia] = useState(null);

  const skillReference = [
    { value: "Writing", status: false, isLookingFor: false },
    { value: "Visuals", status: false, isLookingFor: false },
    { value: "Music", status: false, isLookingFor: false },
    { value: "Performing", status: false, isLookingFor: false },
    { value: "Digital Editing", status: false, isLookingFor: false },
  ];

  const helperReference = [
    {
      value: "Funding",
      status: false,
      isLookingFor: false,
      isOtherOption: false,
    },
    {
      value: "Clients",
      status: false,
      isLookingFor: false,
      isOtherOption: false,
    },
    {
      value: "Ambassadors / Supporters",
      status: false,
      isLookingFor: false,
      isOtherOption: false,
    },
  ];

  let projectClone = structuredClone(oldFeaturedProject);
  // const parsedRequiredSkill = projectClone.requiredSkills.map(function (x) {
  //   return JSON.parse(x);
  // });

  // const parsedHelpers = projectClone.helpers.map(function (x) {
  //   return JSON.parse(x);
  // });

  let newRequiredSkill = [];

  skillReference.map((x) => {
    const cloneX = structuredClone(x);
    var res = projectClone.requiredSkills.filter((a1) => a1.value === cloneX.value);
    if (res.length > 0) {
      cloneX.isLookingFor = true;
      cloneX.status = res[0].status;
    }
    newRequiredSkill = [...newRequiredSkill, cloneX];
  });

  let newHelpers = [];

  helperReference.map(function (x) {
    const cloneX = structuredClone(x);
    var res = projectClone.helpers.filter((a1) => a1.value === cloneX.value);
    if (res.length > 0) {
      cloneX.isLookingFor = true;
      cloneX.status = res[0].status;
    }
    newHelpers = [...newHelpers, cloneX];
  });

  projectClone = {
    ...projectClone,
    requiredSkills: newRequiredSkill,
    helpers: newHelpers,
  };

  const [title, setTitle] = useState(projectClone.title);
  const [tagline, setTagline] = useState(projectClone.tagline);
  const [description, setDescription] = useState(projectClone.description);
  const [isListeningForAdvice, setIsListeningForAdvice] = useState(
    projectClone.isListeningForAdvice
  );
  const [media, setMedia] = useState(projectClone.media);
  const [requiredSkills, setRequiredSkills] = useState(newRequiredSkill);
  const [helpers, setHelpers] = useState(newHelpers);

  const [mediaPreviewFile, setMediaPreviewFile] = useState();
  const [tempMediaPreviewFile, setTempMediaPreviewFile] = useState();

  const alert = useAlert();

  // const newOtherExtraUsers = projectClone.helpers.filter(function (
  //   obj
  // ) {
  //   return !newHelpers.some(function (obj2) {
  //     return obj.value === obj2.value;
  //   });
  // });

  // if (newOtherExtraUsers.length === 0) {
  //   setOther(false);
  //   setDynamicInput([]);
  // } else {
  //   setOther(true);
  //   setDynamicInput(newOtherExtraUsers);
  // }

  const handleRequiredSkill = (e, i) => {
    const newSkills = [...requiredSkills];
    newSkills[i].isLookingFor = !newSkills[i].isLookingFor;
    setRequiredSkills(newSkills);
  };

  const handleIsLookingFor = (e, i) => {
    const newIsLookingFor = [...helpers];
    newIsLookingFor[i].isLookingFor = !newIsLookingFor[i].isLookingFor;
    setHelpers(newIsLookingFor);
  };

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    let file = e.target.files;
    if (file.length === 1) {
      file = file[0];
      const fileExt = file.type.split("/")[1].toLowerCase();
      if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
        imageCompression(file)
          .then((res) => {
            setTempMediaPreviewFile(URL.createObjectURL(res));
            setMediaPreviewFile(file);
          })
          .catch((error) => {
            alert.error("Error compressing file");
          });
      } else {
        e.target.files = null;
        alert.error("Media file type is not supported!");
      }
    } else {
      e.target.files = null;
    }
  };

  const handleSubmit = async () => {
    if (
      !isEmptyStr(title) ||
      !isEmptyStr(tagline) ||
      !isEmptyStr(description)
    ) {
      alert.error("Please fill up the form");
      setFormLoading(false);
      return null;
    }

    if(description.length > 500){
      alert.error("Your description length should only be a maximum of 500 characters");
      setFormLoading(false);
      return null;
    }

    const skills = requiredSkills.filter((a1) => a1.isLookingFor === true);
    const newRequiredSkills = [];
    skills.forEach((el, i) => {
      const x = Object.assign({}, el);
      delete x["isLookingFor"];
      newRequiredSkills.push(x);
    });

    const per = helpers.filter((a1) => a1.isLookingFor === true);
    const newHelpers = [];
    per.forEach((el, i) => {
      const x = Object.assign({}, el);
      delete x["isLookingFor"];
      newHelpers.push(x);
    });

    const projectForSubmit = {
      title,
      tagline,
      description,
      isListeningForAdvice,
      media,
      requiredSkills: newRequiredSkills,
      helpers: newHelpers,
    };

    try {
      if (mediaPreviewFile) {
        deleteFileFromStorage(media.fileName);
        const newMediaFile = await imageCompression(mediaPreviewFile);
        const fileUploaded = await addFileToStorage(
          {dir: "smartists/project"},
          newMediaFile,
          {
            encrypt: false,
          }
        );

        projectForSubmit.media.fileUrl = fileUploaded.url;
        projectForSubmit.media.fileName = fileUploaded.fileName;
        projectForSubmit.media.fileType = "Image";
      }

      const result = await axios.put(
        `${apiServer}/projects/${oldFeaturedProject.id}`,
        projectForSubmit
      );

      setFeaturedProject({ ...oldFeaturedProject, ...result.data.Project });

      console.log(result);
      // setProjects((projects) => [...projects, result.data.Project]);
      // console.log(result);

      alert.success("Successfully added your Project!");
      setFormLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
      setFormLoading(false);
      alert.error("There was a problem submitting your form");
    }
  };

  return (
    <>
      <div
        className="inline-flex space-x-2 items-center justify-center w-48 py-2 pl-2.5 pr-3 bg-white shadow border rounded-full border-gray-400 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <PencilIcon />
        <p className="text-sm font-medium leading-none text-gray-900">
          Edit this project
        </p>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <p className="w-72 text-xl font-semibold leading-7 text-gray-900">
                    Edit Collaboration Project
                  </p>
                  <div className="flex flex-col space-y-6 items-start justify-start mt-6">
                    <div className="w-full">
                      <div className="relative">
                        <img
                          src={
                            tempMediaPreviewFile
                              ? tempMediaPreviewFile
                              : media.fileUrl
                          }
                          alt="media"
                          className="rounded-lg"
                        />
                        {tempMediaPreviewFile ? (
                          <div className="absolute top-4 left-4 ">
                            <div className="cursor-pointer rounded-full bg-red-900 p-2">
                              <p className="text-xl text-white">
                                <IoCloseOutline
                                  onClick={() => {
                                    setTempMediaPreviewFile(null);
                                    setMediaPreviewFile(null);
                                  }}
                                />
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute top-4 left-4 ">
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={async (e) => {
                                handleMediaInputChange(e);
                              }}
                            />
                            <label htmlFor="file-upload">
                              <div className="cursor-pointer rounded-full bg-red-900 p-2">
                                <p className="text-xl text-white">
                                  <IoCloudUploadOutline
                                    onClick={() => setTempMedia(null)}
                                  />
                                </p>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
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
                        Tagline
                      </p>
                      <input
                        className="text-base leading-normal text-gray-900 px-3 py-2 w-full bg-white shadow border rounded-md border-gray-300"
                        value={tagline ? tagline : ""}
                        onChange={(e) => setTagline(e.target.value)}
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
                        value={description ? description : ""}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={formLoading}
                      />
                    </div>
                    <div className="flex flex-col space-y-1 items-start justify-start">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        For this project I am looking for creative partners or
                        collaborators with the following skills:
                      </p>
                      {requiredSkills.map((skill, index) => {
                        return (
                          <div
                            className="inline-flex space-x-2 items-center justify-start"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              id={"skills-" + index}
                              name="artistSkills"
                              value={skill.value}
                              checked={skill.isLookingFor}
                              disabled={formLoading}
                              onChange={(e) => {
                                handleRequiredSkill(e, index);
                              }}
                            />
                            <label
                              htmlFor={"skills" + index}
                              className="text-sm leading-normal text-gray-500 ml-2"
                            >
                              {skill.value}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col space-y-1 items-start justify-start">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        For this project I am open to listen to the audience's
                        advice...
                      </p>
                      <div className="inline-flex space-x-2 items-center justify-start">
                        <input
                          type="radio"
                          id="advice-true"
                          name="audienceAdvice"
                          checked={isListeningForAdvice}
                          disabled={formLoading}
                          onChange={(e) => {
                            setIsListeningForAdvice(true);
                          }}
                        />
                        <label
                          htmlFor="adviceTrue"
                          className="text-sm leading-normal text-gray-500 ml-2"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="inline-flex space-x-2 items-center justify-start">
                        <input
                          type="radio"
                          id="advice-false"
                          name="audienceAdvice"
                          checked={!isListeningForAdvice}
                          disabled={formLoading}
                          onChange={(e) => {
                            setIsListeningForAdvice(false);
                          }}
                        />
                        <label
                          htmlFor="adviceFalse"
                          className="text-sm leading-normal text-gray-500 ml-2"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 items-start justify-start">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        For this project I am also looking for...
                      </p>
                      {helpers.map((helper, index) => {
                        return (
                          <div
                            className="inline-flex space-x-2 items-center justify-start"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              id={"helper" + index}
                              name="helper"
                              value={helper.value}
                              onChange={(e) => {
                                handleIsLookingFor(e, index);
                              }}
                              disabled={formLoading}
                              checked={helper.isLookingFor}
                            />
                            <label
                              htmlFor={"helper" + index}
                              className="text-sm leading-normal text-gray-500 ml-2"
                            >
                              {helper.value}
                            </label>
                          </div>
                        );
                      })}
                      {/* <div className="inline-flex space-x-2 items-center justify-start">
                        <input
                          type="checkbox"
                          id="helper4"
                          name="helper"
                          value={other}
                          onChange={(e) => {
                            setOther(!other);
                          }}
                          disabled={formLoading}
                        />
                        <label
                          htmlFor="helper4"
                          className="text-sm leading-normal text-gray-500 ml-2"
                        >
                          Other
                        </label>
                      </div>
                      {other && (
                        <AddMultipleIsLookingForComponent
                          dynamicInput={dynamicInput}
                          setDynamicInput={setDynamicInput}
                          formLoading={formLoading}
                        />
                      )} */}
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
                          if (!formLoading) setOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className={classNames(
                          "btn btn-bg bg-red-900 text-base rounded-lg font-medium leading-normal text-white px-4 py-2"
                        )}
                        disabled={formLoading}
                        type="submit"
                      >
                        {formLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default Update;
