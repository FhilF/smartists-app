import React from "react";

import imagePlaceHolder from "../../assets/images/mountain-placeholder.jpg";
import Button from "../../customComponents/Button";

import { truncate } from "../../lib/data";
import { MdDelete, MdEdit } from "react-icons/md";
import IconButton from "../../customComponents/IconButton";

function FeaturedProject(props) {
  const { project, isUser, handlePreview, index, handleModalOpen } = props;
  const proj = isUser ? project.attrs : project;

  const projDesc = truncate(proj.description, 205);
  const projTitle = truncate(proj.title, 40);
  const projTagline = truncate(proj.title, 65);

  return (
    <div className="bg-white card mt-4">
      <div className="grid grid-cols-3">
        <div className="border-r border-gray-200">
          <div
            className="w-full h-44 bg-center bg-cover"
            style={{
              backgroundImage: `url(${
                proj.file ? proj.file : imagePlaceHolder
              })`,
            }}
          ></div>
        </div>
        <div className="col-span-2 px-4 py-2 flex flex-col">
          <div className="">
            <div className="flex items-center">
              <p className="font-semibold text-lg text-gray-800 flex-grow">
                {projTitle}
              </p>
              {isUser && (
                <div>
                  <IconButton
                    color="secondary"
                    onClick={(e) => {
                      handlePreview(index, project);
                    }}
                  >
                    <MdEdit className="svg-icon" />
                  </IconButton>
                </div>
              )}
            </div>

            <p className="font-normal text-xs text-gray-600">{projTagline}</p>
            <p className="font-normal text-sm text-gray-400 mt-2">{projDesc}</p>
          </div>
          <div className="flex self-end items-end flex-grow">
            <div>
              <Button
                color="secondary"
                size="small"
                onClick={(e) => {
                  handleModalOpen(project);
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProject;
