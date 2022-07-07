import React, { useEffect, useState } from "react";
import {
  selectSmartistsUser,
  getFeaturedProjectByIdAsync,
} from "utils/redux/slice/smartistsUserSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "customComponents/IconButton";
import imagePlaceHolder from "assets/images/mountain-placeholder.jpg";
import { ReactComponent as ExternalLinkIcon } from "assets/svg-icon/ExternalLinkIcon.svg";
import placeHolder from "assets/images/avatar-placeholder.png";
import { MdKeyboardBackspace } from "react-icons/md";

import AudioPlaceHolder from "assets/images/audio-placeholder.jpg";
import Grid from "customComponents/Grid";
import { isEmpty } from "lodash";
import Update from "./Update";
import Delete from "./components/Delete";
import { isMainnet } from "config";

function View(props) {
  const { smartistsUserSession } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const paramsId = params.id;
  const paramsAddress = params.address;
  const isSessionedUser =
    smartistsUserSession[
      isMainnet ? "walletAddress" : "walletAddressTestnet"
    ] === paramsAddress;
  const featuredProject = useSelector(selectSmartistsUser).featuredProject;
  useEffect(() => {
    if (!featuredProject.data) {
      console.log("test");
      dispatch(getFeaturedProjectByIdAsync({ id: paramsId }));
    }
  }, []);
  return (
    <div>
      {featuredProject.status === "idle" ||
      featuredProject.status === "pending" ? (
        "Loading"
      ) : featuredProject.status === "fulfilled" && featuredProject.data ? (
        <Content
          origfeaturedProject={featuredProject.data}
          navigate={navigate}
          isSessionedUser={isSessionedUser}
        />
      ) : null}
    </div>
  );
}

const Content = (props) => {
  const { origfeaturedProject, navigate, isSessionedUser } = props;
  const [featuredProject, setFeaturedProject] = useState(origfeaturedProject);
  // let requiredSkills = featuredProject.requiredSkills.map(function (e) {
  //   return JSON.parse(e);
  // });
  // let helpers = featuredProject.helpers.map(function (e) {
  //   return JSON.parse(e);
  // });
  return (
    <div className="w-full">
      <Grid className="w-full">
        <div className="flex flex-col col-span-full lg:col-span-5 mt-10">
          <div className="flex">
            <div>
              <IconButton
                size="large"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/${
                      featuredProject.Studio.SmartistsUser[
                        isMainnet ? "walletAddress" : "walletAddressTestnet"
                      ]
                    }/studio/project`
                  );
                }}
              >
                <MdKeyboardBackspace />
              </IconButton>
            </div>
            <div className="flex flex-grow">
              <div className="ml-2">
                <p className=" text-base font-medium  mt-0.5">Back to studio</p>
              </div>
            </div>
          </div>
          <div
            className="inline-flex space-x-6 items-end justify-start mt-16"
            style={{ width: 398, height: 78 }}
          >
            <img
              className="w-1/5 h-full shadow rounded-full"
              src={
                featuredProject.Studio.SmartistsUser.displayPictureURL
                  ? featuredProject.Studio.SmartistsUser.displayPictureURL
                  : placeHolder
              }
              alt=""
            />
            <div className="inline-flex flex-col space-y-0.5 items-start justify-start">
              <p className="w-full text-base leading-normal text-gray-500">
                {!isEmpty(featuredProject)
                  ? featuredProject.Studio.SmartistsUser.classification
                      ?.isArtist?.isTrue
                    ? featuredProject.Studio.SmartistsUser.classification
                        ?.isArtUser?.isTrue
                      ? `Artist & Art-user - ${featuredProject.Studio.SmartistsUser.classification.isArtUser.info.majorInterest}`
                      : "Artist"
                    : `Art-user - ${featuredProject.Studio.SmartistsUser.classification.isArtUser.info.majorInterest}`
                  : null}
              </p>
              <p className="w-full text-xl font-semibold leading-7 text-gray-900">
                {featuredProject.Studio.SmartistsUser.name !== null
                  ? featuredProject.Studio.SmartistsUser.name
                  : "Anonymous Person"}
              </p>
              {featuredProject.Studio.SmartistsUser.websiteUrl && (
                <div className="inline-flex space-x-1.5 items-center justify-start">
                  <p className="text-base leading-normal text-red-900">
                    <a
                      href={featuredProject.Studio.SmartistsUser.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base leading-normal text-red-900 display w-full"
                    >
                      {featuredProject.Studio.SmartistsUser.websiteUrl}
                    </a>
                  </p>
                  <ExternalLinkIcon className="" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-0.5 mt-10 bg-gray-100" />

          <div className="mt-10">
            {isSessionedUser ? (
              <div className="flex">
                <div>
                  <Update
                    type="project"
                    oldFeaturedProject={featuredProject}
                    setFeaturedProject={setFeaturedProject}
                  />
                </div>
                <div className="ml-2">
                  <Delete
                    type="project"
                    oldFeaturedProject={featuredProject}
                    setFeaturedProject={setFeaturedProject}
                  />
                </div>
              </div>
            ) : // <ContactButton user={smartistsUserData} />
            null}
          </div>
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7 flex flex-col col-span-full mt-10">
          <div className="inline-flex flex-col items-start justify-start mb-8">
            <div className="inline-flex space-x-2 items-start justify-start">
              <p className="text-base font-medium leading-normal text-red-800">
                Collaboration Project
              </p>
            </div>
            <p className="text-4xl font-medium leading-10 text-gray-800">
              {featuredProject.title}
            </p>
            <div className="mt-6 space-y-2">
              <p className="w-full text-base leading-normal">
                Tagline:{" "}
                <span className="font-medium">{featuredProject.tagline}</span>
              </p>
              <p className="w-full text-base leading-normal">
                Looking for:{" "}
                <span className="font-medium">
                  {featuredProject.requiredSkills
                    .map((skill) => skill.value)
                    .join(", ")}
                </span>
              </p>
              <p className="w-full text-base leading-normal">
                Also looking for:{" "}
                <span className="font-medium">
                  {featuredProject.helpers
                    .map((extra) => extra.value)
                    .join(", ")}
                </span>
              </p>
              {featuredProject.isListeningForAdvice && (
                <p className="w-full text-base leading-normal text-gray-800 font-medium">
                  Open Collaboration
                </p>
              )}
            </div>
          </div>

          <img
            className="w-full h-auto object-contain max-h-75vh rounded-lg"
            src={featuredProject.media.fileUrl}
            alt="Artwork"
          />
          <p className="font-normal text-base text-gray-600 mt-4 leading-6 mb-20 mt-6">
            {featuredProject.description}
          </p>
        </div>
      </Grid>
    </div>
  );
};

export default View;
