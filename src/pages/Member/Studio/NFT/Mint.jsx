import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { BsTrashFill, BsUpload, BsXLg } from "react-icons/bs";
import { SUPPORTED_IMAGE_FORMATS } from "utils/constant";
import axios from "axios";
import {
  apiServer,
  isMainnet,
  smartistsContractAddress,
  StacksNetwork,
} from "config";
import { userSession } from "utils/stacks-util/auth";
import { isEmptyStr, isEmpty } from "lib/data";
import imageCompression from "browser-image-compression";
import { addFileToStorage } from "utils/stacks-util/storage";
import { sha256, sha224 } from "js-sha256";

import {
  publicKeyToAddress,
  getPublicKeyFromPrivate,
} from "@stacks/encryption";

import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  noneCV,
  someCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
  PostConditionMode,
  createSTXPostCondition,
  createNonFungiblePostCondition,
  NonFungibleConditionCode,
} from "@stacks/transactions";

import { openSTXTransfer, openContractCall } from "@stacks/connect";
import { useNavigate } from "react-router-dom";
import { appDetails } from "utils/stacks-util/auth";

import WaitTransactionComponent from "components/WaitTransaction";

// const axios = require("axios");
// const FormData = require("form-data");
// const fs = require('fs')

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 600,
  useWebWorker: true,
};

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

