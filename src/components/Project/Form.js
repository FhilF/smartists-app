import React, { useState, useEffect } from "react";
import plusSign from "../../assets/icons/plus.svg";
import { handleCompress, handleCompressPreviewImage } from "../../lib/image";
import { getFileUrl } from "../../lib/media";
import { Profile } from "blockstack";
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
    artistSkills,
    setArtistsSkills,
    persons,
    setPersons,
    other,
    setOther,
    dynamicInput,
    setDynamicInput,
    alert
  } = props;

  const handleRequiredSkill = (e, i) => {
    const newSkills = [...artistSkills];
    newSkills[i].isLookingFor = !newSkills[i].isLookingFor;
    setArtistsSkills([...newSkills]);
  };

  const handleIsLookingFor = (e, i) => {
    const newIsLookingFor = [...persons];
    newIsLookingFor[i].isLookingFor = !newIsLookingFor[i].isLookingFor;
    setPersons([...newIsLookingFor]);
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
    <div className="mt-4">
      <div className="w-full">
        <div className="w-full lg:w-3/4 h-80">
          <div className="h-full w-full">
            {tempMediaUrls ? (
              <>
                <div
                  className="h-full w-full bg-cover bg-center border-gray-400 border border-solid"
                  style={{
                    backgroundImage: `url(${tempMediaUrls})`,
                    borderRadius: "16px",
                  }}
                ></div>
              </>
            ) : (
              <div className="h-full w-full line border-dashed border-2 border-gray-300">
                <input
                  className="input-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                  onChange={async (e) => {
                    setIsCompressing(true);
                    handleMediaInputChange(e);
                  }}
                  disabled={formLoading}
                />
                <label htmlFor="raised-button-file">
                  <img
                    src={plusSign}
                    alt="upload"
                    className="h-full w-full p-28 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-3/4 bb mt-4">
          <StandardInput
            className=""
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
            className="mt-2"
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
            className="mt-2"
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

          <div id="artist-skills" className="mt-2">
            <p className="input-label text-gray-600">
              For this project I am looking for creative partners or
              collaborators with the following skills:
              <span className="required">*</span>
            </p>
            <div className="mt-2">
              {artistSkills.map((skill, index) => {
                return (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={"skills-" + index}
                      name="artistSkills"
                      value={skill.value}
                      checked={skill.isLookingFor}
                      disabled={formLoading}
                      onChange={(e) => {
                        handleRequiredSkill(e, index);
                      }}
                    />
                    <label
                      htmlFor={"skills" + index}
                      className="text-gray-800 text-sm font-semibold ml-2"
                    >
                      {skill.value}
                    </label>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>

          <div id="audience-advice" className="mt-4">
            <input
              type="radio"
              id="audienceAdvice"
              name="audienceAdviceOption"
              value="Yes"
              checked={project.isListeningForAdvice}
              onChange={(e) => {}}
              onClick={(e) => {
                setProject({
                  ...project,
                  isListeningForAdvice: !project.isListeningForAdvice,
                });
              }}
              disabled={formLoading}
            />
            <label
              htmlFor="audienceAdviceYes"
              className="p-paragraph text-gray-600 ml-2"
            >
              For this project I am open to listen to the audience's advice...
              <span className="required">*</span>
            </label>
            <br />
          </div>

          <div id="looking-for" className="mt-4">
            <p className="input-label text-gray-600">
              For this project I am also looking for...
              <span className="required">*</span>
            </p>
            <div className="mt-2">
              {persons.map((person, index) => {
                return (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={"person" + index}
                      name="person"
                      value={person.value}
                      onChange={(e) => {
                        handleIsLookingFor(e, index);
                      }}
                      disabled={formLoading}
                    />
                    <label
                      htmlFor={"person" + index}
                      className="text-gray-800 text-sm font-semibold ml-2"
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
                  onChange={(e) => {
                    setOther(!other);
                  }}
                  disabled={formLoading}
                />
                <label
                  htmlFor={"person4"}
                  className="text-gray-800 text-sm font-semibold ml-2"
                >
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
      </div>
    </div>
  );
}

export default Form;
