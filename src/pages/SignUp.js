import React, { useState, useEffect } from "react";

import SmartistsUserModel from "../models/SmartistsUser";
import { useBlockstack } from "react-blockstack";
import placeHolder from "../assets/images/avatar-placeholder.png";

import RoleLabel from "../components/RoleLabel";

import ArtistForm from "../components/ArtistForm";
import ArtUserForm from "../components/ArtUserForm";
import TermsAndConfidentialityAgreements from "../components/TermsAndConfidentialityAgreements";

import StandardInput from "../customComponents/StandardInput";
import StandardTextArea from "../customComponents/StandardTextArea";
import ButtonDropdown from "../customComponents/ButtonDropdown";

import Button from "../customComponents/Button";
import LoadingBar from "../components/LoadingBar";

import Loader from "react-loader-spinner";
import { useAlert } from "react-alert";

import {
  SUPPORTED_MEDIA_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "../utils/constant";

import { useHistory } from "react-router-dom";

import imageCompression from "browser-image-compression";

import { v4 as uuidv4 } from "uuid";

import mountainPlaceholder from "../assets/images/mountain-placeholder.jpg";

function SignUp(props) {
  const { setSmartistsUser } = props;
  const { userSession } = useBlockstack();
  const [formLoading, setFormLoading] = useState(false);
  const [formRole, setFormRole] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState({
    ag1: false,
    ag2: false,
    ag3: false,
    ag4: false,
    ag5: false,
  });

  useEffect(() => {
    console.log(agreedToTerms);
  }, [agreedToTerms]);

  const history = useHistory();

  const alert = useAlert();

  const uploadFile = async (userSession, dir, file, options) => {
    const id = uuidv4();
    let extension;
    if (file.type === "image/png") {
      extension = ".png";
    } else if (file.type === "image/jpg") {
      extension = ".jpg";
    } else if (file.type === "image/jpeg") {
      extension = ".jpeg";
    } else if (file.type === "video/mp4") {
      extension = ".mp4";
    } else {
      extension = "";
    }

    const filename = `${dir}/${id}${extension}`;
    const gaialink = await userSession.putFile(filename, file, options);
    return gaialink;
  };

  const [profile, setProfile] = useState({
    name: null,
    isArtist: { boolean: false, info: { skills: [], openWork: false } },
    isArtUser: {
      boolean: false,
      info: { majorInterest: null, primaryInterest: [] },
    },
    displayPicture: null,
    websiteUrl: null,
    description: null,
    email: null,
  });

  const [file, setFile] = useState(null);
  const [tempImgUrls, setTempImgUrls] = useState();

  useEffect(() => {}, []);

  useEffect(() => {
    return () => {
      if (tempImgUrls) {
        window.URL.revokeObjectURL(tempImgUrls);
      }
    };
  }, [tempImgUrls]);

  const uploadImageOptions = {
    maxSizeMB: 1,
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

  const handleSubmit = async (e) => {
    setFormLoading(true);
    const userData = userSession.loadUserData();

    if (
      !Object.keys(agreedToTerms).every(function (k) {
        return agreedToTerms[k];
      })
    ) {
      alert.error("You haven't agreed to all terms");
      setFormLoading(false);
      return true;
    }

    if (formRole === "" || formRole === null) {
      handleRequiredDetails();
      return true;
    }

    if (profile.isArtUser.boolean) {
      if (
        profile.isArtUser.info.majorInterest === null ||
        profile.isArtUser.info.majorInterest === "" ||
        profile.isArtUser.info.primaryInterest.length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    if (profile.isArtist.boolean) {
      if (
        profile.isArtist.info.openWork === null ||
        profile.isArtist.info.openWork === "" ||
        profile.isArtist.info.skills.length === 0
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
            return uploadFile(userSession, "smartistsProfileImage", image, {
              encrypt: false,
            });
          },
          (err) => {
            alert.error("There was a problem uploading your image");
          }
        )
        .then((result) => {
          const smartistModel = new SmartistsUserModel({
            ...profile,
            displayPicture: result,
            username: userData.username,
          });
          return smartistModel.save();
        })
        .then((result) => {
          alert.success("Successfully submitted your form!");
          setSmartistsUser(result);
          setFormLoading(false);
          history.push("/");
        })
        .catch((error) => {
          alert.error(
            "There was a problem submitting the form please try again later!"
          );
        });
    } else {
      const smartistModel = new SmartistsUserModel({
        ...profile,
        username: userData.username,
      });

      smartistModel
        .save()
        .then((result) => {
          alert.success("Successfully submitted your form!");
          setSmartistsUser([result]);
          setFormLoading(false);
          history.push(`/member/${userData.username}`);
        })
        .catch((error) => {
          alert.error(
            "There was a problem submitting the form please try again later!"
          );
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

  const handleDropDown = (e) => {
    setFormRole(e.target.value);
    if (e.target.value === "Artist") {
      setProfile({
        ...profile,
        isArtist: {
          boolean: true,
          info: { ...profile.isArtist.info },
        },
        isArtUser: {
          boolean: false,
          info: { majorInterest: null, primaryInterest: [] },
        },
      });
    }

    if (e.target.value === "Art-user") {
      setProfile({
        ...profile,
        isArtist: {
          boolean: false,
          info: { skills: [], openWork: false },
        },
        isArtUser: {
          boolean: true,
          info: { ...profile.isArtUser.info },
        },
      });
    }

    if (e.target.value === "Artist & Art-user") {
      setProfile({
        ...profile,
        isArtist: {
          boolean: true,
          info: { ...profile.isArtist.info },
        },
        isArtUser: {
          boolean: true,
          info: { ...profile.isArtUser.info },
        },
      });
    }

    if (e.target.value === "") {
      setProfile({
        ...profile,
        isArtist: {
          boolean: false,
          info: { skills: [], openWork: false },
        },
        isArtUser: {
          boolean: false,
          info: { majorInterest: null, primaryInterest: [] },
        },
      });
    }
  };

  return (
    <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
      <div className="pt-8">
        <h1 className="text-4xl text-gray-800">Account setup</h1>
        <p className="text-sm font-semibold text-gray-400 mt-2">
          This is your introduction to the Smartists Community!
        </p>
      </div>
      <div className="lg:w-1/2 2xl:w-5/12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="form"
        >
          <div className="mt-8">
            <div className="flex justify-center">
              <div className="w-28 h-28">
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
                <label htmlFor="raised-button-file" className="h-full">
                  <div className="h-full w-full relative">
                    <div
                      style={{
                        backgroundImage: `url(${
                          tempImgUrls ? tempImgUrls : placeHolder
                        })`,
                      }}
                      className="h-full w-full rounded-full bg-center bg-cover border-gray-400 border cursor-pointer"
                    ></div>
                  </div>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <StandardInput
                className="mt-2"
                label="Name"
                id="name"
                value={profile.name ? profile.name : ""}
                onChange={(e) => {
                  if (isEmptyStr(e.target.value)) {
                    setProfile({ ...profile, name: null });
                    return false;
                  }
                  setProfile({ ...profile, name: e.target.value });
                }}
                autoComplete="off"
                disabled={formLoading}
              />
              <StandardInput
                className="mt-2"
                label="Website URL"
                id="website-url"
                value={profile.websiteUrl ? profile.websiteUrl : ""}
                onChange={(e) => {
                  if (isEmptyStr(e.target.value)) {
                    setProfile({ ...profile, websiteUrl: null });
                    return false;
                  }
                  setProfile({ ...profile, websiteUrl: e.target.value });
                }}
                autoComplete="off"
                disabled={formLoading}
              />

              <StandardInput
                className="mt-2"
                label="Email"
                id="email"
                type="email"
                rows={4}
                value={profile.email ? profile.email : ""}
                onChange={(e) => {
                  if (isEmptyStr(e.target.value)) {
                    setProfile({ ...profile, email: null });
                    return false;
                  }
                  setProfile({ ...profile, email: e.target.value });
                }}
                autoComplete="off"
                disabled={formLoading}
              />
            </div>
            <div className="mt-2">
              <div className="input-label">
                <RoleLabel />
              </div>
              <div className="col-lg-6">
                <ButtonDropdown
                  label={false}
                  id="role"
                  value={formRole}
                  onChange={(e) => {
                    handleDropDown(e);
                  }}
                  required
                  disabled={formLoading}
                >
                  <option value="">Choose a role</option>
                  <option value="Artist">Artist</option>
                  <option value="Art-user">Art-user</option>
                  <option value="Artist & Art-user">Artist & Art-user</option>
                </ButtonDropdown>
              </div>

              <div
                className={
                  profile.isArtist.boolean === true ||
                  profile.isArtUser.boolean === true
                    ? "mt-4"
                    : null
                }
              >
                <div className="art-form">
                  {profile.isArtist.boolean === true ? (
                    <ArtistForm
                      profile={profile}
                      setProfile={setProfile}
                      formLoading={formLoading}
                    />
                  ) : null}

                  {profile.isArtist.boolean === true &&
                    profile.isArtUser.boolean === true && (
                      <div className="mt-8"></div>
                    )}

                  {profile.isArtUser.boolean === true ? (
                    <ArtUserForm
                      profile={profile}
                      setProfile={setProfile}
                      formLoading={formLoading}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <StandardTextArea
              className="col-lg-8 mt-2"
              label="Describe yourself"
              id="description"
              rows={4}
              value={profile.description ? profile.description : ""}
              onChange={(e) => {
                if (isEmptyStr(e.target.value)) {
                  setProfile({ ...profile, description: null });
                  return false;
                }
                setProfile({ ...profile, description: e.target.value });
              }}
              disabled={formLoading}
            />
            <div className="mt-30">
              <p style={{ fontWeight: "600", fontSize: "12px" }}>
                We value Confidentiality and Intellectual Property!
              </p>
              <p style={{ fontSize: "12px" }} className="text-gray-500">
                Your communications on Smartists are private and secure thanks
                to blockchain technology, but they are also legally protected
                once you sign the following Confidentiality Agreement.
              </p>
            </div>
            <TermsAndConfidentialityAgreements
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              disabled={formLoading}
              alert={alert}
            />
            <div className="mt-8 flex justify-end">
              <Button link={"/"}>Cancel</Button>{" "}
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
