import React, { useState, useEffect } from "react";

import { useAlert } from "react-alert";

import Dialog from "../../customComponents/Dialog";
import Button from "../../customComponents/Button";
import imagePlaceHolder from "../../assets/images/mountain-placeholder.jpg";


function ViewProject(props) {
  const { handleModal, project, isUser } = props;
  const proj = isUser ? project.attrs : project;
  return (
    <Dialog
      handleClose={handleModal}
      style={{
        marginTop: "10vh",
        marginBottom: "10vw",
      }}
      className="md: max-w-screen-md lg:max-w-screen-md w-full"
    >
      <div className="dialog-content">
        <div>
          <div className="mt-2 p-2">
            <div className="flex">
              <div className="flex flex-grow">
                <div className="ml-2">
                  <p className="font-semibold text-2xl">{proj.title}</p>
                  <p className="font-normal text-xs mt-2 text-gray-600">
                    {proj.tagline}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10">
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
        <div className="dialog-footer mt-20">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleModal();
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default ViewProject;
