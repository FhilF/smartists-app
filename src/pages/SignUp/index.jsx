import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { useSelector, useDispatch } from "react-redux";

import { signOut, userSession } from "utils/stacks-util/auth";
import { ReactComponent as UploadUserImageIcon } from "assets/svg-icon/UploadUserImageIcon.svg";
import ArtistForm from "./ArtistForm";
import ArtUserForm from "./ArtUserForm";
import TermsAndConfidentialityAgreements from "./TermsAndConfidentialityAgreements";
import StandardCheckBoxItem from "customComponents/StandardCheckBoxItem";
import { addFileToStorage } from "utils/stacks-util/storage";
import { isValidURL } from "lib/data";
import { useAlert } from "react-alert";
import { SUPPORTED_IMAGE_FORMATS } from "utils/constant";
import {
  registerSmartistsUserAsync,
  defineSmartistsUserSession,
} from "utils/redux/slice/userSessionSlice";
import { isEmpty } from "lodash";

import { hexStringToECPair, getPublicKeyFromPrivate } from "@stacks/encryption";
import { isMainnet } from "config";

function SignUp(props) {
  const { setUserType } = props;
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState({
    ag1: false,
    ag2: false,
    ag3: false,
    ag4: false,
    // ag1: true,
    // ag2: true,
    // ag3: true,
    // ag4: true,
  });

  let navigate = useNavigate();

  const alert = useAlert();

  const [member, setMember] = useState({
    username: null,
    name: null,
    classification: {
      isArtist: { isTrue: false, info: { skills: [], openWork: false } },
      isArtUser: {
        isTrue: false,
        info: { majorInterest: null, primaryInterest: [] },
      },
    },
    displayPictureURL: null,
    coverPictureURL: null,
    websiteUrl: null,
    description: null,
    email: null,
  });

  const [checkBoxArtist, setCheckBoxArtist] = useState(false);
  const [checkboxArtUser, setCheckBoxArtUser] = useState(false);

  const [file, setFile] = useState(null);
  const [tempImgUrls, setTempImgUrls] = useState();

  useEffect(() => {
    return () => {
      if (tempImgUrls) {
        window.URL.revokeObjectURL(tempImgUrls);
      }
    };
  }, [tempImgUrls]);

  const uploadImageOptions = {
    maxSizeMB: 4.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const previewImageOptions = {
    maxSizeMB: 7,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
  };

  //   useEffect(() => {
  //   }, [formName]);

  function isEmptyStr(str) {
    return !str || 0 === str.length || !str.trim();
  }

  function handleRequiredDetails() {
    alert.error("Please fill the up the required details!");
    setFormLoading(false);
  }

  const handleSubmit = async () => {
    setFormLoading(true);
    const userData = userSession.loadUserData();
    if (!userSession.isUserSignedIn()) {
      alert.error("User is not signed in");
      window.location.reload();
      return true;
    }

    if (
      !Object.keys(agreedToTerms).every(function (k) {
        return agreedToTerms[k];
      })
    ) {
      alert.error("You haven't agreed to all terms");
      setFormLoading(false);
      return true;
    }

    if (isEmpty(member.username) || isEmpty(member.email)) {
      handleRequiredDetails();
      return true;
    }

    if (member.websiteUrl) {
      if (!isValidURL(member.websiteUrl)) {
        alert.error("Please input a proper url");
        setFormLoading(false);
        return true;
      }
    }

    if (!checkBoxArtist && !checkboxArtUser) {
      handleRequiredDetails();
      return true;
    }

    if (member.classification.isArtUser.isTrue) {
      if (
        member.classification.isArtUser.info.majorInterest === null ||
        member.classification.isArtUser.info.majorInterest === "" ||
        member.classification.isArtUser.info.primaryInterest.length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    if (member.classification.isArtist.isTrue) {
      if (
        member.classification.isArtist.info.openWork === null ||
        member.classification.isArtist.info.openWork === "" ||
        member.classification.isArtist.info.skills.length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    if (file) {
      new Promise(function (resolve, reject) {
        const compressedFile = imageCompression(file, uploadImageOptions);
        if (compressedFile) {
          resolve(compressedFile);
        } else {
          reject("error");
        }
      })
        .then(
          (image) => {
            return addFileToStorage("smartists/displayPicture", image, {
              encrypt: false,
            });
          },
          (err) => {
            // alert.error("There was a problem uploading your image");
            throw new Error("");
          }
        )
        .then((res) => {
          return dispatch(
            registerSmartistsUserAsync({
              ...member,
              walletAddress: userData.profile.stxAddress.mainnet,
              identityAddress: userData.identityAddress,
              walletAddressTestnet: userData.profile.stxAddress.testnet,
              publicKey: getPublicKeyFromPrivate(userData.appPrivateKey),
              displayPictureURL: res.url,
            })
          ).unwrap();
        })
        .then((res) => {
          setFormLoading(false);
          sessionStorage.setItem("SmartistsUser", JSON.stringify(res));
          dispatch(defineSmartistsUserSession(res.SmartistsUser));
          setUserType("SmartistsUser-Type");
          alert.success("Welcome to smartists!");
          navigate(`/${res.SmartistsUser[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/`, {
            state: { showWelcome: true },
          });
        })
        .catch((err) => {
          console.log(err);
          setFormLoading(false);
          alert.error(
            "There was a problem submitting the form please try again later!"
          );
        });
    } else {
      dispatch(
        registerSmartistsUserAsync({
          ...member,
          walletAddress: userData.profile.stxAddress.mainnet,
          identityAddress: userData.identityAddress,
          walletAddressTestnet: userData.profile.stxAddress.testnet,
          publicKey: getPublicKeyFromPrivate(userData.appPrivateKey),
        })
      )
        .unwrap()
        .then((res) => {
          setFormLoading(false);
          sessionStorage.setItem("SmartistsUser", JSON.stringify(res));
          dispatch(defineSmartistsUserSession(res.SmartistsUser));
          setUserType("SmartistsUser-Type");
          alert.success("Welcome to smartists!");
          navigate(`/${res.SmartistsUser[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/`, {
            state: { showWelcome: true },
          });
        })
        .catch((err) => {
          const error = JSON.parse(err.message);
          if (error.name === "SequelizeUniqueConstraintError") {
            if (
              error.errors[0].path !== "walletAddress" ||
              error.errors[0].path !== "identityAddress"
            ) {
              alert.error(
                `Sorry that ${error.errors[0].path} has already been taken`
              );
            } else {
              alert.error("Your wallet address is already registered");
              signOut();
            }
          } else {
            alert.error(
              "There was a problem submitting the form please try again later!"
            );
          }
          setFormLoading(false);
        });
    }
  };

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

    setFile(file);

    new Promise(function (resolve, reject) {
      const compressedFile = imageCompression(file, previewImageOptions);
      if (compressedFile) {
        resolve(compressedFile);
      } else {
        reject("error");
      }
    }).then(
      (image) => {
        const tempUrls = window.URL.createObjectURL(image);
        setTempImgUrls(tempUrls.length > 0 ? tempUrls : null);
      },
      (err) => {
        alert.error("Error uploading image");
      }
    );
  };

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
                info: { ...member.classification.isArtist.info },
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
                info: { skills: [], openWork: false },
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
                info: { ...member.classification.isArtUser.info },
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
                info: { majorInterest: null, primaryInterest: [] },
              },
            },
          });
        }
        return;
      }
    };
  };

  useEffect(() => {
    // console.log(countryCodes.sort((a, b) => a.code.localeCompare(b.code)))
  }, []);

  return (
    <div>
      {/* <button
        onClick={(e) => {
          setUserType("SmartistsUser-Type");
          navigate(`/SP3RX10HM09TZF9NYHS6ZEG5XK4Y6H5HADY46GKN`, {
            state: { showWelcome: true },
          });
        }}
      >aa</button> */}
      <div className="text-center pt-8">
        <p className="text-4xl font-medium leading-10 text-center">
          Setup your account
        </p>
        <p className="text-base mt-4 leading-normal text-center text-gray-600">
          This is your introduction to the Smartists Community.
        </p>
      </div>
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="form"
        >
          <div className="mt-20">
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
                        {tempImgUrls ? (
                          <div
                            style={{
                              backgroundImage: `url(${tempImgUrls})`,
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
                      Username<span className=" text-red-900">*</span>
                    </p>
                    <input
                      placeholder="Your username"
                      id="name"
                      className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                      value={member.username ? member.username : ""}
                      onChange={(e) => {
                        if (isEmptyStr(e.target.value)) {
                          setMember({ ...member, username: null });
                          return false;
                        }
                        setMember({ ...member, username: e.target.value });
                      }}
                      autoComplete="off"
                      disabled={formLoading}
                    />
                  </div>
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
                      value={member.websiteUrl ? member.websiteUrl : ""}
                      onChange={(e) => {
                        if (isEmptyStr(e.target.value)) {
                          setMember({ ...member, websiteUrl: null });
                          return false;
                        }
                        setMember({ ...member, websiteUrl: e.target.value });
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
              <div></div>
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
                    Role<span className=" text-red-900">*</span>
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
                    disabled={formLoading}
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
                    disabled={formLoading}
                  />

                  <div className="art-form">
                    {member.classification.isArtist.isTrue === true ? (
                      <div className="mt-8">
                        <ArtistForm
                          member={member}
                          setMember={setMember}
                          formLoading={formLoading}
                        />
                      </div>
                    ) : null}

                    {member.classification.isArtUser.isTrue === true ? (
                      <div className="mt-8">
                        <ArtUserForm
                          member={member}
                          setMember={setMember}
                          formLoading={formLoading}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                {(member.classification.isArtist.isTrue === true ||
                  member.classification.isArtUser.isTrue === true) && (
                  <div className="mt-12">
                    <TermsAndConfidentialityAgreements
                      agreedToTerms={agreedToTerms}
                      setAgreedToTerms={setAgreedToTerms}
                      disabled={formLoading}
                      alert={alert}
                    />
                    <div className="mt-6 pr-64">
                      <button
                        className={classNames(
                          "inline-flex items-center justify-center w-80 px-4 py-2 bg-red-900 shadow rounded-full",
                          formLoading ||
                            !Object.keys(agreedToTerms).every(
                              (k) => agreedToTerms[k]
                            )
                            ? "opacity-50 cursor-default"
                            : "cursor-pointer"
                        )}
                        type="submit"
                        disabled={
                          formLoading ||
                          !Object.keys(agreedToTerms).every(
                            (k) => agreedToTerms[k]
                          )
                        }
                      >
                        <p className="text-base font-medium leading-normal text-white">
                          {formLoading ? "Submitting..." : "Continue"}
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
