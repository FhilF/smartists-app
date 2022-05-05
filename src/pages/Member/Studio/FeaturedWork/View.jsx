import React, { useEffect } from "react";
import {
  selectSmartistsUser,
  getFeaturedWorkByIdAsync,
} from "utils/redux/slice/smartistsUserSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "customComponents/IconButton";
import { ReactComponent as ExternalLinkIcon } from "assets/svg-icon/ExternalLinkIcon.svg";
import placeHolder from "assets/images/avatar-placeholder.png";
import { MdKeyboardBackspace } from "react-icons/md";

import AudioPlaceHolder from "assets/images/audio-placeholder.jpg";
// import ModalView from "components/FeaturedWork/View/ViewModal";
import Grid from "customComponents/Grid";
import Delete from "./Delete";

import { isEmpty } from "lodash";
import { isMainnet } from "config";

function View(props) {
  const { smartistsUserSession } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const paramsId = params.id;
  const paramsAddress = params.address;
  const isSessionedUser = smartistsUserSession.walletAddress === paramsAddress;
  const featuredWork = useSelector(selectSmartistsUser).featuredWork;
  useEffect(() => {
    if (!featuredWork.data) {
      dispatch(getFeaturedWorkByIdAsync({ id: paramsId }));
    }
  }, []);

  return (
    <div>
      {featuredWork.status === "idle" || featuredWork.status === "pending" ? (
        "Loading"
      ) : featuredWork.status === "fulfilled" && featuredWork.data ? (
        <Content
          featuredWork={featuredWork.data}
          navigate={navigate}
          isSessionedUser={isSessionedUser}
        />
      ) : null}
    </div>
  );
}

const Content = (props) => {
  const { featuredWork, navigate, isSessionedUser } = props;
  console.log(featuredWork)
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
                    `/${featuredWork.Studio.SmartistsUser[isMainnet ? "walletAddress" : "walletAddressTestnet"]}/studio/featured-work`
                  );
                  // setViewFeaturedWork({
                  //   index: null,
                  //   data: {},
                  // });
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
            className="inline-flex space-x-6 items-end justify-start mt-8"
            style={{ width: 398, height: 78 }}
          >
            <img
              className="w-1/5 h-full shadow rounded-full"
              src={
                featuredWork.Studio.SmartistsUser.displayPicture
                  ? featuredWork.Studio.SmartistsUser.displayPicture
                  : placeHolder
              }
              alt=""
            />
            <div className="inline-flex flex-col space-y-0.5 items-start justify-start">
              <p className="w-full text-base leading-normal text-gray-500">
                {!isEmpty(featuredWork.Studio.SmartistsUser)
                  ? featuredWork.Studio.SmartistsUser.classification?.isArtist
                      ?.isTrue
                    ? featuredWork.Studio.SmartistsUser.classification
                        ?.isArtUser?.isTrue
                      ? `Artist & Art-user - ${featuredWork.Studio.SmartistsUser.classification.isArtUser.info.majorInterest}`
                      : "Artist"
                    : `Art-user - ${featuredWork.Studio.SmartistsUser.classification.isArtUser.info.majorInterest}`
                  : null}
              </p>
              <p className="w-full text-xl font-semibold leading-7 text-gray-900">
                {featuredWork.Studio.SmartistsUser.name !== null
                  ? featuredWork.Studio.SmartistsUser.name
                  : "Anonymous Person"}
              </p>
              {featuredWork.Studio.SmartistsUser.websiteUrl && (
                <div className="inline-flex space-x-1.5 items-center justify-start">
                  <p className="text-base leading-normal text-red-900">
                    <a
                      href={featuredWork.Studio.SmartistsUser.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base leading-normal text-red-900 display w-full"
                    >
                      {featuredWork.Studio.SmartistsUser.websiteUrl}
                    </a>
                  </p>
                  <ExternalLinkIcon className="" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-0.5 mt-10 bg-gray-100" />

          <div className="mt-10">
            {isSessionedUser && <Delete featuredWork={featuredWork} />}
            {/* {isSessionedUser ? (
        <EditButton type="artwork" artworkOrProject={featuredWork} returnToStudioMain={returnToStudioMain} />
      ) : (
        <ContactButton user={featuredWork.Studio.SmartistsUser} />
      )} */}
          </div>
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7 flex flex-col col-span-full mt-10">
          <div className="inline-flex flex-col space-y-2 items-start justify-start mb-8">
            <div className="inline-flex space-x-2 items-start justify-start">
              <p className="text-base font-medium leading-normal text-red-800">
                Artwork
              </p>
              <div className="flex items-center justify-center px-2.5 py-1.5 bg-gray-100 rounded-2xl">
                <p className="text-xs font-medium leading-none text-center text-gray-800">
                  {featuredWork.media.fileType}
                </p>
              </div>
            </div>
            <p className="text-4xl font-medium leading-10 text-gray-800">
              {featuredWork.title}
            </p>
          </div>

          {featuredWork.media.fileType === "Image" && (
            <img
              className="w-full h-auto object-contain max-h-75vh rounded-lg"
              src={featuredWork.media.fileUrl}
              alt="Artwork"
            />
          )}

          {featuredWork.media.fileType === "Text" ? (
            featuredWork.media.fileUrl ? (
              <div
                className="h-72 w-full max-w-md bg-center bg-cover"
                style={{
                  backgroundImage: `url(${featuredWork.media.fileUrl})`,
                }}
              ></div>
            ) : (
              <div className="w-full h-72 bg-center bg-cover rounded-t-xl bg-primary">
                <div className=" h-full flex justify-center items-center">
                  <p className="text-lg text-secondary">No image available</p>
                </div>
              </div>
            )
          ) : null}

          {featuredWork.media.fileType === "Audio" && (
            <div
              className="h-64 w-full max-w-md "
              style={{ position: "relative" }}
            >
              <div
                className="h-full w-full bg-cover bg-center rounded-t-xl"
                style={{
                  backgroundImage: `url(${AudioPlaceHolder})`,
                }}
              ></div>
              <div className="absolute left-0 right-0 top-0 bottom-0">
                <div className="audio-container flex items-end w-full h-full">
                  <audio
                    className="w-full mx-4 h-10 mb-2 no-focus-media"
                    controls
                    controlsList="nodownload"
                  >
                    <source src={featuredWork.media.fileUrl} />
                    Your browser does not support the video tag.
                  </audio>
                </div>
              </div>
            </div>
          )}

          {featuredWork.media.fileType === "Video" && (
            <video
              className="h-64 w-full max-w-md  no-focus-media rounded-t-xl"
              controls
              controlsList="nodownload"
            >
              <source src={featuredWork.media.fileUrl} />
              Your browser does not support the video tag.
            </video>
          )}
          {featuredWork.media.fileType === "Text" && (
            <div className="inline-flex space-x-1.5 items-center justify-start mt-6">
              <p className="text-base leading-normal text-red-900">
                <a
                  href={featuredWork.media.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base leading-normal text-red-900 display w-full"
                >
                  {featuredWork.media.linkUrl}
                </a>
              </p>
              <ExternalLinkIcon className="" />
            </div>
          )}
          <p className="font-normal text-base text-gray-600 leading-6 mb-20 mt-6">
            {featuredWork.description}
          </p>
        </div>
      </Grid>
    </div>
  );
};

export default View;
