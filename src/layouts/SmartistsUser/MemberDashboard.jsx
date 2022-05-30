import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import {
  useNavigate,
  useLocation,
  useParams,
  useMatch,
} from "react-router-dom";
import classNames from "classnames";

import { isEmpty } from "lodash";
import { ReactComponent as UploadCoverIcon } from "assets/svg-icon/UploadCoverIcon.svg";
import { ReactComponent as CheckIcon } from "assets/svg-icon/CheckIcon.svg";
import { ReactComponent as PencilIcon } from "assets/svg-icon/PencilIcon.svg";
import { ReactComponent as TrashIcon } from "assets/svg-icon/TrashIcon.svg";
import { ReactComponent as ExternalLinkIcon } from "assets/svg-icon/ExternalLinkIcon.svg";
import Button from "customComponents/Button";

import placeHolder from "assets/images/avatar-placeholder.png";

import WelcomeModal from "components/WelcomeModal";
import AddressModal from "components/AddressModal";
import { SUPPORTED_IMAGE_FORMATS } from "utils/constant";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { apiServer } from "config";
import { updateSmartistsUserSession } from "utils/redux/slice/userSessionSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  addFileToStorage,
  deleteFileFromStorage,
} from "utils/stacks-util/storage";

function Dashboard(props) {
  const {
    children,
    signedInSmartistsUser,
    smartistsUserData,
    isSessionedUser,
    setSmartistsUserData,
    setSignedInSmartistsUser,
    isMainnet,
  } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const alert = useAlert();
  const [cover, setCover] = useState(
    !isEmpty(smartistsUserData) && smartistsUserData.coverPictureURL
      ? smartistsUserData.coverPictureURL
      : null
  );
  const uploadImageOptions = {
    maxSizeMB: 4.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const [isLoading, setisLoading] = useState(true);

  const [isUpdatingCover, setIsUpdatingCover] = useState(false);

  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const homeRouteMatch = useMatch(":address/");
  const aboutMeRouteMatch = useMatch(":address/about-me");
  const nftRouteMatch = useMatch(":address/nft");
  const studioRouteMatch = useMatch(":address/studio/*");

  // console.log(homeRouteMatch)

  const checkFormat = (fileExt, formats) => {
    if (!formats.includes(fileExt)) {
      return false;
    }
    return true;
  };

  const deleteCover = async () => {
    setIsUpdatingCover(true);
    if (cover) {
      const fileName = cover.substring(cover.indexOf("smartists/CoverImage"));
      await deleteFileFromStorage(fileName);

      const updateSmartistsUser = await axios.put(
        `${apiServer}/smartistsusers/${
          smartistsUserData[
            isMainnet ? "walletAddress" : "walletAddressTestnet"
          ]
        }`,
        { coverPictureURL: null }
      );

      const newSmartistsUser = updateSmartistsUser.data.SmartistsUser;

      let userSessionStorage = sessionStorage.getItem("SmartistsUser");
      userSessionStorage = JSON.parse(userSessionStorage);
      userSessionStorage.SmartistsUser = {
        ...userSessionStorage.SmartistsUser,
        ...newSmartistsUser,
      };
      sessionStorage.setItem(
        "SmartistsUser",
        JSON.stringify(userSessionStorage)
      );
      setSmartistsUserData(userSessionStorage.SmartistsUser);
      setSignedInSmartistsUser(userSessionStorage.SmartistsUser);
      dispatch(updateSmartistsUserSession(userSessionStorage.SmartistsUser));
      sessionStorage.setItem(
        "SmartistsUser",
        JSON.stringify(userSessionStorage)
      );
      alert.success("Successfully updated your info!");

      setIsUpdatingCover(false);
      setCover(null);
    }
  };

  const handleCoverChange = async (e) => {
    setIsUpdatingCover(true);
    try {
      const files = e.target.files;
      if (files.length === 1) {
        const file = files[0];
        const fileExt = file.type.split("/")[1].toLowerCase();
        if (checkFormat(fileExt, SUPPORTED_IMAGE_FORMATS)) {
          if (cover) {
            const fileName = cover.substring(
              cover.indexOf("smartists/CoverImage")
            );
            await deleteFileFromStorage(fileName);
          }
          const compressedImage = await imageCompression(
            file,
            uploadImageOptions
          );
          const res = await addFileToStorage(
            { dir: "smartists/CoverImage" },
            compressedImage,
            {
              encrypt: false,
            }
          );
          const updateSmartistsUser = await axios.put(
            `${apiServer}/smartistsusers/${
              smartistsUserData[
                isMainnet ? "walletAddress" : "walletAddressTestnet"
              ]
            }`,
            { coverPictureURL: res.url }
          );

          const newSmartistsUser = updateSmartistsUser.data.SmartistsUser;

          let userSessionStorage = sessionStorage.getItem("SmartistsUser");
          userSessionStorage = JSON.parse(userSessionStorage);
          userSessionStorage.SmartistsUser = {
            ...userSessionStorage.SmartistsUser,
            ...newSmartistsUser,
          };
          sessionStorage.setItem(
            "SmartistsUser",
            JSON.stringify(userSessionStorage)
          );
          setSmartistsUserData(userSessionStorage.SmartistsUser);
          setSignedInSmartistsUser(userSessionStorage.SmartistsUser);
          dispatch(
            updateSmartistsUserSession(userSessionStorage.SmartistsUser)
          );

          alert.success("Successfully updated your info!");

          setIsUpdatingCover(false);
          setCover(userSessionStorage.SmartistsUser.coverPictureURL);
        } else {
          setIsUpdatingCover(false);
          alert.error("Media file type is not supported!");
        }
      } else {
        e.target.files = null;
      }
    } catch (error) {
      console.log(error);
      alert.error("Error uploading cover image");
      setIsUpdatingCover(false);
    }
  };

  useEffect(() => {
    if (location.state?.showWelcome) {
      setOpenWelcomeModal(true);
      window.history.replaceState({}, document.title);
    }
    setisLoading(false);
  }, []);

  return (
    <>
      {!isLoading && (
        <>
          <div className="px-4 md:px-0">
            <div
              className="h-72 px-4 pt-20 pb-4 bg-studio-placeholder"
              style={{
                backgroundImage: cover ? `url(${cover})` : "",
                backgroundSize: "cover",
              }}
            >
              {isSessionedUser && (
                <>
                  <div
                    className={classNames(
                      "w-full flex flex-col items-center",
                      cover && "invisible"
                    )}
                  >
                    <input
                      disabled={isUpdatingCover}
                      id="cover-upload"
                      name="cover-upload"
                      type="file"
                      className="sr-only"
                      onChange={async (e) => handleCoverChange(e)}
                    />
                    <label htmlFor="cover-upload">
                      <div className="flex flex-col space-y-4 items-center justify-start w-56">
                        <UploadCoverIcon
                          className={classNames(
                            !isUpdatingCover && "cursor-pointer"
                          )}
                        />
                      </div>
                    </label>
                  </div>
                  <div className="flex float-right mt-14">
                    {cover && (
                      <button
                        className={classNames(
                          "inline-flex space-x-2 items-center justify-center w-40 py-2 pl-2.5 pr-3  shadow border rounded-full border-gray-400 ",
                          isUpdatingCover
                            ? "cursor-default"
                            : "cursor-pointer hover:bg-white"
                        )}
                        onClick={() => {
                          deleteCover();
                        }}
                        disabled={isUpdatingCover}
                      >
                        <TrashIcon />
                        <p className="text-sm font-medium leading-none text-red-900">
                          Delete Cover
                        </p>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center">
              <div className="rounded-xl w-full">
                <div>
                  <div className="">
                    <div className="flex box-border py-1">
                      <div className="-mt-8 ml-8" style={{ minWidth: "74px" }}>
                        <div className=" w-40 h-40">
                          <div
                            style={{
                              backgroundImage: `url(${
                                !isEmpty(smartistsUserData) &&
                                smartistsUserData.displayPictureURL
                                  ? smartistsUserData.displayPictureURL
                                  : placeHolder
                              })`,
                            }}
                            className="z-50 h-full w-full rounded-full bg-center bg-cover border-gray-400 border"
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-1 ml-6 mt-2 mr-8">
                        <div className="flex-1">
                          <p className="w-72 text-base leading-normal text-gray-500">
                            {!isEmpty(smartistsUserData)
                              ? smartistsUserData.classification?.isArtist
                                  ?.isTrue
                                ? smartistsUserData.classification?.isArtUser
                                    ?.isTrue
                                  ? `Artist & Art-user - ${smartistsUserData.classification.isArtUser.info.majorInterest}`
                                  : "Artist"
                                : `Art-user - ${smartistsUserData.classification.isArtUser.info.majorInterest}`
                              : null}
                          </p>
                          <p className="w-72 text-xl font-semibold leading-7 text-gray-900">
                            {smartistsUserData.name !== null
                              ? smartistsUserData.name
                              : "Anonymous Person"}
                          </p>
                          <p className="w-72 text-sm leading-normal text-gray-500">
                            {smartistsUserData.username !== null
                              ? `@${smartistsUserData.username}`
                              : "NoUserName"}
                          </p>
                        </div>
                        <div>
                          {!isEmpty(smartistsUserData) && (
                            <>
                              <div>
                                <p className="text-xs leading-normal text-gray-400">
                                  Address
                                </p>
                                <p className="text-sm leading-normal text-gray-400">
                                  {`${smartistsUserData[
                                    isMainnet
                                      ? "walletAddress"
                                      : "walletAddressTestnet"
                                  ].substr(0, 8)}...${smartistsUserData[
                                    isMainnet
                                      ? "walletAddress"
                                      : "walletAddressTestnet"
                                  ].substr(-8)}`}
                                </p>
                              </div>

                              <div className="mt-2">
                                <p
                                  className=" text-red-900 text-sm font-semibold hover:underline cursor-pointer"
                                  onClick={() => {
                                    setOpenAddressModal(true);
                                  }}
                                >
                                  What is this?
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full px-8 mt-2">
                      {/* <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-9 flex flex-col">
                          <div>
                            <p className="text-base leading-normal text-gray-500">
                              {smartistsUserData.description !== null
                                ? smartistsUserData.description
                                : "This user has no description yet"}
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className="flex-grow">
                <div className="mt-8">
                  {!isEmpty(smartistsUserData) && (
                    <>
                      <ul className="flex">
                        <li
                          className={classNames(
                            "font-medium text-lg ml-8",
                            homeRouteMatch &&
                              "border-red-900 border-solid  border-b-4"
                          )}
                        >
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                `/${
                                  smartistsUserData[
                                    isMainnet
                                      ? "walletAddress"
                                      : "walletAddressTestnet"
                                  ]
                                }`
                              );
                            }}
                            href={`/${
                              smartistsUserData[
                                isMainnet
                                  ? "walletAddress"
                                  : "walletAddressTestnet"
                              ]
                            }`}
                          >
                            Home
                          </a>
                        </li>
                        <li
                          className={classNames(
                            "font-medium text-lg ml-8 ",
                            aboutMeRouteMatch &&
                              "border-red-900 border-solid  border-b-4"
                          )}
                        >
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                `/${
                                  smartistsUserData[
                                    isMainnet
                                      ? "walletAddress"
                                      : "walletAddressTestnet"
                                  ]
                                }/about-me`
                              );
                            }}
                            href={`/${
                              smartistsUserData[
                                isMainnet
                                  ? "walletAddress"
                                  : "walletAddressTestnet"
                              ]
                            }/about-me`}
                          >
                            About Me
                          </a>
                        </li>
                        {smartistsUserData.classification.isArtist.isTrue ? (
                          <li
                            className={classNames(
                              "font-medium text-lg ml-8 ",
                              studioRouteMatch &&
                                "border-red-900 border-solid  border-b-4"
                            )}
                          >
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(
                                  `/${
                                    smartistsUserData[
                                      isMainnet
                                        ? "walletAddress"
                                        : "walletAddressTestnet"
                                    ]
                                  }/studio/featured-work`
                                );
                              }}
                              href={`/${
                                smartistsUserData[
                                  isMainnet
                                    ? "walletAddress"
                                    : "walletAddressTestnet"
                                ]
                              }/studio`}
                            >
                              Studio
                            </a>
                          </li>
                        ) : (
                          <li
                            className={classNames(
                              "font-medium text-lg ml-6 ",
                              nftRouteMatch &&
                                "border-red-900 border-solid  border-b-4"
                            )}
                          >
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(
                                  `/${
                                    smartistsUserData[
                                      isMainnet
                                        ? "walletAddress"
                                        : "walletAddressTestnet"
                                    ]
                                  }/nft`
                                );
                              }}
                              href={`/${
                                smartistsUserData[
                                  isMainnet
                                    ? "walletAddress"
                                    : "walletAddressTestnet"
                                ]
                              }/nft`}
                            >
                              NFT
                            </a>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
                <div>{children}</div>
              </div>
            </div>
          </div>
          <WelcomeModal open={openWelcomeModal} setOpen={setOpenWelcomeModal} />
          <AddressModal open={openAddressModal} setOpen={setOpenAddressModal} />
        </>
      )}
    </>
  );
}

export default Dashboard;
