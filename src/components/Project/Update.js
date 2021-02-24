import React, { useState, useEffect } from "react";

import { useAlert } from "react-alert";

import Dialog from "../../customComponents/Dialog";
import Button from "../../customComponents/Button";
import IconButton from "../../customComponents/IconButton";
import { ReactComponent as EditIcon } from "../../assets/svg-icon/EditIcon.svg";

import plusSign from "../../assets/icons/plus.svg";
import placeHolderThumb from "../../assets/icons/placeholder-thumb.svg";
import Loader from "react-loader-spinner";

import ProjectModel from "../../models/Project";
import { handleCompress } from "../../lib/image";

import { uploadFile } from "../../lib/media";
import { isEmptyStr, isEmpty } from "../../lib/data";
import { MdEdit } from "react-icons/md";

import Form from "./UpdateForm";
import { deleteMediaFile } from "../../lib/media";

function Update(props) {
  const {
    userSession,
    oldProject,
    handleProjectUpdate,
    isModifyingProject,
  } = props;

  const [formLoading, setFormLoading] = useState(false);
  const [tempMediaUrls, setTempMediaUrls] = useState(null);
  const [newMedia, setNewMedia] = useState(null);
  const [handleDialog, setHandleDialog] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [other, setOther] = useState(false);
  const [dynamicInput, setDynamicInput] = useState([]);

  const [project, setProject] = useState({
    description: null,
    extraUsers: [],
    file: null,
    fileName: null,
    isListeningForAdvice: false,
    requiredSkills: [],
    studioId: null,
    tagline: null,
    title: null,
  });

  const alert = useAlert();
  const handleModal = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    setHandleDialog(!handleDialog);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (!userSession.isUserSignedIn) {
      alert.error("Please sign in to continue");
      userSession.signUserOut();
      setFormLoading(false);
      return null;
    }

    const newUpdateProject = Object.assign({}, project);

    const skills = newUpdateProject.requiredSkills.filter(
      (a1) => a1.isLookingFor === true
    );
    const newSkills = [];
    skills.forEach((el, i) => {
      const x = Object.assign({}, el);
      delete x["isLookingFor"];
      newSkills.push(x);
    });

    const per = newUpdateProject.extraUsers.filter(
      (a1) => a1.isLookingFor === true
    );
    const newPer = [];
    per.forEach((el, i) => {
      const x = Object.assign({}, el);
      delete x["isLookingFor"];
      newPer.push(x);
    });

    if (other) {
      dynamicInput.forEach((el, i) => {
        if (!isEmpty(el.value)) {
          newPer.push(el);
        }
      });
    }

    newUpdateProject["requiredSkills"] = newSkills;
    newUpdateProject["extraUsers"] = newPer;
    delete newUpdateProject["file"];

    if (newMedia) {
      deleteMediaFile(project.fileName)
        .then(
          (res) => {
            return handleCompress(newMedia);
          },
          (err) => {
            let error = JSON.stringify(err);
            error = JSON.parse(error);
            if (error.code === "file_not_found") {
              return handleCompress(newMedia);
            } else {
              throw err;
            }
          }
        )
        .then((result) => {
          if (result.result === "success") {
            setIsCompressing(false);
            return uploadFile(userSession, "smartists", result.data, {
              encrypt: false,
            });
          } else {
            setIsCompressing(false);
            throw result;
          }
        })
        .then((result) => {
          oldProject.data.update({
            ...newUpdateProject,
            fileName: result.fileName,
          });
          return oldProject.data.save();
        })
        .then((res) => {
          console.log(res);

          setFormLoading(false);
          alert.success("Successfully updated your project");
          handleModal();
          handleProjectUpdate(oldProject.index, res);
        })
        .catch((err) => {
          setFormLoading(false);
          console.error(err);
          alert.error("There was a problem submitting your form");
        });
    } else {
      oldProject.data.update({
        ...newUpdateProject,
      });
      oldProject.data
        .save()
        .then((res) => {
          setFormLoading(false);
          console.log(res);
          alert.success("Successfully updated your project");
          handleModal();
          handleProjectUpdate(oldProject.index, res);
        })
        .catch((err) => {
          setFormLoading(false);
          console.error(err);
          alert.error("There was a problem submitting your form");
        });
    }
  };

  useEffect(() => {
    if (handleDialog) {
      const skillReference = [
        { value: "Writing", status: false, isLookingFor: false },
        { value: "Visuals", status: false, isLookingFor: false },
        { value: "Music", status: false, isLookingFor: false },
        { value: "Performing", status: false, isLookingFor: false },
        { value: "Digital Editing", status: false, isLookingFor: false },
      ];

      const personReference = [
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

      const projectCopy = Object.assign({}, oldProject.data);

      const newRequiredSkill = skillReference.map(function (x) {
        var result = projectCopy.attrs.requiredSkills.filter(
          (a1) => a1.value === x.value
        );
        if (result.length > 0) {
          x.isLookingFor = true;
          x.status = result[0].status;
        }
        return x;
      });

      const newExtraUsers = personReference.map(function (x) {
        var result = projectCopy.attrs.extraUsers.filter(
          (a1) => a1.value === x.value
        );
        if (result.length > 0) {
          x.isLookingFor = true;
          x.status = result[0].status;
        }
        return x;
      });

      const newOtherExtraUsers = projectCopy.attrs.extraUsers.filter(function (
        obj
      ) {
        return !newExtraUsers.some(function (obj2) {
          return obj.value === obj2.value;
        });
      });

      if (newOtherExtraUsers.length === 0) {
        setOther(false);
        setDynamicInput([]);
      } else {
        setOther(true);
        setDynamicInput(newOtherExtraUsers);
      }
      setProject({
        description: projectCopy.attrs.description,
        extraUsers: newExtraUsers,
        file: projectCopy.attrs.file,
        fileName: projectCopy.attrs.fileName,
        isListeningForAdvice: projectCopy.attrs.isListeningForAdvice,
        requiredSkills: newRequiredSkill,
        studioId: projectCopy.attrs.studioId,
        tagline: projectCopy.attrs.tagline,
        title: projectCopy.attrs.title,
      });
    }
    return () => {
      if (!handleDialog) {
        setProject({
          description: null,
          extraUsers: [],
          file: null,
          fileName: null,
          isListeningForAdvice: false,
          requiredSkills: [],
          studioId: null,
          tagline: null,
          title: null,
        });

        setOther(false);
        setDynamicInput([]);
        setTempMediaUrls(null);
        setNewMedia(null);
      }
    };
  }, [handleDialog]);

  return (
    <div>
      <IconButton
        size="small"
        color="secondary"
        disabled={isModifyingProject}
        onClick={(e) => {
          e.preventDefault();
          handleModal();
        }}
      >
        <MdEdit className="svg-icon" />
      </IconButton>

      {handleDialog ? (
        <Dialog
          handleClose={handleModal}
          style={{ marginTop: "10vh", marginBottom: "10vw" }}
          className="md: max-w-screen-md lg:max-w-screen-md w-full"
        >
          <div className="dialog-content">
            <div className="dialog-header">
              <h1 className="component-header">Update featured project</h1>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="dialog-body mt-5">
                <Form
                  project={project}
                  setProject={setProject}
                  formLoading={formLoading}
                  setFormLoading={setFormLoading}
                  tempMediaUrls={tempMediaUrls}
                  setTempMediaUrls={setTempMediaUrls}
                  isCompressing={isCompressing}
                  setIsCompressing={setIsCompressing}
                  setNewMedia={setNewMedia}
                  // artistSkills={artistSkills}
                  // setArtistsSkills={setArtistsSkills}
                  // persons={persons}
                  // setPersons={setPersons}
                  dynamicInput={dynamicInput}
                  setDynamicInput={setDynamicInput}
                  other={other}
                  setOther={setOther}
                />
              </div>
              <div className="dialog-footer mt-20">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleModal();
                  }}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
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
            </form>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default Update;