function Mint() {
  const navigate = useNavigate();
  const alert = useAlert();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [fileType, setFileType] = useState("Image");
  const [waitTransaction, setWaitTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  const [savedData, setSavedData] = useState(null);

  const userData = userSession.loadUserData();

  const userWalletAddress =
    userData.profile.stxAddress[isMainnet ? "mainnet" : "testnet"];

  const network = new StacksNetwork();

  const handleMediaInputChange = (e) => {
    e.preventDefault();

    let file = e.target.files;
    if (file.length === 1) {
      file = file[0];
      const fileExt = file.type.split("/")[1].toLowerCase();
      if (fileType === "Image" && !SUPPORTED_IMAGE_FORMATS.includes(fileExt)) {
        e.target.value = null;
        alert.error("Invalid file type");
        return false;
      }
      setMedia(file);
    } else {
      e.target.files = null;
    }
  };

  function getFileSHA256(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        var data = event.target.result;
        const hash = sha256(data);
        resolve(hash);
      };
      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  }

  const uploadTest = async () => {
    setFormLoading(true);
    if (!userSession.isUserSignedIn()) {
      window.location.reload();
      return null;
    }

    if (!isEmptyStr(name) || !isEmptyStr(description) || !media) {
      alert.error("Please fill up the form");
      setFormLoading(false);
      return null;
    }

    const formData = new FormData();
    let metadata = { name, description };
    try {
      let compressedMedia;

      if (!savedData) {
        console.log("No save data");
        if (fileType === "Image") {
          compressedMedia = await imageCompression(media, options);
        } else {
          compressedMedia = media;
        }

        formData.append("mediaFile", compressedMedia);
        const rawMediaHash = await getFileSHA256(media);
        const compressedMediaHash = await getFileSHA256(compressedMedia);
        const fileUpload = await Promise.all([
          addFileToStorage({ dir: "smartists/nft" }, media, {
            encrypt: true,
          }),
          addFileToStorage({ dir: "smartists/nft" }, media, {
            encrypt: true,
          }),
        ]);

        metadata = {
          ...metadata,
          file_mime_type: compressedMedia.type,
          file_hash: rawMediaHash,
          file_name_author_copy: fileUpload[0].fileName,
          file_name_owner_copy: fileUpload[1].fileName,
          image_hash: compressedMediaHash,
          image: null,
          author_address:
            userData.profile.stxAddress[isMainnet ? "mainnet" : "testnet"],
        };

        formData.append("metadata", JSON.stringify(metadata));
        const uploadIPFS = await axios.post(
          `${apiServer}/nft`,
          formData,
          config
        );

        setSavedData({ ipfsHash: uploadIPFS.data.ipfsData.IpfsHash, level });
        setFormLoading(false);

        const transactionOptions = {
          contractAddress: smartistsContractAddress,
          contractName: "genuine-v1",
          functionName: "create-genuine",
          functionArgs: [
            uintCV(level),
            stringAsciiCV(`ipfs://${uploadIPFS.data.ipfsData.IpfsHash}`),
          ],
          network,
          appDetails,
          postConditionMode: PostConditionMode.Deny,
          postConditions: [],
          onFinish: (data) => {
            alert.success(
              "Successfully placed your transaction. Please for a while."
            );
            // navigate(`/${userData.profile.stxAddress.mainnet}/studio/nft`);
            setTransactionId(data.txId);
            setSavedData(null);
            setWaitTransaction(true);
            console.log("Stacks Transaction:", data.stacksTransaction);
            console.log("Transaction ID:", data.txId);
            console.log("Raw transaction:", data.txRaw);
          },
          onCancel: () => {
            setSavedData(null);
            setFormLoading(false);
            console.log("Cancelled");
          },
        };
        await openContractCall(transactionOptions);
      } else {
        console.log("sve data");
        const transactionOptions = {
          contractAddress: smartistsContractAddress,
          contractName: "genuine-v1",
          functionName: "create-genuine",
          functionArgs: [
            uintCV(savedData.level),
            stringAsciiCV(`ipfs://${savedData.ipfsHash}`),
          ],
          network,
          appDetails,
          postConditionMode: PostConditionMode.Deny,
          postConditions: [],
          onFinish: (data) => {
            alert.success(
              "Successfully placed your transaction. Please for a while."
            );
            // navigate(`/${userData.profile.stxAddress.mainnet}/studio/nft`);
            setTransactionId(data.txId);
            setSavedData(null);
            setWaitTransaction(true);
            console.log("Stacks Transaction:", data.stacksTransaction);
            console.log("Transaction ID:", data.txId);
            console.log("Raw transaction:", data.txRaw);
          },
          onCancel: () => {
            setSavedData(null);
            setFormLoading(false);
            console.log("Cancelled");
          },
        };
        await openContractCall(transactionOptions);
      }
    } catch (error) {
      alert.error("There was an error uploading your file");
      setSavedData(null);
      setFormLoading(false);
      console.log(error);
    }
    // try {
    //   await axios.post(`${apiServer}/nft`, formData, config);
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  useEffect(() => {
    let objectUrl;
    if (media) {
      objectUrl = URL.createObjectURL(media);
      setPreviewMedia(objectUrl);
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [media]);

  return (
    <div className="flex-grow w-full flex flex-col p-4 pb-0 md:p-8 lg:p-0 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl mx-auto">
      {!waitTransaction && !transactionId ? (
        <>
          <div className="pt-8">
            <p className="text-4xl font-medium leading-10">Mint NFT</p>
            <p className="text-base leading-normal text-gray-600 mt-6">
              Mint your Genuine NFT.
            </p>
          </div>
          <div className="w-full mt-10">
            <div className="flex justify-center">
              <div className="w-full xl:w-2/5 2xl:px-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    uploadTest();
                  }}
                >
                  <div className="grid gap-6 ">
                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        File Type
                      </p>
                      <select
                        id="name"
                        style={{ paddingTop: "10px", paddingBottom: "10px" }}
                        className="cursor-pointer text-base leading-normal text-gray-500 w-full px-3 bg-white shadow border rounded-md border-gray-300 focus:outline-none focus-visible:border-red-900"
                        onChange={(e) => {
                          setLevel(e.target.value);
                        }}
                      >
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <div className="w-full">
                      {previewMedia && fileType === "Image" ? (
                        <div className="relative">
                          <img
                            src={previewMedia}
                            alt="media"
                            className="rounded-lg"
                          />
                          <BsXLg
                            className="absolute top-4 right-4 cursor-pointer text-red-900 text-2xl"
                            onClick={() => {
                              setMedia(null);
                              setPreviewMedia(null);
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            disabled={formLoading}
                            onChange={async (e) => {
                              handleMediaInputChange(e);
                            }}
                          />
                          <label htmlFor="file-upload">
                            <div className="flex justify-center h-72 px-6 pt-16 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer">
                              <div className="space-y-1 text-center">
                                {/* <UploadIcon className="m-auto" /> */}
                                <BsUpload className="m-auto text-5xl mb-8 text-red-900" />
                                <p className="w-48 text-xl font-medium leading-7 text-center m-auto text-gray-600">
                                  Upload a file
                                </p>
                                <p className="text-xs leading-normal text-center text-gray-400">
                                  Currently supported file types are: JPEG, JPG
                                  and PNG
                                </p>
                              </div>
                            </div>
                          </label>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        Name
                      </p>
                      <input
                        placeholder="Art name"
                        id="name"
                        className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300 focus:outline-none focus-visible:border-red-900"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        autoComplete="off"
                        disabled={formLoading}
                      />
                    </div>

                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        License level
                      </p>
                      <select
                        id="level"
                        style={{ paddingTop: "10px", paddingBottom: "10px" }}
                        className="cursor-pointer text-base leading-normal text-gray-500 w-full px-3 bg-white shadow border rounded-md border-gray-300 focus:outline-none focus-visible:border-red-900"
                        onChange={(e) => {
                          setLevel(parseInt(e.target.value));
                        }}
                      >
                        <option value={1}>Level: 1 - Display</option>
                        <option value={2}>Level: 2 - Display + Copy</option>
                        <option value={3}>
                          Level: 3 - Display + Copy + Adapt
                        </option>
                        <option value={4} disabled className="bg-gray-200">
                          Level: 4 - Display + Copy + Distribute
                        </option>
                        <option value={5} disabled className="bg-gray-200">
                          Level: 5 - Display + Copy + Adapt + Distribute
                        </option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1 items-start justify-start w-full">
                      <p className="text-sm font-medium leading-tight text-gray-700">
                        Description
                      </p>
                      <textarea
                        className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300 focus:outline-none focus-visible:border-red-900"
                        placeholder="Keep it short and simple."
                        id="Art description"
                        rows={5}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        autoComplete="off"
                        disabled={formLoading}
                      />
                    </div>
                    <div className="w-full flex justify-center flex-col mt-8 items-center">
                      <button
                        type="submit"
                        className="w-96 px-1 py-2 shadow rounded-full bg-red-900 disabled:bg-gray-500"
                        disabled={formLoading}
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   console.log("Test");
                        // }}
                      >
                        <p className="text-base font-medium leading-normal  text-white">
                          Mint NFT
                        </p>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(
                            `/${
                              userData.profile.stxAddress[
                                isMainnet ? "mainnet" : "testnet"
                              ]
                            }/studio/nft`
                          );
                        }}
                        className="w-96 px-1 py-2 shadow rounded-full mt-2"
                        disabled={formLoading}
                      >
                        <p className="text-base font-medium leading-normal text-gray-900">
                          Cancel
                        </p>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <WaitTransactionComponent
          transactionId={transactionId}
          navigate={navigate}
          userWalletAddress={userWalletAddress}
        />
      )}
    </div>
  );
}

export default Mint;
