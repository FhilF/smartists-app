import React from "react";

import imagePlaceHolder from "assets/images/mountain-placeholder.jpg";
import { truncate } from "lib/data";
import { useNavigate, useLocation } from "react-router-dom";
import { defineFeaturedProject } from "utils/redux/slice/smartistsUserSlice";
import { useSelector, useDispatch } from "react-redux";


function FeaturedProject(props) {
  const { project, isSessionedUser, smartistsUserData } = props;

  const projectDesc = truncate(project.description, 120);
  const projectTitle = truncate(project.title, 40);
  const projectTagline = truncate(project.title, 65);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const smartistsUserDataClone = structuredClone(smartistsUserData);
  let newFeaturedProject = {
    ...project,
    Studio: {
      studioName: smartistsUserDataClone.Studio.studioName,
      id: smartistsUserDataClone.Studio.id,
      SmartistsUser: {
        classification: smartistsUserDataClone.classification,
        displayPictureURL: smartistsUserDataClone.displayPictureURL,
        name: smartistsUserDataClone.name,
        walletAddress: smartistsUserDataClone.walletAddress,
        walletAddressTestnet: smartistsUserDataClone.walletAddressTestnet,
      },
    },
  };

  return (
    <div
      className="bg-white card rounded-xl cursor-pointer"
      onClick={(e) => {
        // setViewUserProject({ index: index, data: project });
        dispatch(defineFeaturedProject(newFeaturedProject));
        navigate(`${project.id}`);
      }}
    >
      <div className="relative">
        <div>
          <div
            className="w-full h-72 bg-center bg-cover rounded-t-xl"
            style={{
              backgroundImage: `url(${
                project.media.fileUrl ? project.media.fileUrl : imagePlaceHolder
              })`,
            }}
          ></div>
          <div className="p-4" style={{ minHeight: "100px" }}>
            <p className="text-xl font-medium leading-7 text-gray-800">
              {projectTitle}
            </p>
            <p className="font-normal text-xs text-gray-400 mt-1">
              {projectTagline}
            </p>
            <p className="text-sm leading-normal text-gray-600">
              {projectDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProject;
