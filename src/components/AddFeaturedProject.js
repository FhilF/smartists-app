import React, { useState, useEffect } from "react";
import { handleMediaInputChange, handleCompress } from "../lib/image";
import { isEmpty } from "../lib/data";
import plusSign from "../assets/icons/plus.svg";

import { uploadFile } from "../lib/image";

import ProjectModel from "../models/Project";

function AddFeaturedProject(props) {
  const { userSession, studio } = props;
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [tempImgUrls, setTempImgUrls] = useState();
  const [isCompressing, setIsCompressing] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleForm = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    setShowForm(!showForm);
  };

  const [featuredProject, setFeaturedProject] = useState({
    title: null,
    tagline: null,
    description: null,
    requiredSkills: [],
    isListeningForAdvice: false,
    isLookingFor: [],
    image: null,
  });

  const handleRequiredSkill = (e) => {
    let newSkills = [...featuredProject.requiredSkills, e.target.value];
    if (featuredProject.requiredSkills.includes(e.target.value)) {
      newSkills = newSkills.filter((day) => day !== e.target.value);
    }
    setFeaturedProject({
      ...featuredProject,
      requiredSkills: newSkills,
    });
  };

  const handleIsLookingFor = (e) => {
    let lookingFor = [...featuredProject.isLookingFor, e.target.value];
    if (featuredProject.isLookingFor.includes(e.target.value)) {
      lookingFor = lookingFor.filter((day) => day !== e.target.value);
    }
    setFeaturedProject({
      ...featuredProject,
      isLookingFor: lookingFor,
    });
  };

  const handleIsListeningForAdvice = (e) => {
    let result;
    if (e.target.value === "Yes") {
      result = true;
    } else {
      result = false;
    }

    setFeaturedProject({
      ...featuredProject,
      isListeningForAdvice: result,
    });
  };

  const handleSubmit = async () => {
    setIsFormLoading(true);
    
    if (
      !isEmpty(featuredProject.title) ||
      !isEmpty(featuredProject.tagline) ||
      !isEmpty(featuredProject.description) ||
      !featuredProject.image ||
      featuredProject.requiredSkills.length === 0 ||
      featuredProject.isLookingFor.length === 0
    ) {
      console.log({ result: "error", info: "cannot be empty" });
      setIsFormLoading(false);
      return null;
    }

    handleCompress(featuredProject.image)
      .then((res) => {
        if (res.result === "success") {
          setIsCompressing(false);
          return uploadFile(
            userSession,
            "smartists/featuredArtwork",
            res.data,
            {
              encrypt: false,
            }
          );
        } else {
          setIsCompressing(false);
          throw res;
        }
      })
      .then((res) => {
        featuredProject.image = res;
        const projectModel = new ProjectModel({
          ...featuredProject,
          studioId: studio.attrs._id,
        });
        return projectModel.save();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setIsCompressing(false);
      });
  };

  const artistSkills = [
    "Writing",
    "Visuals",
    "Music",
    "Performing",
    "Digital Editing",
  ];

  const persons = ["Funding", "Clients", "Ambassadors / Supporters", "Other"];
  return (
    <div>
      Add a featured project looking for collaborators
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleForm();
          }}
        >
          Add
        </button>
      </div>
      {showForm ? (
        <div id="modal">
          <div className="modal-backdrop"></div>
          <div className="modal-content">
            <div className="modal-position">
              <div
                className="modal-paper"
                style={{
                  width: "800px",
                }}
              >
                <div style={{ padding: "20px" }}>
                  <div style={{ marginTop: "10px" }}>
                    <h4 style={{ margin: 0 }}>Add featured project</h4>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <div style={{ display: "flex", marginTop: "10px" }}>
                      <div>
                        <div>
                          <input
                            accept="image/*,video/*"
                            style={{ display: "none" }}
                            id="raised-button-file"
                            type="file"
                            onChange={async (e) => {
                              setIsCompressing(true);
                              handleMediaInputChange(e, setIsCompressing)
                                .then((res) => {
                                  if (res.result === "success") {
                                    setTempImgUrls(res.data.compressedFile);
                                    setFeaturedProject({
                                      ...featuredProject,
                                      image: res.data.rawFile,
                                    });
                                    setIsCompressing(false);
                                  } else {
                                    console.log(res);
                                    setIsCompressing(false);
                                  }
                                })
                                .catch((error) => {
                                  console.log();
                                  setIsCompressing(false);
                                });
                            }}
                          />
                          <label htmlFor="raised-button-file">
                            {tempImgUrls ? (
                              <div
                                style={{
                                  backgroundImage: `url(${tempImgUrls})`,
                                  width: "140px",
                                  height: "144px",
                                  cursor: "pointer",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              ></div>
                            ) : (
                              <img
                                src={plusSign}
                                alt="upload"
                                style={{
                                  width: "40px",
                                  padding: "50px",
                                  backgroundColor: "#f5f4f4",
                                }}
                              />
                            )}
                          </label>
                        </div>
                      </div>
                      <div
                        style={{
                          paddingLeft: "10px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="project-title">Project Title</label>
                        <input
                          id="project-title"
                          value={
                            featuredProject.title ? featuredProject.title : ""
                          }
                          onChange={(e) => {
                            setFeaturedProject({
                              ...featuredProject,
                              title: e.target.value,
                            });
                          }}
                        />

                        <label htmlFor="project-tagline">Project Tagline</label>
                        <input
                          id="project-tagline"
                          value={
                            featuredProject.tagline
                              ? featuredProject.tagline
                              : ""
                          }
                          onChange={(e) => {
                            setFeaturedProject({
                              ...featuredProject,
                              tagline: e.target.value,
                            });
                          }}
                        />

                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows="4"
                          cols="50"
                          value={
                            featuredProject.description
                              ? featuredProject.description
                              : ""
                          }
                          onChange={(e) => {
                            setFeaturedProject({
                              ...featuredProject,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>

                        <div id="artist-skills">
                          <p>
                            For this project I am looking for creative partners
                            or collaborators with the following skills:
                          </p>
                          {artistSkills.map((skill, index) => {
                            return (
                              <div key={index}>
                                <input
                                  type="checkbox"
                                  id={"skills" + index}
                                  name="artistSkills"
                                  value={skill}
                                  onChange={(e) => {
                                    handleRequiredSkill(e);
                                  }}
                                />
                                <label htmlFor={"skills" + index}>
                                  {skill}
                                </label>
                                <br />
                              </div>
                            );
                          })}
                        </div>

                        <div id="audience-advice">
                          <br />
                          <p>
                            For this project I am open to listen to the
                            audience's advice...
                          </p>
                          <input
                            type="radio"
                            id="audienceAdviceYes"
                            name="audienceAdviceOption"
                            value="Yes"
                            onChange={(e) => {
                              handleIsListeningForAdvice(e);
                            }}
                          />
                          <label htmlFor="audienceAdviceYes">Yes</label>
                          <br />
                          <input
                            defaultChecked
                            type="radio"
                            id="audienceAdviceNo"
                            name="audienceAdviceOption"
                            value="No"
                            onChange={(e) => {
                              handleIsListeningForAdvice(e);
                            }}
                          />
                          <label htmlFor="workDemandNo">No</label>
                          <br />
                        </div>

                        <div id="looking-for">
                          <p>For this project I am also looking for...</p>
                          {persons.map((person, index) => {
                            return (
                              <div key={index}>
                                <input
                                  type="checkbox"
                                  id={"person" + index}
                                  name="person"
                                  value={person}
                                  onChange={(e) => {
                                    handleIsLookingFor(e);
                                  }}
                                />
                                <label htmlFor={"person" + index}>
                                  {person}
                                </label>
                                <br />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <input
                        type="button"
                        value="Cancel"
                        onClick={(e) => {
                          e.preventDefault();
                          handleForm();
                        }}
                      />
                      <input type="submit" value="Submit" />
                      {isCompressing ? <>loading</> : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AddFeaturedProject;
