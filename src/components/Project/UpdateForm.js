import React, { useState, useEffect } from "react";
import plusSign from "../../assets/icons/plus.svg";
import { handleCompress, handleCompressPreviewImage } from "../../lib/image";
import { getFileUrl } from "../../lib/media";
import { Profile } from "blockstack";
import { useAlert } from "react-alert";
import StandardInput from "../../customComponents/StandardInput";
import StandardTextArea from "../../customComponents/StandardTextArea";
import { isEmptyStr } from "../../lib/data";
import ReactPlayer from "react-player";
import AudioPlaceHolder from "../../assets/images/audio-placeholder.jpg";

import AddMultipleIsLookingForComponent from "./AddMultipleIsLookingFor";

import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
  IMAGE_FILE_SIZE_LIMIT,
} from "../../utils/constant";

const checkFormat = (fileExt, formats) => {
  if (!formats.includes(fileExt)) {
    return false;
  }
  return true;
};

function Form(props) {
  const {
    setIsCompressing,
    formLoading,
    setFormLoading,
    tempMediaUrls,
    setTempMediaUrls,
    project,
    setProject,
    other,
    setOther,
    dynamicInput,
    setDynamicInput,
  } = props;

  const handleRequiredSkill = (e, i) => {
    const newSkills = [...project.requiredSkills];
    newSkills[i].isLookingFor = !newSkills[i].isLookingFor;
    setProject({...project, requiredSkills:newSkills});
  };

  const handleIsLookingFor = (e, i) => {
    const newIsLookingFor = [...project.extraUsers];
    newIsLookingFor[i].isLookingFor = !newIsLookingFor[i].isLookingFor;
    setProject({...project, extraUsers:newIsLookingFor});
  };

  const handleIsListeningForAdvice = (e) => {
    let result;
    if (e.target.value === "Yes") {
      result = true;
    } else {
      result = false;
    }

    setProject({
      ...project,
      isListeningForAdvice: result,
    });
  };

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    let file = e.target.files;
    if (file.length === 1) {
      file = file[0];
      const fileExt = file.type.split("/")[1].toLowerCase();
      if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
        handleCompressPreviewImage(file)
          .then((res) => {
            if (res.result === "success") {
              setTempMediaUrls(res.data.compressedFile);
              setProject({
                ...project,
                media: res.data.rawFile,
              });
              // console.log(res.data.compressedFile)
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
      } else {
        e.target.files = null;
        alert.error("Media file type is not supported!");
      }
    } else {
      e.target.files = null;
    }
  };

  return (
    <div>
      <div className="upload-container-root">
        <div className="upload-container-media col-12 col-md-6 col-lg-4">
          {tempMediaUrls ? (
            <>
              <div
                className="uploaded-image-container"
                style={{
                  backgroundImage: `url(${tempMediaUrls})`,
                  borderRadius: "16px",
                }}
              ></div>
            </>
          ) : (
            <>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={async (e) => {
                  setIsCompressing(true);
                  handleMediaInputChange(e);
                }}
              />
              <label htmlFor="raised-button-file">
                <img src={plusSign} alt="upload" />
              </label>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="col-12 col-lg-8">
          <StandardInput
            className="mt-20"
            label="Title"
            id="image-title"
            value={project.title ? project.title : ""}
            onChange={(e) => {
              if (!isEmptyStr(e.target.value)) {
                setProject({ ...project, title: null });
                return false;
              }
              setProject({ ...project, title: e.target.value });
            }}
            autoComplete="off"
            disabled={formLoading}
            required
          />

          <StandardInput
            className="mt-20"
            label="Tagline"
            id="image-title"
            value={project.tagline ? project.tagline : ""}
            onChange={(e) => {
              if (!isEmptyStr(e.target.value)) {
                setProject({ ...project, tagline: null });
                return false;
              }
              setProject({ ...project, tagline: e.target.value });
            }}
            autoComplete="off"
            disabled={formLoading}
            required
          />

          <StandardTextArea
            className="mt-20"
            label="Description"
            id="image-description"
            rows={4}
            value={project.description ? project.description : ""}
            onChange={(e) => {
              if (!isEmptyStr(e.target.value)) {
                setProject({ ...project, description: null });
                return false;
              }
              setProject({ ...project, description: e.target.value });
            }}
            disabled={formLoading}
            required
          />
        </div>

        <div id="artist-skills" className="mt-20">
          <p className="input-label text-gray-600">
            For this project I am looking for creative partners or collaborators
            with the following skills:<span className="required">*</span>
          </p>
          {project.requiredSkills.map((skill, index) => {
            return (
              <div key={index}>
                <input
                  type="checkbox"
                  id={"skills-" + index }
                  name="artistSkills"
                  value={skill.value}
                  checked={skill.isLookingFor}
                  onChange={(e) => {
                    handleRequiredSkill(e, index);
                  }}
                  disabled={formLoading}
                />
                <label
                  htmlFor={"skills" + index}
                  className="p-paragraph text-gray-800"
                >
                  {skill.value}
                </label>
                <br />
              </div>
            );
          })}
        </div>

        <div id="audience-advice">
          <br />
          <input
            type="checkBox"
            id="audienceAdvice"
            name="audienceAdviceOption"
            value="Yes"
            checked={project.isListeningForAdvice}
            onChange={(e) => {
              setProject({...project, isListeningForAdvice:e.target.checked})
            }}
            disabled={formLoading}
          />
          <label
            htmlFor="audienceAdviceYes"
            className="p-paragraph text-gray-600"
          >
            For this project I am open to listen to the audience's advice...<span className="required">*</span>
          </label>
          <br />
        </div>

        <div id="looking-for" className="input-label text-gray-600 mt-20">
          <p>For this project I am also looking for...<span className="required">*</span></p>
          {project.extraUsers.map((person, index) => {
            return (
              <div key={index}>
                <input
                  type="checkbox"
                  id={"person-" + index}
                  name={"person"}
                  value={person.value}
                  checked={person.isLookingFor}
                  onChange={(e) => {
                    handleIsLookingFor(e, index);
                  }}
                  disabled={formLoading}
                />
                <label
                  htmlFor={"person" + index}
                  className="p-paragraph text-gray-800"
                >
                  {person.value}
                </label>
                <br />
              </div>
            );
          })}

          <div>
            <input
              type="checkbox"
              id={"person4"}
              name="person"
              value={other}
              checked={other}
              disabled={formLoading}
              onChange={(e) => {
                setOther(!other);
              }}
            />
            <label htmlFor={"person4"} className="p-paragraph text-gray-800">
              Other
            </label>
            <br />
          </div>

          {other && (
            <AddMultipleIsLookingForComponent
              dynamicInput={dynamicInput}
              setDynamicInput={setDynamicInput}
              formLoading={formLoading}
            />
          )} 
        </div>
      </div>
    </div>
  );
}

export default Form;
