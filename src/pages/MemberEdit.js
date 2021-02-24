import React, { Component, useState, useEffect } from "react";
import { useBlockstack } from "react-blockstack";
import placeHolder from "../assets/images/avatar-placeholder.png";
import { v4 as uuidv4 } from "uuid";

import StandardInput from "../customComponents/StandardInput";
import StandardTextArea from "../customComponents/StandardTextArea";
import ButtonDropdown from "../customComponents/ButtonDropdown";

import Button from "../customComponents/Button";

import RoleLabel from "../components/RoleLabelEdit";
import ArtistForm from "../components/ArtistFormEdit";
import ArtUserForm from "../components/ArtUserFormEdit";
import { useAlert } from "react-alert";
import { some, isEmpty, isNil, get, isBoolean } from "lodash";

import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "../utils/constant";

import Loader from "react-loader-spinner";

import imageCompression from "browser-image-compression";

export class MemberEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingMember: true,
      isModifyingMember: false,
      member: [],
      isUser: null,
    };
  }

  componentDidMount() {
    this.setState({ isFetchingMember: true });
    const { match, smartistsUser, history } = this.props;
    if (match.params.username === smartistsUser[0].attrs.username) {
      this.setState({
        isUser: true,
        member: smartistsUser,
        isFetchingMember: false,
      });
    } else {
      history.push(`/member/${match.params.username}`);
    }
  }
  render() {
    const { isFetchingMember, member } = this.state;
    const {setSmartistsUser, history}=this.props;
    return <>{!isFetchingMember ? <Content oldMember={member} setSmartistsUser={setSmartistsUser} history={history}/> : null}</>;
  }
}

