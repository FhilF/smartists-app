import React, { useState, useEffect } from "react";

import { useAlert } from "react-alert";

import Dialog from "../../customComponents/Dialog";
import Button from "../../customComponents/Button";
import ButtonDropdown from "../../customComponents/ButtonDropdown";

import plusSign from "../../assets/icons/plus.svg";
import placeHolderThumb from "../../assets/icons/placeholder-thumb.svg";
import Loader from "react-loader-spinner";

import ProjectModel from "../../models/Project";
import { handleCompress } from "../../lib/image";

import { uploadFile } from "../../lib/media";
import { isEmptyStr, isEmpty } from "../../lib/data";

import Form from "./Form";

function AddProject(props) {
  const { userSession, userStudio, handleAdd, isModifyingProject } = props;

  const [formLoading, setFormLoading] = useState(false);
  const [tempMediaUrls, setTempMediaUrls] = useState(null);
  const [handleDialog, setHandleDialog] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [other, setOther] = useState(false);
  const [dynamicInput, setDynamicInput] = useState([]);
  const [artistSkills, setArtistsSkills] = useState([
    { value: "Writing", status: false, isLookingFor: false },
    { value: "Visuals", status: false, isLookingFor: false },
    { value: "Music", status: false, isLookingFor: false },
    { value: "Performing", status: false, isLookingFor: false },
    { value: "Digital Editing", status: false, isLookingFor: false },
  ]);

  const [persons, setPersons] = useState([
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
  ]);

  const [project, setProject] = useState({
    title: null,
    tagline: null,
    description: null,
    isListeningForAdvice: false,
    media: null,
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
      return null;
    }

    const newProject = Object.assign({}, project);

    const skills = artistSkills.filter((a1) => a1.isLookingFor === true);
    const newSkills = [];
    skills.forEach((el, i) => {
      const x = Object.assign({}, el);
      delete x["isLookingFor"];
      newSkills.push(x);
    });

    const per = persons.filter((a1) => a1.isLookingFor === true);
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

    newProject["requiredSkills"] = newSkills;
    newProject["extraUsers"] = newPer;

    handleCompress(newProject.media)
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
        newProject["fileName"] = result.fileName;
        delete newProject["media"];
        const projectModel = new ProjectModel({
          ...newProject,
          studioId: userStudio._id,
        });
        return projectModel.save();
      })
      .then((result) => {
        alert.success("Successfully added your Project!");
        handleModal();
        setFormLoading(false);
        handleAdd(result);
      })
      .catch((error) => {
        console.log(error);
        alert.error("There was a problem submitting your form");
        setTempMediaUrls(null);
      });
  };

  useEffect(() => {
    return () => {
      if (!handleDialog) {
        setArtistsSkills([
          { value: "Writing", status: false, isLookingFor: false },
          { value: "Visuals", status: false, isLookingFor: false },
          { value: "Music", status: false, isLookingFor: false },
          { value: "Performing", status: false, isLookingFor: false },
          { value: "Digital Editing", status: false, isLookingFor: false },
        ]);

        setPersons([
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
        ]);

        setProject({
          title: null,
          tagline: null,
          description: null,
          isListeningForAdvice: false,
          media: null,
        });

        setTempMediaUrls(null);

        setDynamicInput([]);
        setOther(false);
      }
    };
  }, [handleDialog]);
  return (
    <>
      <div style={{ position: "relative" }}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleModal();
          }}
          disabled={formLoading || isModifyingProject}
          color="secondary"
          variant="contained"
        >
          Add
        </Button>
        {isModifyingProject && (
          <Loader
            className="btn-loader"
            type="Oval"
            color="#00BFFF"
            height={25}
            width={25}
          />
        )}
      </div>

      {handleDialog ? (
        <Dialog
          handleClose={handleModal}
          style={{
            marginTop: "10vh",
            marginBottom: "10vw",
          }}
          className="md: max-w-screen-md lg:max-w-screen-md w-full"
          disabled={formLoading}
        >
          <div className="dialog-content">
            <div className="dialog-header">
              <h1 className="component-header">Add featured project</h1>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="dialog-body mt-5">
                <Form
                  project={project}
                  setProject={setProject}
                  formLoading={formLoading}
                  tempMediaUrls={tempMediaUrls}
                  setTempMediaUrls={setTempMediaUrls}
                  isCompressing={isCompressing}
                  setIsCompressing={setIsCompressing}
                  artistSkills={artistSkills}
                  setArtistsSkills={setArtistsSkills}
                  persons={persons}
                  setPersons={setPersons}
                  dynamicInput={dynamicInput}
                  setDynamicInput={setDynamicInput}
                  other={other}
                  setOther={setOther}
                  alert={alert}
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
    </>
  );
}

export default AddProject;
