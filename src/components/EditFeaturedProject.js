import React, { useEffect, useState } from "react";

import { handleMediaInputChange, handleCompress, uploadFile } from "../lib/image";
import { isEmpty } from "../lib/data";
import close from "../assets/icons/close.svg";

import { updateFile } from "../lib/image";
import AddMultipleIsLookingForComponent from "./AddMultipleIsLookingFor";

import ProjectModel from "../models/Project";
import classNames from "classnames";

const artistSkills = [
  { skill: "Writing", status: false, isChecked: false },
  { skill: "Visuals", status: false, isChecked: false },
  { skill: "Music", status: false, isChecked: false },
  { skill: "Performing", status: false, isChecked: false },
  { skill: "Digital Editing", status: false, isChecked: false },
];

const persons = [
  { option: "Funding", status: false, isChecked: false, isOtherOption: false },
  { option: "Clients", status: false, isChecked: false, isOtherOption: false },
  {
    option: "Ambassadors / Supporters",
    status: false,
    isChecked: false,
    isOtherOption: false,
  },
];

function EditFeaturedProject(props) {
  const { activeAction, setActiveAction, featuredProject, userSession } = props;

  const [showForm, setShowForm] = useState(false);

  const [oldTempImgUrl, setOldTempImgUrl] = useState();
  const [tempCompressedImgUrl, setTempCompressedImgUrl] = useState();
  const [rawImgUrl, setRawImgUrl] = useState();

  const [isCompressing, setIsCompressing] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleForm = (e) => {
    e.preventDefault(e);
    setActiveAction(!activeAction);
    setShowForm(!showForm);
  };

  const [newFeaturedProject, setNewFeaturedProject] = useState({
    title: null,
    tagline: null,
    description: null,
    requiredSkills: [],
    isListeningForAdvice: false,
    isLookingFor: { options: [], otherOptions: [] },
    image: null,
    status: false,
  });
  useEffect(() => {}, [featuredProject]);

  useEffect(() => {
    if (showForm) {
      const data = { ...featuredProject.attrs };

      const newRequiredSkill = artistSkills.map(function (x) {
        var result = data.requiredSkills.filter((a1) => a1.skill === x.skill);
        if (result.length > 0) {
          x.isChecked = true;
          x.status = result[0].status;
        }
        return x;
      });

      const newIslookingFor = persons.map(function (x) {
        var result = data.isLookingFor.filter((a1) => a1.option === x.option);
        if (result.length > 0) {
          x.isChecked = true;
          x.status = result[0].status;
        }
        return x;
      });

      let newOtherIsLookingFor = data.isLookingFor.filter(function (obj) {
        return !newIslookingFor.some(function (obj2) {
          return obj.option === obj2.option;
        });
      });

      newOtherIsLookingFor.forEach((el) => {
        el.isOtherOption = true;
      });

      setNewFeaturedProject({
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        requiredSkills: newRequiredSkill,
        isListeningForAdvice: data.isListeningForAdvice,
        isLookingFor: {
          options: newIslookingFor,
          otherOptions: newOtherIsLookingFor,
        },
        image: data.image,
        status: data.status,
      });

      setOldTempImgUrl(data.image);
    }
  }, [showForm]);

  useEffect(() => {
    // console.log(newFeaturedProject);
  }, [newFeaturedProject]);

  const handleRequiredSkill = (index) => {
    const newSkills = [...newFeaturedProject.requiredSkills];
    newSkills[index].isChecked = !newSkills[index].isChecked;
    setNewFeaturedProject({
      ...newFeaturedProject,
      requiredSkills: newSkills,
    });
  };

  const handleIsDoneRequiredSkill = (index) => {
    const newSkills = [...newFeaturedProject.requiredSkills];
    newSkills[index].status = !newSkills[index].status;
    setNewFeaturedProject({
      ...newFeaturedProject,
      requiredSkills: newSkills,
    });
  };

  const handleIsListeningForAdvice = (e) => {
    let result;
    if (e.target.value === "Yes") {
      result = true;
    } else {
      result = false;
    }

    setNewFeaturedProject({
      ...newFeaturedProject,
      isListeningForAdvice: result,
    });
  };

  const handleIsLookingFor = (index) => {
    const newIslookingFor = [...newFeaturedProject.isLookingFor.options];
    newIslookingFor[index].isChecked = !newIslookingFor[index].isChecked;
    setNewFeaturedProject({
      ...newFeaturedProject,
      isLookingFor: {
        ...newFeaturedProject.isLookingFor,
        options: newIslookingFor,
      },
    });
  };

  const handleIsDoneLookingFor = (index) => {
    const newIslookingFor = [...newFeaturedProject.isLookingFor.options];
    newIslookingFor[index].status = !newIslookingFor[index].status;
    setNewFeaturedProject({
      ...newFeaturedProject,
      isLookingFor: {
        ...newFeaturedProject.isLookingFor,
        options: newIslookingFor,
      },
    });
  };

  const handleSubmit = async () => {
    const dataForSubmission = { ...newFeaturedProject };
    if (rawImgUrl) {
      const featturedProjectImageForDelete = dataForSubmission.image;
      const result = /[^/]*$/.exec(featturedProjectImageForDelete)[0];
      const file = "smartists/featuredProject/" + result;
      console.log(file);
      console.log(featuredProject)

      userSession
        .deleteFile(file)
        .then((res) => {
          return handleCompress(rawImgUrl);
        })
        .then((res) => {
          if (res.result === "success") {
            setIsCompressing(false);
            return uploadFile(
              userSession,
              "smartists/featuredProject",
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
          featuredProject.update({
            image: res,
          });
          return featuredProject.save();
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div>
      <button
        className="action-button"
        onClick={(e) => {
          handleForm(e);
        }}
      >
        Edit
      </button>
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
                    <h4 style={{ margin: 0 }}>Edit featured project</h4>
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
                                    setTempCompressedImgUrl(
                                      res.data.compressedFile
                                    );
                                    setRawImgUrl(res.data.rawFile);
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
                            <div className="edit-image-container">
                              <div
                                style={{
                                  backgroundImage: `url(${
                                    tempCompressedImgUrl
                                      ? tempCompressedImgUrl
                                      : oldTempImgUrl
                                  })`,
                                  width: "140px",
                                  height: "144px",
                                  cursor: "pointer",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              ></div>
                              {tempCompressedImgUrl ? (
                                <div
                                  className={classNames(
                                    "edit-image-action-container"
                                  )}
                                >
                                  <div className="edit-image-actions">
                                    <div>
                                      <img
                                        className="delete-image-action-button"
                                        alt="close"
                                        src={close}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          setTempCompressedImgUrl(null);
                                          setRawImgUrl(null);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
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
                        <div style={{ display: "flex" }}>
                          <input
                            type="radio"
                            id="project-status"
                            name="project-status"
                            value={true}
                            onClick={(e) => {
                              setNewFeaturedProject({
                                ...newFeaturedProject,
                                status: !newFeaturedProject.status,
                              });
                            }}
                            onChange={(e) => {}}
                            checked={newFeaturedProject.status}
                          />
                          <label htmlFor="project-status">
                            Is project finished?
                          </label>
                        </div>

                        <label htmlFor="project-title">Project Title</label>
                        <input
                          id="project-title"
                          value={
                            newFeaturedProject.title
                              ? newFeaturedProject.title
                              : ""
                          }
                          onChange={(e) => {
                            setNewFeaturedProject({
                              ...newFeaturedProject,
                              title: e.target.value,
                            });
                          }}
                        />

                        <label htmlFor="project-tagline">Project Tagline</label>
                        <input
                          id="project-tagline"
                          value={
                            newFeaturedProject.tagline
                              ? newFeaturedProject.tagline
                              : ""
                          }
                          onChange={(e) => {
                            setNewFeaturedProject({
                              ...newFeaturedProject,
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
                            newFeaturedProject.description
                              ? newFeaturedProject.description
                              : ""
                          }
                          onChange={(e) => {
                            setNewFeaturedProject({
                              ...newFeaturedProject,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>

                        <div id="artist-skills">
                          <p>
                            For this project I am looking for creative partners
                            or collaborators with the following skills:
                          </p>

                          <table>
                            <thead>
                              <tr>
                                <th></th>
                                <th></th>
                                <th>Have you found one?</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newFeaturedProject.requiredSkills.map(
                                (requiredSkill, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          id={"skills" + index}
                                          name="artistSkills"
                                          value={requiredSkill.skill}
                                          checked={requiredSkill.isChecked}
                                          onChange={(e) => {
                                            handleRequiredSkill(index);
                                          }}
                                          disabled={
                                            requiredSkill.status ? true : false
                                          }
                                        />
                                      </td>
                                      <td>{requiredSkill.skill}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <input
                                          type="radio"
                                          id={"found-skill" + index}
                                          name={"found-skill" + index}
                                          value={true}
                                          onClick={(e) => {
                                            handleIsDoneRequiredSkill(index);
                                          }}
                                          onChange={(e) => {}}
                                          checked={requiredSkill.status}
                                          disabled={
                                            !requiredSkill.isChecked
                                              ? true
                                              : false
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div id="audience-advice">
                          <br />
                          <p>
                            For this project I am open to listen to the
                            audience's advice...
                          </p>
                          <input
                            checked={
                              newFeaturedProject.isListeningForAdvice
                                ? true
                                : false
                            }
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
                            checked={
                              !newFeaturedProject.isListeningForAdvice
                                ? true
                                : false
                            }
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
                          <table>
                            <thead>
                              <tr>
                                <th></th>
                                <th></th>
                                <th>Have you found one?</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {newFeaturedProject.isLookingFor.options.map(
                                (el, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          id={"person" + index}
                                          name="person"
                                          value={el.option}
                                          checked={el.isChecked}
                                          onChange={(e) => {
                                            handleIsLookingFor(index);
                                          }}
                                          disabled={el.status ? true : false}
                                        />
                                      </td>
                                      <td>{el.option}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <input
                                          type="radio"
                                          id={"found-person" + index}
                                          name={"found-person" + index}
                                          value={true}
                                          onClick={(e) => {
                                            handleIsDoneLookingFor(index);
                                          }}
                                          onChange={(e) => {}}
                                          checked={el.status}
                                          disabled={
                                            !el.isChecked ? true : false
                                          }
                                        />
                                      </td>
                                      <td></td>
                                    </tr>
                                  );
                                }
                              )}
                              {newFeaturedProject.isLookingFor.otherOptions.map(
                                (el, index) => {
                                  return (
                                    <tr key={index}>
                                      <td></td>
                                      <td>{el.option}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <input
                                          type="radio"
                                          id={"found-person" + index}
                                          name={"found-person" + index}
                                          value={true}
                                          onClick={(e) => {
                                            handleIsDoneLookingFor(index);
                                          }}
                                          onChange={(e) => {}}
                                          checked={el.status}
                                        />
                                      </td>
                                      <td>
                                        <button>Delete</button>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                              {/* {newFeaturedProject.requiredSkills.map(
                                (requiredSkill, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          id={"skills" + index}
                                          name="artistSkills"
                                          value={requiredSkill.skill}
                                          checked={requiredSkill.isChecked}
                                          onChange={(e) => {
                                            handleRequiredSkill(index);
                                          }}
                                          disabled={
                                            requiredSkill.status ? true : false
                                          }
                                        />
                                      </td>
                                      <td>{requiredSkill.skill}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <input
                                          type="radio"
                                          id={"found-skill" + index}
                                          name={"found-skill" + index}
                                          value={true}
                                          onClick={(e) => {
                                            handleIsDoneRequiredSkill(index);
                                          }}
                                          onChange={(e) => {}}
                                          checked={requiredSkill.status}
                                          disabled={
                                            !requiredSkill.isChecked
                                              ? true
                                              : false
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                }
                              )} */}
                            </tbody>
                          </table>
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
                          handleForm(e);
                        }}
                      />
                      <input type="submit" value="Submit" />
                      {/* {isCompressing ? <>loading</> : null} */}
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

export default EditFeaturedProject;
