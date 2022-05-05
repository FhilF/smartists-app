import React from "react";

import imagePlaceHolder from "assets/images/mountain-placeholder.jpg";
import AudioPlaceHolder from "assets/images/audio-placeholder.jpg";
// import DeleteFeaturedArtwork from "./Delete";
import Button from "customComponents/Button";

import IconButton from "customComponents/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { defineFeaturedWork } from "utils/redux/slice/smartistsUserSlice";

import { useNavigate, useLocation } from "react-router-dom";
import structuredClone from "@ungap/structured-clone";

function Card(props) {
  const { index, featuredWork, isSessionedUser, smartistsUserData } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const smartistsUserDataClone = structuredClone(smartistsUserData);
  let newFeaturedWork = {
    ...featuredWork,
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

  const getLink = (link) => {
    if (link.includes("https://")) {
      return link;
    }

    if (link.includes("http://")) {
      return link;
    }

    return `https://${link}`;
  };
  return (
    <div
      className="bg-white card rounded-xl cursor-pointer"
      onClick={(e) => {
        if (location.pathname.includes("featured-work")) {
          dispatch(defineFeaturedWork(newFeaturedWork));
          navigate(featuredWork.id);
        } else {
          dispatch(defineFeaturedWork(newFeaturedWork));
          navigate(`featured-work/${featuredWork.id}`);
        }
      }}
    >
      <div className="relative">
        <div>
          {featuredWork.media.fileType === "Image" && (
            <div
              className="w-full h-60 bg-center bg-cover rounded-t-xl"
              style={{ backgroundImage: `url(${featuredWork.media.fileUrl})` }}
            ></div>
          )}

          {featuredWork.media.fileType === "Text" ? (
            featuredWork.media.fileUrl ? (
              <div
                className="w-full h-72 bg-center bg-cover rounded-t-xl"
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
            <div className=" h-72  w-full" style={{ position: "relative" }}>
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
              className="h-72 w-full no-focus-media rounded-t-xl"
              controls
              controlsList="nodownload"
            >
              <source src={featuredWork.media.fileUrl} />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="p-4 pt-4">
            <p className="text-lg font-medium leading-7 text-gray-600">
              {featuredWork.title}
            </p>
            {/* <p className="text-sm leading-normal text-gray-600">
              {featuredWork.description}
            </p> */}
          </div>
        </div>
        {isSessionedUser && (
          <div className="absolute top-3 left-4">
            <div className="inline-flex items-center justify-center px-2.5 py-1.5 bg-gray-100 rounded-2xl">
              <p className="text-xs font-medium leading-none text-center text-gray-800">
                {featuredWork.media.fileType}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
