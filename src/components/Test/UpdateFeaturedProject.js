import React, { useEffect, useState } from "react";

import {
  handleMediaInputChange,
  handleCompress,
  uploadFile,
} from "../lib/image";
import { isEmpty } from "../lib/data";
import close from "../assets/icons/close.svg";

import { updateFile } from "../lib/image";
import UpdateMultipleIsLookingFor from "./UpdateMultipleIsLookingFor";

import ProjectModel from "../models/Project";
import classNames from "classnames";

const artistSkills = [
  { value: "Writing", status: false, isChecked: false },
  { value: "Visuals", status: false, isChecked: false },
  { value: "Music", status: false, isChecked: false },
  { value: "Performing", status: false, isChecked: false },
  { value: "Digital Editing", status: false, isChecked: false },
];

const persons = [
  { value: "Funding", status: false, isChecked: false, isOtherOption: false },
  { value: "Clients", status: false, isChecked: false, isOtherOption: false },
  {
    value: "Ambassadors / Supporters",
    status: false,
    isChecked: false,
    isOtherOption: false,
  },
];

function UpdateFeaturedProject(props) {
  const { activeAction, setActiveAction, featuredProject, userSession } = props;

  const [showForm, setShowForm] = useState(false);

  const [oldTempImgUrl, setOldTempImgUrl] = useState();
  const [tempCompressedImgUrl, setTempCompressedImgUrl] = useState();
  const [rawImgUrl, setRawImgUrl] = useState();

  const [isCompressing, setIsCompressing] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleModal = (e) => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible" || window.getComputedStyle(x).overflow === "auto") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

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
        var result = data.requiredSkills.filter((a1) => a1.value === x.value);
        if (result.length > 0) {
          x.isChecked = true;
          x.status = result[0].status;
        }
        return x;
      });

      const newIslookingFor = persons.map(function (x) {
        var result = data.isLookingFor.filter((a1) => a1.value === x.value);
        if (result.length > 0) {
          x.isChecked = true;
          x.status = result[0].status;
        }
        return x;
      });

      let newOtherIsLookingFor = data.isLookingFor.filter(function (obj) {
        return !newIslookingFor.some(function (obj2) {
          return obj.value === obj2.value;
        });
      });

      setNewFeaturedProject({
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        requiredSkills: newRequiredSkill,
        isListeningForAdvice: data.isListeningForAdvice,
        isLookingFor: {
          options: [...newIslookingFor],
          otherOptions: [...newOtherIsLookingFor],
        },
        image: data.image,
        status: data.status,
      });

      setOldTempImgUrl(data.image);
    }
  }, [showForm]);

  useEffect(() => {}, [newFeaturedProject]);

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

  function removeByKey(myObj, deleteKey) {
    return Object.keys(myObj)
      .filter((key) => key !== deleteKey)
      .reduce((result, current) => {
        result[current] = myObj[current];
        return result;
      }, {});
  }

  const modifyIsLookingForOther = (isLookingForOtherOptions) => {
    let newLookingFor = [];
    isLookingForOtherOptions.forEach((lookingFor, index) => {
      if (isEmpty(lookingFor.value)) {
        newLookingFor = [...newLookingFor, lookingFor];
      }
    });

    return newLookingFor;
  };

  const handleSubmit = async () => {
    const dataForSubmission = { ...newFeaturedProject };
    let oldSkills = Object.assign([], dataForSubmission.requiredSkills);
    let newSkills = [];
    oldSkills.forEach((el) => {
      if (el.isChecked) {
        newSkills = [...newSkills, removeByKey(el, "isChecked")];
      }
    });

    let oldIsLookingFor = Object.assign(
      [],
      dataForSubmission.isLookingFor.options
    );

    let newIsLookingFor = [];
    oldIsLookingFor.forEach((el) => {
      if (el.isChecked) {
        let filteredEl = removeByKey(el, "isChecked");
        newIsLookingFor = [
          ...newIsLookingFor,
          removeByKey(filteredEl, "isOtherOption"),
        ];
      }
    });

    newIsLookingFor = [
      ...newIsLookingFor,
      ...modifyIsLookingForOther(dataForSubmission.isLookingFor.otherOptions),
    ];

    dataForSubmission.requiredSkills = newSkills;
    dataForSubmission.isLookingFor = newIsLookingFor;

    if (rawImgUrl) {
      const featturedProjectImageForDelete = dataForSubmission.image;
      const result = /[^/]*$/.exec(featturedProjectImageForDelete)[0];
      const file = "smartists/featuredProject/" + result;

      userSession
        .deleteFile(file)
        .then((res) => {
          return handleCompress(rawImgUrl);
        },
        (err) => {
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          if (error.code === "file_not_found") {
            return handleCompress(rawImgUrl);
          } else {
            throw err;
          }
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
            ...dataForSubmission,
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
    } else {
      featuredProject.update({
        ...dataForSubmission,
      });
      featuredProject
        .save()
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
          handleModal(e);
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
                                          value={requiredSkill.value}
                                          checked={requiredSkill.isChecked}
                                          onChange={(e) => {
                                            handleRequiredSkill(index);
                                          }}
                                          disabled={
                                            requiredSkill.status ? true : false
                                          }
                                        />
                                      </td>
                                      <td>{requiredSkill.value}</td>
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
                                          value={el.value}
                                          checked={el.isChecked}
                                          onChange={(e) => {
                                            handleIsLookingFor(index);
                                          }}
                                          disabled={el.status ? true : false}
                                        />
                                      </td>
                                      <td>{el.value}</td>
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
                            </tbody>
                          </table>
                          <UpdateMultipleIsLookingFor
                            newFeaturedProject={newFeaturedProject}
                            setNewFeaturedProject={setNewFeaturedProject}
                          />
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
                          handleModal(e);
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

export default UpdateFeaturedProject;
