import React from "react";
import placeHolder from "../assets/images/avatar-placeholder.png";
import { isNil } from "lodash";
import Button from "../customComponents/Button";
import { truncate } from "../lib/data";
import { ReactComponent as CheckIcon } from "../assets/svg-icon/CheckIcon.svg";

export default function SmartistsMemberCard(props) {
  const { smartistsMember, studioLink, navigate, hideVisitStudio, isMainnet } =
    props;
  const skills = smartistsMember.classification?.isArtist?.isTrue
    ? smartistsMember.classification?.isArtist?.info?.skills
        .toString()
        .replaceAll(",", " · ")
    : null;

  const interests = smartistsMember.classification?.isArtUser?.istrue
    ? smartistsMember.classification?.isArtUser?.info?.primaryInterest
        .toString()
        .replaceAll(",", " · ")
    : null;

  const getStyles = () => {
    const styles = {
      width: 392,
      //height: 364,
    };
    return styles;
  };
  return (
    <>
      <div className="px-8 py-6 my-4 bg-white shadow rounded-2xl break-inside">
        <div className="flex items-center">
          <img
            className="flex-none mr-8 w-14 h-14 rounded-full object-cover"
            src={
              smartistsMember.displayPictureUrl
                ? smartistsMember.displayPictureUrl
                : placeHolder
            }
          />
          <div>
            <p className="text-sm leading-normal text-gray-700">
              {smartistsMember.classification?.isArtist?.isTrue
                ? smartistsMember.classification?.isArtUser?.isTrue
                  ? "Artist & Art-user"
                  : "Artist"
                : "Art-user"}
            </p>
            <p className="text-lg font-semibold leading-7 text-gray-900">
              {!isNil(smartistsMember.name)
                ? smartistsMember.name
                : "Anonymous Person"}
            </p>
            <p className="w-72 text-sm leading-normal text-gray-500">
              {smartistsMember.username !== null
                ? `@${smartistsMember.username}`
                : "NoUserName"}
            </p>
            <p className="w-72 text-xs leading-normal text-gray-400">
              {`${smartistsMember[
                isMainnet ? "walletAddress" : "walletAddressTestnet"
              ].substr(0, 8)}...${smartistsMember[
                isMainnet ? "walletAddress" : "walletAddressTestnet"
              ].substr(-8)}`}
            </p>
          </div>
        </div>
        <div className="flex-none items-end mb-4 mt-4">
          <p className="w-full text-base leading-normal text-gray-500 line-clamp-4">
            {smartistsMember.description &&
              truncate(smartistsMember.description, 137)}
          </p>
        </div>
        <div className="w-full flex-none items-end mb-4 mt-4">
          {smartistsMember.classification?.isArtist?.isTrue && (
            <>
              <div className="w-full h-0.5 bg-gray-100" />
              <p className="w-full text-sm leading-normal text-gray-500 mt-2">
                {skills}
              </p>
            </>
          )}
        </div>
        <div className="w-full flex-none items-end ">
          {smartistsMember.classification?.isArtUser?.isTrue && (
            <>
              <div className="w-full h-0.5 bg-gray-100" />
              <p className="w-full text-sm leading-normal text-gray-500 py-1">
                {interests}
              </p>
            </>
          )}
        </div>
        <div className="w-full flex-none items-end ">
          {!hideVisitStudio && (
            <div className="inline-flex space-x-9 items-center justify-between w-full">
              <div className="flex space-x-1.5 items-center justify-start">
                {smartistsMember.classification?.isArtist?.info.openWork && (
                  <p className="text-xs leading-3 text-gray-500">
                    <CheckIcon style={{ display: "inline-block" }} /> Open to
                    work on demand
                  </p>
                )}
              </div>
              {/* <Button
                size="medium"
                variant="outlined"
                color="secondary"
                className={`rounded-2xl ${
                  !smartistsMember.classification?.isArtist?.info.openWork
                    ? " self-end justify-self-end place-self-end "
                    : ""
                }`}
                style={{ borderRadius: "20px" }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/${
                      smartistsMember[
                        isMainnet ? "walletAddress" : "walletAddressTestnet"
                      ]
                    }/${
                      smartistsMember.classification?.isArtist?.isTrue
                        ? "studio"
                        : "nft"
                    }`
                  );
                }}
              >
                <span className="">Visit</span>
              </Button> */}
              <button
                className={`rounded-2xl ${
                  !smartistsMember.classification?.isArtist?.info.openWork
                    ? " self-end justify-self-end place-self-end "
                    : ""
                }`}
                style={{ borderRadius: "20px" }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/${
                      smartistsMember[
                        isMainnet ? "walletAddress" : "walletAddressTestnet"
                      ]
                    }/${
                      smartistsMember.classification?.isArtist?.isTrue
                        ? "studio"
                        : "nft"
                    }`
                  );
                }}
              >
                Visit
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