function Content(props) {
  const { oldMember,setSmartistsUser, history } = props;
  const { userSession } = useBlockstack();
  const [formLoading, setFormLoading] = useState(false);

  const alert = useAlert();

  const smartistsMemberCopy = Object.assign({}, oldMember[0].attrs);

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

  const roleReference = () => {
    if (
      smartistsMemberCopy.isArtist.boolean &&
      !smartistsMemberCopy.isArtUser.boolean
    ) {
      return "Artist";
    }

    if (
      !smartistsMemberCopy.isArtist.boolean &&
      smartistsMemberCopy.isArtUser.boolean
    ) {
      return "Art-user";
    }
    if (
      smartistsMemberCopy.isArtist.boolean &&
      smartistsMemberCopy.isArtUser.boolean
    ) {
      return "Artist & Art-user";
    }
  };

  const newSkill = artistSkillsReference.map(function (x) {
    var result = smartistsMemberCopy.isArtist.info.skills.filter(
      (a1) => a1 === x.value
    );
    if (result.length > 0) {
      x.isChecked = true;
    }
    return x;
  });

  const newPrimaryInterest = primaryInterestReference.map(function (x) {
    var result = smartistsMemberCopy.isArtUser.info.primaryInterest.filter(
      (a1) => a1 === x.value
    );
    if (result.length > 0) {
      x.isChecked = true;
    }
    return x;
  });

  const [formRole, setFormRole] = useState(roleReference());

  const [profile, setProfile] = useState({
    name: smartistsMemberCopy.name,
    isArtist: {
      ...smartistsMemberCopy.isArtist,
      info: { ...smartistsMemberCopy.isArtist.info, skills: [...newSkill] },
    },
    isArtUser: {
      ...smartistsMemberCopy.isArtUser,
      info: {
        ...smartistsMemberCopy.isArtUser.info,
        primaryInterest: [...newPrimaryInterest],
      },
    },
    displayPicture: smartistsMemberCopy.displayPicture,
    websiteUrl: smartistsMemberCopy.websiteUrl,
    description: smartistsMemberCopy.description,
    email: smartistsMemberCopy.email,
  });

  useEffect(() => {}, [profile]);

  const handleDropDown = (e) => {
    setFormRole(e.target.value);
    if (e.target.value === "Artist") {
      const newInfo = profile.isArtUser.info.primaryInterest.map(function (x) {
        x.isChecked = false;
        return x;
      });
      setProfile({
        ...profile,
        isArtist: {
          boolean: true,
          info: { ...profile.isArtist.info },
        },
        isArtUser: {
          boolean: false,
          info: { majorInterest: null, primaryInterest: [...newInfo] },
        },
      });
    }

    if (e.target.value === "Art-user") {
      const newInfo = profile.isArtist.info.skills.map(function (x) {
        x.isChecked = false;
        return x;
      });
      setProfile({
        ...profile,
        isArtist: {
          boolean: false,
          info: { skills: [...newInfo], openWork: false },
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

    const newSkills = [];
    const newPrimaryInterests = [];

    let newUpdateProfile = Object.assign({}, profile);

    if (newUpdateProfile.isArtist.boolean) {
      const skills = newUpdateProfile.isArtist.info.skills.filter(
        (a1) => a1.isChecked === true
      );
      skills.forEach((el, i) => {
        const x = Object.assign({}, el);
        delete x["isChecked"];
        newSkills.push(x.value);
      });
    }

    if (newUpdateProfile.isArtUser.boolean) {
      const primarySkills = newUpdateProfile.isArtUser.info.primaryInterest.filter(
        (a1) => a1.isChecked === true
      );
      primarySkills.forEach((el, i) => {
        const x = Object.assign({}, el);
        delete x["isChecked"];
        newPrimaryInterests.push(x.value);
      });
    }

    newUpdateProfile = {
      ...newUpdateProfile,
      isArtist: {
        ...newUpdateProfile.isArtist,
        info: { ...newUpdateProfile.isArtist.info, skills: [...newSkills] },
      },
      isArtUser: {
        ...newUpdateProfile.isArtUser,
        info: {
          ...newUpdateProfile.isArtUser.info,
          primaryInterest: [...newPrimaryInterests],
        },
      },
    };

    if (formRole === "" || formRole === null) {
      handleRequiredDetails();
      return true;
    }

    if (newUpdateProfile.isArtUser.boolean) {
      if (
        newUpdateProfile.isArtUser.info.majorInterest === null ||
        newUpdateProfile.isArtUser.info.majorInterest === "" ||
        newUpdateProfile.isArtUser.info.primaryInterest.length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    if (newUpdateProfile.isArtist.boolean) {
      if (
        newUpdateProfile.isArtist.info.openWork === null ||
        newUpdateProfile.isArtist.info.openWork === "" ||
        newUpdateProfile.isArtist.info.skills.length === 0
      ) {
        handleRequiredDetails();
        return true;
      }
    }

    oldMember[0].update({ ...newUpdateProfile });
    oldMember[0]
      .save()
      .then((result) => {
        alert.success("Successfully updated your project");
        // console.log(result)
        // setSmartistsUser(result);
        setFormLoading(false);
        history.push(`/member/${result.attrs.username}`);
      })
      .catch((error) => {
        alert.error(
          "There was a problem submitting the form please try again later!"
        );
        setFormLoading(false);
      });
  };

  const previewImageOptions = {
    maxSizeMB: 7,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
  };

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

  useEffect(() => {
    return () => {
      if (tempImgUrls) {
        window.URL.revokeObjectURL(tempImgUrls);
      }
    };
  }, [tempImgUrls]);
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
                  disabled={true}
                />
                <label htmlFor="raised-button-file" className="h-full">
                  <div className="h-full w-full relative">
                    <div
                      style={{
                        backgroundImage: `url(${
                          tempImgUrls ? tempImgUrls : placeHolder
                        })`,
                      }}
                      className="h-full w-full rounded-full bg-center bg-cover border-gray-400 border"
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
            <div className="mt-8 flex justify-end">
              <Button
                link={`/member/${oldMember[0].attrs.username}`}
              >
                Cancel
              </Button>{" "}
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

export default MemberEdit;
