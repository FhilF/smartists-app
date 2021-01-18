import React, { useState, useEffect } from "react";

import SmartistsUserModel from "../models/SmartistsUser";
import { useBlockstack } from "react-blockstack";
import placeHolder from "../assets/images/avatar-placeholder.png";

import RoleLabel from "../components/RoleLabel";

import ArtistForm from "../components/ArtistForm";
import ArtUserForm from "../components/ArtUserForm";
import TermsAndConfidentialityAgreements from "../components/TermsAndConfidentialityAgreements";

import ContainedFunctionButton from "../customComponents/ContainedFunctionButton";
import TextNavButton from "../customComponents/TextNavButton";
import TextFunctionButton from "../customComponents/TextFunctionButton";
import StandardInput from "../customComponents/StandardInput";
import StandardTextArea from "../customComponents/StandardTextArea";
import ButtonDropdown from "../customComponents/ButtonDropdown";

import Button from "../customComponents/Button";

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

import "../scss/signUp.scss";

import mountainPlaceholder from "../assets/images/mountain-placeholder.jpg";

function SignUp(props) {
  const { setSmartistsUser } = props;
  const { userSession } = useBlockstack();
  const [formLoading, setFormLoading] = useState(false);
  const [formRole, setFormRole] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    isArtist: { boolean: false, info: { skills: [], openWork: null } },
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

  useEffect(() => {}, [profile]);

  useEffect(() => {
    return () => {
      if (tempImgUrls) {
        window.URL.revokeObjectURL(tempImgUrls);
      }
    };
  }, [tempImgUrls]);

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

  function isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  function handleRequiredDetails() {
    alert.error("Please fill the up the required details!");
    setFormLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const userData = userSession.loadUserData();

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

    if (!agreedToTerms) {
      setFormLoading(false);
      alert.error(
        "You must agree to the Terms and confidentiality agreements!"
      );
      return true;
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
          setFormLoading(false);
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
          setSmartistsUser(result);
          setFormLoading(false);
          history.push("/");
        })
        .catch((error) => {
          alert.error(
            "There was a problem submitting the form please try again later!"
          );
          setFormLoading(false);
        });
    }

    setFormLoading(false);
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
    <div className="sign-up-root ">
      <div className="sign-up card p-20 bb pb-40">
        <div>
          <h1 className="component-header text-gray-900">Account setup</h1>
          <p className="component-header-paragraph text-gray-500 mt-5">
            This is your introduction to the Smartists Community!
          </p>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mt-20">
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

              <div className="mt-20">
                <div>
                  {profile.isArtist.boolean === true ? (
                    <ArtistForm
                      profile={profile}
                      setProfile={setProfile}
                      formLoading={formLoading}
                    />
                  ) : null}

                  {profile.isArtist.boolean && profile.isArtUser.boolean && (
                    <div className="mt-30"></div>
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
            <div className="action-container mt-40">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  // handleModal();
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
      </div>
    </div>
  );
}

export default SignUp;
