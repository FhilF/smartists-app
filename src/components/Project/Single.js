import React from "react";

import { MdKeyboardBackspace } from "react-icons/md";
import IconButton from "../../customComponents/IconButton";
import imagePlaceHolder from "../../assets/images/mountain-placeholder.jpg";

import DeleteProjectComponent from "./Delete";
import UpdateProjectComponent from "./Update";

function Single(props) {
  const {
    handlePreview,
    viewProject,
    isUser,
    handleDeleteUpdateList,
    userSession,
    handleProjectUpdate,
    index,
    viewProjectCopy,
    setViewProjectCopy,
    isModifyingProject,
  } = props;
  const proj = isUser ? viewProjectCopy.data.attrs : viewProjectCopy.data;
  return (
    <div className="card">
      <div className="p-4 pb-6">
        <div className="mt-4 p-2">
          <div className="flex">
            <div className="flex flex-grow">
              <div>
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    handlePreview(null, {});
                    setViewProjectCopy({ index: null, data: {} });
                  }}
                  disabled={isModifyingProject}
                >
                  <MdKeyboardBackspace className="svg-icon" />
                </IconButton>
              </div>
              <div className="ml-2">
                <p className="font-semibold text-2xl">{proj.title}</p>
                <p className="font-normal text-xs mt-2 text-gray-600">
                  {proj.tagline}
                </p>
              </div>
            </div>
            {isUser ? (
              <div className="flex">
                <DeleteProjectComponent
                  handleDeleteUpdateList={handleDeleteUpdateList}
                  project={viewProject}
                  handlePreview={handlePreview}
                  setViewProjectCopy={setViewProjectCopy}
                  isModifyingProject={isModifyingProject}
                />
                <UpdateProjectComponent
                  userSession={userSession}
                  oldProject={viewProject}
                  handleProjectUpdate={handleProjectUpdate}
                  isModifyingProject={isModifyingProject}
                />
              </div>
            ) : null}
          </div>
          <div className="flex justify-center mt-6">
            <div
              className="w-3/4 h-64 bg-center bg-cover"
              style={{
                backgroundImage: `url(${
                  proj.file ? proj.file : imagePlaceHolder
                })`,
              }}
            ></div>
          </div>
          <p className="font-normal text-sm mt-4 text-gray-400">
            {proj.description}
          </p>
          <div className="mt-4">
            <div className="inline-flex">
              <p className="p-paragraph text-gray-600">
                For this project I am open to listen to the audience's advice:
              </p>
              <p className="p-paragraph text-secondary">
                {proj.isListeningForAdvice ? <>&#10003;</> : <>&#10005;</>}
              </p>
            </div>
            <p className="p-paragraph text-gray-600  mt-2">
              For this project I am looking for creative partners or
              collaborators with the following skills:
            </p>
            <div className="p-paragraph text-gray-800">
              <ul className="mt-1 font-normal text-sm list-disc ml-8">
                {proj.requiredSkills.map((skill, index) => {
                  return <li key={index}>{skill.value}</li>;
                })}
              </ul>
            </div>
            <p className="p-paragraph text-gray-600 mt-2">
              For this project I am also looking for:
            </p>
            <div className="p-paragraph text-gray-800">
              <ul className="mt-1 font-normal text-sm list-disc ml-8">
                {proj.extraUsers.map((skill, index) => {
                  return <li key={index}>{skill.value}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Single;
