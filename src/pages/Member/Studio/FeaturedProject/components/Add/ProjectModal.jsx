import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAlert } from "react-alert";
import classNames from "classnames";
// import ProjectModel from "models/Project";
import { handleCompress, handleCompressPreviewImage } from "lib/image";
import { isEmptyStr, isEmpty } from "lib/data";
import { uploadFile } from "lib/media";
import { ReactComponent as UploadIcon } from "assets/svg-icon/UploadIcon.svg";
import { ReactComponent as DeleteImageIcon } from "assets/svg-icon/DeleteImageIcon.svg";
import AddMultipleIsLookingForComponent from "./AddMultipleIsLookingFor";
import { SUPPORTED_IMAGE_FORMATS } from "utils/constant";
import { addFileToStorage } from "utils/stacks-util/storage";
import axios from "axios";
import { apiServer } from "config";
import { userSession, signOut } from "utils/stacks-util/auth";
import { useSelector, useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
import { pushProject } from "utils/redux/slice/projectSlice";

const previewImageOptions = {
  maxSizeMB: 7,
  maxWidthOrHeight: 1800,
  useWebWorker: true,
};

const initialSkills = [
  { value: "Writing", status: false, isLookingFor: false },
  { value: "Visuals", status: false, isLookingFor: false },
  { value: "Music", status: false, isLookingFor: false },
  { value: "Performing", status: false, isLookingFor: false },
  { value: "Digital Editing", status: false, isLookingFor: false },
];
const initialPersons = [
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

export default function ProjectModal(props) {
  const { open, setOpen, project, signedInSmartistsUser, setProjects } = props;
  const alert = useAlert();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const [tempMedia, setTempMedia] = useState(project.fileUrl);
  const [media, setMedia] = useState(null);
  const [title, setTitle] = useState(project.title);
  const [tagline, setTagline] = useState(project.tagline);
  const [description, setDescription] = useState(project.description);
  const [fileUrl, setFileUrl] = useState(project.fileUrl);
  const [artistSkills, setArtistsSkills] = useState(initialSkills);
  const [persons, setPersons] = useState(initialPersons);
  const [other, setOther] = useState(false);
  const [isListeningForAdvice, setIsListeningForAdvice] = useState(false);
  const [dynamicInput, setDynamicInput] = useState([]);

  const checkFormat = (fileExt, formats) => {
    if (!formats.includes(fileExt)) {
      return false;
    }
    return true;
  };

  const handleClose = () => {
    setTitle(null);
    setTagline(null);
    setDescription(null);
    setMedia(null);
    setFileUrl(null);
    setArtistsSkills(initialSkills);
    setPersons(initialPersons);
    setOther(false);
    setDynamicInput([]);
    setFormLoading(false);
    setOpen(false);
  };

  const handleRequiredSkill = (e, i) => {
    const newSkills = [...artistSkills];
    newSkills[i].isLookingFor = !newSkills[i].isLookingFor;
    setArtistsSkills([...newSkills]);
  };

  const handleIsLookingFor = (e, i) => {
    const newIsLookingFor = [...persons];
    newIsLookingFor[i].isLookingFor = !newIsLookingFor[i].isLookingFor;
    setPersons([...newIsLookingFor]);
  };

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    let file = e.target.files;
    if (file.length === 1) {
      file = file[0];
      const fileExt = file.type.split("/")[1].toLowerCase();
      if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
        handleCompressPreviewImage(file)
          .then((res) => {
            if (res.result === "success") {
              setTempMedia(res.data.compressedFile);
              setMedia(res.data.rawFile);
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
    } else {
      e.target.files = null;
    }
  };

  const handleSave = async () => {
    setFormLoading(true);

    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const userWalletAddress = userData.profile.stxAddress.mainnet;
      if (
        !isEmptyStr(title) ||
        !isEmptyStr(tagline) ||
        !isEmptyStr(description)
      ) {
        alert.error("Please fill up the form");
        setFormLoading(false);
        return null;
      }

      if (description.length > 500) {
        alert.error(
          "Your description length should only be a maximum of 500 characters"
        );
        setFormLoading(false);
        return null;
      }

      if (!media) {
        alert.error("Please fill up the form");
        setFormLoading(false);
        return null;
      }

      const skills = artistSkills.filter((a1) => a1.isLookingFor === true);
      const requiredSkills = [];
      skills.forEach((el, i) => {
        const x = Object.assign({}, el);
        delete x["isLookingFor"];
        requiredSkills.push(x);
      });

      const per = persons.filter((a1) => a1.isLookingFor === true);
      const helpers = [];
      per.forEach((el, i) => {
        const x = Object.assign({}, el);
        delete x["isLookingFor"];
        helpers.push(x);
      });

      if (other) {
        dynamicInput.forEach((el, i) => {
          if (!isEmpty(el.value)) {
            helpers.push(el);
          }
        });
      }

      const projectForSubmit = {
        title,
        tagline,
        description,
        media: { fileType: null, fileName: null, fileUrl: null },
        requiredSkills,
        helpers,
        isListeningForAdvice,
      };

      // let newRequiredSkills = [];

      // projectForSubmit.requiredSkills.forEach((el) => {
      //   newRequiredSkills.push({ 'value': el.value, 'status': el.status });
      // });

      // projectForSubmit.requiredSkills = newRequiredSkills;
      // console.log(projectForSubmit);

      // // console.log(JSON.stringify(projectForSubmit.requiredSkills))
      // setFormLoading(false);

      // // projectForSubmit.requiredSkills.forEach((el) => {
      // //   let media = JSON.stringify(el.media);
      // //   el.media = media
      // //   newData.push(el)
      // // });

      imageCompression(media, previewImageOptions)
        .then((res) => {
          return addFileToStorage("smartists/project", res, {
            encrypt: false,
          });
        })
        .then((res) => {
          projectForSubmit.media.fileUrl = res.url;
          projectForSubmit.media.fileName = res.fileName;
          projectForSubmit.media.fileType = "Image";
          return axios.post(`${apiServer}/projects`, {
            ...projectForSubmit,
            userWalletAddress,
          });
        })
        .then((res) => {
          return dispatch(pushProject(res.data.Project));
        })
        .then((res) => {
          setProjects((projects) => [...projects, res.payload]);
          alert.success("Successfully added your Project!");
          handleClose();
        })
        .catch((err) => {
          console.log(err.message);
          // handleClose();
          alert.error("There was a problem submitting your form");
        });

      // console.log(projectForSubmit)
    }
  };

  return (
    <>
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
                    handleSave();
                  }}
                >
                  <p className="w-72 text-xl font-semibold leading-7 text-gray-900">
                    Publish Collaboration Project
                  </p>
                  <div className="flex flex-col space-y-6 items-start justify-start mt-6">
                    <div className="w-full">
                      {tempMedia ? (
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
                                  Upload Image
                                </p>
                                <p className="w-64 text-base leading-normal text-center text-gray-500">
                                  Publish a collaboration project.
                                </p>
                              </div>
                            </div>
                          </label>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        Title
                      </p>
                      <input
                        className="text-base leading-normal text-gray-900 px-3 py-2 w-full bg-white shadow border rounded-md border-gray-300"
                        value={title ? title : ""}
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
                      {artistSkills.map((skill, index) => {
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
                      {persons.map((person, index) => {
                        return (
                          <div
                            className="inline-flex space-x-2 items-center justify-start"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              id={"person" + index}
                              name="person"
                              value={person.value}
                              onChange={(e) => {
                                handleIsLookingFor(e, index);
                              }}
                              disabled={formLoading}
                            />
                            <label
                              htmlFor={"person" + index}
                              className="text-sm leading-normal text-gray-500 ml-2"
                            >
                              {person.value}
                            </label>
                          </div>
                        );
                      })}
                      {/* <div className="inline-flex space-x-2 items-center justify-start">
                        <input
                          type="checkbox"
                          id="person4"
                          name="person"
                          value={other}
                          onChange={(e) => {
                            setOther(!other);
                          }}
                          disabled={formLoading}
                        />
                        <label
                          htmlFor="person4"
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
                          if (!formLoading) {
                            setOpen(false);
                          }
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
