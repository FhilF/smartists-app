import React, { useState, useEffect } from "react";

import SmartistUserModel from "../models/SmartistUser";
import { useBlockstack } from "react-blockstack";
import placeHolder from "../assets/images/avatar-placeholder.png";

import ArtistForm from "../components/ArtistForm";
import ArtUserForm from "../components/ArtUserForm";

import {
  SUPPORTED_MEDIA_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "../utils/constant";

import imageCompression from "browser-image-compression";

import { v4 as uuidv4 } from "uuid";

function Form(props) {
  const { setShowForm } = props;
  const { userSession } = useBlockstack();
  const [formLoading, setFormLoading] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");

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
  });

  const [file, setFile] = useState(null);
  const [tempImgUrls, setTempImgUrls] = useState();

  useEffect(() => {
  }, [profile]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const userData = userSession.loadUserData();

    if (formRole === "" || formRole === null) {
      console.log("please fill the up the required details");
      return true;
    }

    if (file) {
      console.log(file);
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
            console.log({ result: "error", cause: "error uploading image" });
          }
        )
        .then((result) => {
          const smartistModel = new SmartistUserModel({
            ...profile,
            displayPicture: result,
            username: userData.username,
          });
          console.log(smartistModel);
          return smartistModel.save();
        })
        .then((result) => {
          console.log({ result: "success", info: result });
          setShowForm(false);
          setFormLoading(false);
        })
        .catch((error) => {
          console.log({ result: "error", info: error });
          setFormLoading(false);
        });
    } else {
      console.log('test')
      const smartistModel = new SmartistUserModel({
        ...profile,
        username: userData.username,
      });

      smartistModel
        .save()
        .then((result) => {
          console.log({ result: "success", info: result });
          setShowForm(false);
          setFormLoading(false);
        })
        .catch((error) => {
          console.log({ result: "error", info: error });
          setFormLoading(false);
        });
      // try {
      //   await smartistModel.save();
      //   setFormLoading(false);
      //   setShowForm(false);
      //   console.log({ result: "success" });
      // } catch (error) {
      //   console.log({ result: "error", reason: error });
      //   setFormLoading(false);
      // }
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
      console.log({ result: "error", cause: "file not supported" });
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
        console.log({ result: "error", cause: "error uploading image" });
      }
    );
  };

  return (
    <div>
      <div>{formLoading ? <p>Submitting form...</p> : null}</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <input
            accept="image/*,video/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={async (e) => {
              await handleMediaInputChange(e);
            }}
          />
          <label htmlFor="raised-button-file">
            <div
              style={{
                backgroundImage: `url(${
                  tempImgUrls ? tempImgUrls : placeHolder
                })`,
                borderRadius: "50%",
                borderColor: "gray",
                border: "3px solid ",
                width: "100px",
                height: "100px",
                cursor: "pointer",
                backgroundSize: "cover",
              }}
            ></div>
            {/* <img
              src={tempImgUrls ? tempImgUrls : placeHolder}
              alt="..."
              style={{
                borderRadius: "50%",
                borderColor: "gray",
                border: "3px solid ",
                width: "100px",
                height: "100px",
                cursor: "pointer",
              }}
            /> */}
          </label>
        </div>
        <div>
          <p>Name</p>
          <input
            id="name"
            value={profile.name ? profile.name : ""}
            onChange={(e) => {
              if (isEmpty(e.target.value)) {
                setProfile({ ...profile, name: null });
                return false;
              }
              setProfile({ ...profile, name: e.target.value });
            }}
          />
        </div>
        <div>
          <p>Role</p>
          <select
            id="role"
            value={formRole}
            onChange={(e) => {
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
            }}
          >
            <option value="">Choose a role</option>
            <option value="Artist">Artist</option>
            <option value="Art-user">Art-user</option>
            <option value="Artist & Art-user">Artist & Art-user</option>
          </select>
          <br />
        </div>

        <div>
          <br />
          <div style={{ display: "flex" }}>
            {profile.isArtist.boolean === true ? (
              <ArtistForm profile={profile} setProfile={setProfile} />
            ) : null}

            {profile.isArtUser.boolean === true ? (
              <ArtUserForm profile={profile} setProfile={setProfile} />
            ) : null}
          </div>
        </div>

        <div>
          <p>Website url</p>
          <input
            id="name"
            value={profile.websiteUrl ? profile.websiteUrl : ""}
            onChange={(e) => {
              if (isEmpty(e.target.value)) {
                setProfile({ ...profile, websiteUrl: null });
                return false;
              }
              setProfile({ ...profile, websiteUrl: e.target.value });
            }}
          />
          <br />
          <p>Describe yourself</p>
          <textarea
            id="description"
            name="description"
            rows="4"
            cols="50"
            value={profile.description ? profile.description : ""}
            onChange={(e) => {
              if (isEmpty(e.target.value)) {
                setProfile({ ...profile, description: null });
                return false;
              }
              setProfile({ ...profile, description: e.target.value });
            }}
          ></textarea>
        </div>
        <br />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}

export default Form;
