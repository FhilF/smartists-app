import React, { Component, useState, useEffect } from "react";
import placeHolder from "assets/images/avatar-placeholder.png";
import { v4 as uuidv4 } from "uuid";
import StandardCheckBoxItem from "customComponents/StandardCheckBoxItem";
import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "utils/constant";
import ArtistForm from "./ArtistFormEdit";
import ArtUserForm from "./ArtUserFormEdit";
import { useAlert } from "react-alert";
import { some, isEmpty, isNil, get, isBoolean } from "lodash";
import { deleteMediaFile, uploadFile } from "lib/media";
import { handleCompress } from "lib/image";
import { isValidURL } from "lib/data";
import { ReactComponent as UploadUserImageIcon } from "assets/svg-icon/UploadUserImageIcon.svg";

import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

import { userSession } from "utils/stacks-util/auth";

import { Oval } from "react-loader-spinner";
import axios from "axios";
import { apiServer } from "config";
import { updateSmartistsUserSession } from "utils/redux/slice/userSessionSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  addFileToStorage,
  deleteFileFromStorage,
} from "utils/stacks-util/storage";
import classNames from "classnames";
import structuredClone from "@ungap/structured-clone";

function SmartistsUserEdit(props) {
  const {
    smartistsUserSession,
    setSignedInSmartistsUser,
    setSmartistsUserData,
  } = props;
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);

  const dispatch = useDispatch();
  const userData = userSession.loadUserData();

  const alert = useAlert();

  const smartistsMemberCopy = structuredClone(smartistsUserSession);
  const artistSkillsReference = [
    { value: "Writing", isChecked: false },
    { value: "Visuals", isChecked: false },
    { value: "Music", isChecked: false },
    { value: "Performing", isChecked: false },
    { value: "Digital Editing", isChecked: false },
  ];

  const primaryInterestReference = [
    { value: "On demand Artists", isChecked: false },
    { value: "Creative Collaborations", isChecked: false },
    { value: "Licensed Art work files on sale", isChecked: false },
    { value: "Other", isChecked: false },
  ];

  const [checkBoxArtist, setCheckBoxArtist] = useState(
    smartistsMemberCopy.classification?.isArtist?.isTrue
  );
  const [checkboxArtUser, setCheckBoxArtUser] = useState(
    smartistsMemberCopy.classification?.isArtUser?.isTrue
  );

  let newSkill = [];
  const smartistsMemberSkillsCopy = [
    ...smartistsMemberCopy.classification?.isArtist?.info?.skills,
  ];
  artistSkillsReference.map((x) => {
    const cloneX = structuredClone(x);
    var res = smartistsMemberSkillsCopy.filter((a1) => a1 === cloneX.value);
    if (res.length > 0) {
      cloneX.isChecked = true;
    }
    newSkill = [...newSkill, cloneX];
  });

  let newPrimaryInterest = [];
  const smartistsMemberPrimaryInterestCopy = [
    ...smartistsMemberCopy.classification?.isArtUser.info.primaryInterest,
  ];
  primaryInterestReference.map((x) => {
    const cloneX = structuredClone(x);
    var res = smartistsMemberPrimaryInterestCopy.filter(
      (a1) => a1 === cloneX.value
    );
    if (res.length > 0) {
      cloneX.isChecked = true;
    }
    newPrimaryInterest = [...newPrimaryInterest, cloneX];
  });

  const [member, setMember] = useState({
    name: smartistsMemberCopy.name,
    classification: {
      isArtist: {
        ...smartistsMemberCopy.classification?.isArtist,
        info: {
          ...smartistsMemberCopy.classification?.isArtist?.info,
          skills: [...newSkill],
        },
      },
      isArtUser: {
        ...smartistsMemberCopy.classification?.isArtUser,
        info: {
          ...smartistsMemberCopy.classification?.isArtUser.info,
          primaryInterest: [...newPrimaryInterest],
        },
      },
    },
    displayPictureURL: smartistsMemberCopy.displayPictureURL,
    websiteURL: smartistsMemberCopy.websiteURL,
    description: smartistsMemberCopy.description,
    email: smartistsMemberCopy.email,
  });

  const uploadImageOptions = {
    maxSizeMB: 4.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  useEffect(() => {
    // console.log(member)
  }, [member]);

  const handleCheckbox = (setter, role) => {
    return (e) => {
      const value = e.target.checked;

      setter(value);

      if (role === "Artist") {
        if (value) {
          setMember({
            ...member,
            classification: {
              ...member.classification,
              isArtist: {
                isTrue: true,
                info: { ...member.classification?.isArtist?.info },
              },
            },
          });
        } else {
          setMember({
            ...member,
            classification: {
              ...member.classification,
              isArtist: {
                isTrue: false,
                info: { skills: [...artistSkillsReference], openWork: false },
              },
            },
          });
        }
        return;
      }

      if (role === "Art-user") {
        if (value) {
          setMember({
            ...member,
            classification: {
              ...member.classification,
              isArtUser: {
                isTrue: true,
                info: { ...member.classification?.isArtUser?.info },
              },
            },
          });
        } else {
          setMember({
            ...member,
            classification: {
              ...member.classification,
              isArtUser: {
                isTrue: false,
                info: {
                  majorInterest: null,
                  primaryInterest: [...primaryInterestReference],
                },
              },
            },
          });
        }
        return;
      }
    };
  };

  function handleRequiredDetails() {
    alert.error("Please fill the up the required details!");
    setFormLoading(false);
  }

  const handleSubmit = () => {
    setFormLoading(true);
    if (!userSession.isUserSignedIn) {
      alert.error("Please sign in to continue");
      userSession.signUserOut();
      setFormLoading(false);
      return null;
    }

    if (isEmpty(member.email)) {
      handleRequiredDetails();
      return true;
    }

    const newSkills = [];
    const newPrimaryInterests = [];

    let newUpdateMember = Object.assign({}, member);

    if (newUpdateMember.websiteURL) {
      if (!isValidURL(newUpdateMember.websiteURL)) {
        alert.error("Please input a proper url");
        setFormLoading(false);
        return true;
      }
    }

    if (newUpdateMember.classification?.isArtist?.isTrue) {
      const skills =
        newUpdateMember.classification?.isArtist?.info.skills.filter(
          (a1) => a1.isChecked === true
        );
      skills.forEach((el, i) => {
        const x = Object.assign({}, el);
        delete x["isChecked"];
        newSkills.push(x.value);
      });
    }

    if (newUpdateMember.classification?.isArtUser?.isTrue) {
      const primarySkills =
        newUpdateMember.classification?.isArtUser?.info.primaryInterest.filter(
          (a1) => a1.isChecked === true
        );
      primarySkills.forEach((el, i) => {
        const x = Object.assign({}, el);
        delete x["isChecked"];
        newPrimaryInterests.push(x.value);
      });
    }

    newUpdateMember = {
      ...newUpdateMember,
      classification: {
        isArtist: {
          ...newUpdateMember.classification?.isArtist,
          info: {
            ...newUpdateMember.classification?.isArtist?.info,
            skills: [...newSkills],
          },
        },
        isArtUser: {
          ...newUpdateMember.classification?.isArtUser,
          info: {
            ...newUpdateMember.classification?.isArtUser?.info,
            primaryInterest: [...newPrimaryInterests],
          },
        },
      },
    };

    if (!checkBoxArtist && !checkboxArtUser) {
      handleRequiredDetails();
      return true;
    }

    if (newUpdateMember.classification?.isArtUser?.isTrue) {
      if (
        newUpdateMember.classification?.isArtUser?.info.majorInterest ===
          null ||
        newUpdateMember.classification?.isArtUser?.info.majorInterest === "" ||
        newUpdateMember.classification?.isArtUser?.info.primaryInterest
          .length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    if (newUpdateMember.classification?.isArtist?.isTrue) {
      if (
        newUpdateMember.classification?.isArtist?.info.openWork === null ||
        newUpdateMember.classification?.isArtist?.info.openWork === "" ||
        newUpdateMember.classification?.isArtist?.info.skills.length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    if (file) {
      const fileUrl = smartistsMemberCopy.displayPictureURL;
      if (fileUrl) {
        const fileName = fileUrl.substring(
          fileUrl.indexOf("smartists/displayPicture")
        );
        deleteFileFromStorage(fileName)
          .then(() => {
            return imageCompression(file, uploadImageOptions);
          })
          .then((res) => {
            return addFileToStorage("smartists/displayPicture", res, {
              encrypt: false,
            });
          })
          .then((res) => {
            return axios.put(
              `${apiServer}/smartistsusers/${smartistsMemberCopy.walletAddress}`,
              { ...newUpdateMember, displayPictureURL: res.url }
            );
          })
          .then((res) => {
            return dispatch(updateSmartistsUserSession(res.data.SmartistsUser));
          })
          .then((res) => {
            alert.success("Successfully updated your info!");
            const fetchedSmartistsUser = res.payload;
            let userSessionStorage = sessionStorage.getItem("SmartistsUser");
            userSessionStorage = JSON.parse(userSessionStorage);

            userSessionStorage.SmartistsUser = {
              ...userSessionStorage.SmartistsUser,
              ...fetchedSmartistsUser,
            };
            setSmartistsUserData(userSessionStorage.SmartistsUser);
            setSignedInSmartistsUser(userSessionStorage.SmartistsUser);
            sessionStorage.setItem(
              "SmartistsUser",
              JSON.stringify(userSessionStorage)
            );
            navigate(`/${fetchedSmartistsUser.walletAddress}/about-me`);

            setFormLoading(false);
          })
          .catch((err) => {
            setFormLoading(false);
            console.log(err);
          });
      } else {
        console.log("mewo");
        imageCompression(file, uploadImageOptions)
          .then((res) => {
            return addFileToStorage("smartists/displayPicture", res, {
              encrypt: false,
            });
          })
          .then((res) => {
            return axios.put(
              `${apiServer}/smartistsusers/${smartistsMemberCopy.walletAddress}`,
              { ...newUpdateMember, displayPictureURL: res.url }
            );
          })
          .then((res) => {
            return dispatch(updateSmartistsUserSession(res.data.SmartistsUser));
          })
          .then((res) => {
            alert.success("Successfully updated your info!");
            const fetchedSmartistsUser = res.payload;
            let userSessionStorage = sessionStorage.getItem("SmartistsUser");
            userSessionStorage = JSON.parse(userSessionStorage);

            userSessionStorage.SmartistsUser = {
              ...userSessionStorage.SmartistsUser,
              ...fetchedSmartistsUser,
            };
            setSmartistsUserData(userSessionStorage.SmartistsUser);
            setSignedInSmartistsUser(userSessionStorage.SmartistsUser);
            sessionStorage.setItem(
              "SmartistsUser",
              JSON.stringify(userSessionStorage)
            );
            navigate(`/${fetchedSmartistsUser.walletAddress}/about-me`);

            setFormLoading(false);
          })
          .catch((err) => {
            setFormLoading(false);
            console.log(err);
          });
      }
    } else {
      axios
        .put(
          `${apiServer}/smartistsusers/${smartistsMemberCopy.walletAddress}`,
          newUpdateMember
        )
        .then((res) => {
          return dispatch(updateSmartistsUserSession(res.data.SmartistsUser));
        })
        .then((res) => {
          alert.success("Successfully updated your info!");
          const fetchedSmartistsUser = res.payload;
          let userSessionStorage = sessionStorage.getItem("SmartistsUser");
          userSessionStorage = JSON.parse(userSessionStorage);

          userSessionStorage.SmartistsUser = {
            ...userSessionStorage.SmartistsUser,
            ...fetchedSmartistsUser,
          };
          setSmartistsUserData(userSessionStorage.SmartistsUser);
          setSignedInSmartistsUser(userSessionStorage.SmartistsUser);
          sessionStorage.setItem(
            "SmartistsUser",
            JSON.stringify(userSessionStorage)
          );
          navigate(`/${fetchedSmartistsUser.walletAddress}/about-me`);

          setFormLoading(false);
        })
        .catch((err) => {
          alert.error(
            "There was a problem submitting the form please try again later!"
          );
          navigate(`/${smartistsMemberCopy.walletAddress}/about-me`);
          setFormLoading(false);
          console.log(err);
        });
    }
  };

  const previewImageOptions = {
    maxSizeMB: 7,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
  };

  const [file, setFile] = useState(null);
  const [tempImgUrls, setTempImgUrls] = useState();

  function isEmptyStr(str) {
    return !str || 0 === str.length || !str.trim();
  }

  const handleMediaInputChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length !== 1) {
      return null;
    }

    let file = files[0];
    const fileNameSplit = file.type.split("/");
    const fileExtension = fileNameSplit[fileNameSplit.length - 1].toLowerCase();

    if (!SUPPORTED_IMAGE_FORMATS.includes(fileExtension)) {
      alert.error("File is not supported");
      return null;
    }

    const tempUrls = window.URL.createObjectURL(file);
    setTempImgUrls(tempUrls.length > 0 ? tempUrls : null);

    setFile(file);

    // new Promise(function (resolve, reject) {
    //   const compressedFile = imageCompression(file, previewImageOptions);
    //   if (compressedFile) {
    //     resolve(compressedFile);
    //   } else {
    //     reject("error");
    //   }
    // }).then(
    //   (image) => {
    //     const tempUrls = window.URL.createObjectURL(image);
    //     setTempImgUrls(tempUrls.length > 0 ? tempUrls : null);
    //   },
    //   (err) => {
    //     alert.error("Error uploading image");
    //   }
    // );
  };

  useEffect(() => {
    return () => {
      if (tempImgUrls) {
        window.URL.revokeObjectURL(tempImgUrls);
      }
    };
  }, [tempImgUrls]);
  return (
    <div className="flex-grow w-full flex flex-col p-4 pb-0 md:p-8 lg:p-0 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="pt-8">
        <p className="text-4xl font-medium leading-10">Edit your Information</p>
        <p className="text-base leading-normal text-gray-600 mt-6">
          Update the information you share in Smartists and click save.
        </p>
      </div>
      <div className="w-full mt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="form"
        >
          <div className="mt-8">
            <div className="grid gap-8 grid-cols-3">
              <div className="w-16 h-0.5 bg-gray-200" />
              <div />
              <div />
              <div>
                <p className="text-lg font-semibold leading-7 text-gray-900">
                  Member Information
                </p>
                <p className="text-base leading-normal text-gray-600">
                  Tell a little bit about yourself.
                </p>
              </div>
              <div>
                <div className="w-full h-24 mb-4">
                  <div className="flex space-x-6 items-center justify-start flex-1">
                    <div className="relative" style={{ width: 98, height: 98 }}>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="raised-button-file"
                        type="file"
                        onChange={async (e) => {
                          await handleMediaInputChange(e);
                        }}
                        className="input-upload"
                        disabled={formLoading}
                      />
                      <label htmlFor="raised-button-file">
                        {tempImgUrls || member.displayPictureURL ? (
                          <div
                            style={{
                              backgroundImage: `url(${
                                tempImgUrls || member.displayPictureURL
                              })`,
                            }}
                            className="w-24 h-24 bg-gray-100 rounded-full cursor-pointer bg-center bg-cover"
                          />
                        ) : (
                          <UploadUserImageIcon className="cursor-pointer" />
                        )}
                      </label>
                    </div>
                    <div className="inline-flex flex-col space-y-1 items-start justify-start flex-1">
                      <p className="text-sm font-medium leading-tight">
                        Upload Member Pic
                      </p>
                      <p className="w-64 text-sm leading-normal text-gray-500">
                        PNG, JPG or GIF up to 5 mb.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-8 items-start justify-start max-w-sm">
                  <div className="flex flex-col space-y-1 items-start justify-start w-full">
                    <p className="text-sm font-medium leading-tight text-gray-700">
                      Account Name
                    </p>
                    <input
                      placeholder="Your name"
                      id="name"
                      className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                      value={member.name ? member.name : ""}
                      onChange={(e) => {
                        if (isEmptyStr(e.target.value)) {
                          setMember({ ...member, name: null });
                          return false;
                        }
                        setMember({ ...member, name: e.target.value });
                      }}
                      autoComplete="off"
                      disabled={formLoading}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 items-start justify-start w-full">
                    <p className="text-sm font-medium leading-tight text-gray-700">
                      Email<span className=" text-red-900">*</span>
                    </p>
                    <input
                      className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                      placeholder="you@example.com"
                      id="email"
                      type="email"
                      rows={4}
                      value={member.email ? member.email : ""}
                      onChange={(e) => {
                        if (isEmptyStr(e.target.value)) {
                          setMember({ ...member, email: null });
                          return false;
                        }
                        setMember({ ...member, email: e.target.value });
                      }}
                      autoComplete="off"
                      disabled={formLoading}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 items-start justify-start w-full">
                    <p className="text-sm font-medium leading-tight text-gray-700">
                      Website
                    </p>
                    <input
                      className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                      placeholder="Optional"
                      id="website-url"
                      value={member.websiteURL ? member.websiteURL : ""}
                      onChange={(e) => {
                        if (isEmptyStr(e.target.value)) {
                          setMember({ ...member, websiteURL: null });
                          return false;
                        }
                        setMember({ ...member, websiteURL: e.target.value });
                      }}
                      autoComplete="off"
                      disabled={formLoading}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 items-start justify-start w-full h-1/3">
                    <p className="text-sm font-medium leading-tight text-gray-700">
                      Small description about you
                    </p>
                    <textarea
                      className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                      placeholder="Keep it short and simple."
                      id="description"
                      rows={4}
                      value={member.description ? member.description : ""}
                      onChange={(e) => {
                        if (isEmptyStr(e.target.value)) {
                          setMember({ ...member, description: null });
                          return false;
                        }
                        setMember({ ...member, description: e.target.value });
                      }}
                      disabled={formLoading}
                    />
                  </div>
                </div>
              </div>
              <div />
              <div className="w-16 h-0.5 bg-gray-200" />
              <div />
              <div />
              <div>
                <p className="text-lg font-semibold leading-7 text-gray-900">
                  Your role in Smartists
                </p>
                <p className="text-base leading-normal text-gray-600">
                  How are you going to use the platform?
                </p>
              </div>
              <div>
                <div></div>
                <div className="mt-2">
                  <div className="text-sm font-medium leading-tight text-gray-700">
                    Role*
                  </div>
                  <StandardCheckBoxItem
                    label={
                      <div className="inline-flex flex-col space-y-2 items-start justify-start">
                        <div className="flex flex-col items-start justify-start w-full">
                          <p className="w-full text-sm font-medium leading-tight text-gray-900">
                            Artist
                          </p>
                          <p className="w-full text-sm leading-normal text-gray-500">
                            I want to open a studio, publish my works and
                            collaborate with others.
                          </p>
                        </div>
                      </div>
                    }
                    onChange={handleCheckbox(setCheckBoxArtist, "Artist")}
                    checked={checkBoxArtist}
                    className="mt-2 mb-2"
                  />
                  <StandardCheckBoxItem
                    label={
                      <div className="inline-flex flex-col space-y-2 items-start justify-start">
                        <div className="flex flex-col items-start justify-start w-full">
                          <p className="w-full text-sm font-medium leading-tight text-gray-900">
                            Art-user
                          </p>
                          <p className="w-full text-sm leading-normal text-gray-500">
                            I’m looking for works to buy or hiring artists.
                          </p>
                        </div>
                      </div>
                    }
                    onChange={handleCheckbox(setCheckBoxArtUser, "Art-user")}
                    checked={checkboxArtUser}
                    className="mt-2 mb-2"
                  />

                  <div className="art-form">
                    {member.classification?.isArtist?.isTrue === true ? (
                      <div className="mt-8">
                        <ArtistForm
                          member={member}
                          setMember={setMember}
                          formLoading={formLoading}
                        />
                      </div>
                    ) : null}

                    {member.classification?.isArtUser?.isTrue === true ? (
                      <div className="mt-8">
                        <ArtUserForm
                          member={member}
                          setMember={setMember}
                          formLoading={formLoading}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="relative mt-12 mb-4">
                    <div className="mt-6 pr-64">
                      <button
                        className={classNames(
                          "inline-flex items-center justify-center w-96 px-4 py-2 bg-red-900 shadow rounded-full",
                          formLoading
                            ? "opacity-50 cursor-default"
                            : "cursor-pointer"
                        )}
                        type="submit"
                        disabled={formLoading}
                      >
                        <p className="text-base font-medium leading-normal text-white">
                          {formLoading ? "Updating..." : "Save"}
                        </p>
                      </button>
                    </div>
                    {/* <button className="inline-flex items-center justify-center w-96 px-4 py-2 bg-red-900 shadow rounded-full">
                      <p className="text-base font-medium leading-normal text-white">
                        {formLoading ? "Updating" : "Save"}
                      </p>
                    </button>
                    {formLoading && (
                      <Oval
                        className="btn-loader"
                        color="#00BFFF"
                        height={25}
                        width={25}
                      />
                    )} */}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${smartistsUserSession.walletAddress}/about-me`);
                    }}
                    className="inline-flex items-center justify-center w-96 px-1 py-2 shadow rounded-full"
                  >
                    <p className="text-base font-medium leading-normal text-gray-900">
                      Discard changes
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SmartistsUserEdit;
