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
import imagePlaceHolder from "../../assets/images/mountain-placeholder.jpg";
import IconButton from "../../customComponents/IconButton";
import { MdEdit, MdDelete } from "react-icons/md";

import UpdateImageComponent from "./UpdateImage";

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
    setNewMedia,
  } = props;

  const handleRequiredSkill = (e, i) => {
    const newSkills = [...project.requiredSkills];
    newSkills[i].isLookingFor = !newSkills[i].isLookingFor;
    setProject({ ...project, requiredSkills: newSkills });
  };

  const handleIsLookingFor = (e, i) => {
    const newIsLookingFor = [...project.extraUsers];
    newIsLookingFor[i].isLookingFor = !newIsLookingFor[i].isLookingFor;
    setProject({ ...project, extraUsers: newIsLookingFor });
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
              setNewMedia(res.data.rawFile);
              // console.log(res.data.compressedFile)
              setIsCompressing(false);
            } else {
              console.log(res);
              alert.error("There was a problem uploading your image please try again!");
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
            <div className="relative h-full w-full">
              {tempMediaUrls ? (
                <>
                  <div
                    className="h-full w-full bg-cover bg-center border-gray-400 border border-solid"
                    style={{
                      backgroundImage: `url(${tempMediaUrls})`,
                      borderRadius: "16px",
                    }}
                  ></div>
                  <div className="absolute top-1 right-1">
                    <IconButton
                      color="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        setTempMediaUrls(null);
                        setNewMedia(null);
                      }}
                    >
                      <MdDelete className="svg-icon" />
                    </IconButton>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="h-full w-full bg-cover bg-center border-gray-400 border border-solid"
                    style={{
                      backgroundImage: `url(${
                        project.file ? project.file : imagePlaceHolder
                      })`,
                      borderRadius: "16px",
                    }}
                  ></div>
                  <div className="absolute top-1 right-1">
                    <UpdateImageComponent
                      tempMediaUrls={tempMediaUrls}
                      setIsCompressing={setIsCompressing}
                      handleMediaInputChange={handleMediaInputChange}
                      formLoading={formLoading}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-3/4 bb mt-4">
        <StandardInput
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
            For this project I am looking for creative partners or collaborators
            with the following skills:
            <span className="required">*</span>
          </p>
          {project.requiredSkills.map((skill, index) => {
            return (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={"skills-" + index}
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
                  className="text-gray-800 text-sm font-semibold ml-2"
                >
                  {skill.value}
                </label>
                <br />
              </div>
            );
          })}
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
                checked={other}
                disabled={formLoading}
                onChange={(e) => {
                  setOther(!other);
                }}
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
  );
}

export default Form;
