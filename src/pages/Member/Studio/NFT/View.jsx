import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import StxIcon from "assets/images/stx-icon.png";
import {
  BsPlusSquare,
  BsGift,
  BsKey,
  BsDownload,
  BsCheckSquare,
  BsPencilSquare,
  BsXSquare,
} from "react-icons/bs";
import { IoSyncOutline, IoRocketOutline } from "react-icons/io5";
import Grid from "customComponents/Grid";

import {
  smartContractsApi,
  nonFungibleTokensApi,
  smartistsContractAddress,
  accountsApi,
  isMainnet,
  assetIdentifiers,
  StacksNetwork,
  StacksApiUriWs,
  StacksExplorer,
  isMocknet,
  transactionApi,
} from "config";

import {
  uintCV,
  cvToHex,
  deserializeCV,
  cvToString,
  stringAsciiCV,
  PostConditionMode,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  createAssetInfo,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  makeContractNonFungiblePostCondition,
} from "@stacks/transactions";
import { connectWebSocketClient } from "@stacks/blockchain-api-client";
import { sha256, sha224 } from "js-sha256";

import axios from "axios";

import { ReadOnlyFunctionArgsFromJSON } from "@stacks/blockchain-api-client";

import { has, isEmpty, isInteger, set } from "lodash";
import { userSession } from "utils/stacks-util/auth";
import ListModal from "./ListModal";
import WaitTransaction from "components/WaitTransaction";

import { openContractCall } from "@stacks/connect";
import { appDetails } from "utils/stacks-util/auth";
import { useAlert } from "react-alert";
import {
  getPublicKeyFromPrivate,
  publicKeyToAddress,
  decryptContent,
} from "@stacks/encryption";
import { StacksApiUrl } from "config";
import { Oval } from "react-loader-spinner";
import classNames from "classnames";
import { apiServer } from "config";
import {
  addFileToStorage,
  deleteFileFromStorage,
  getFileFromStorage,
} from "utils/stacks-util/storage";
import LicenseModal from "./LicenseModal";

const BigNum = require("bn.js");

function View(props) {
  const { smartistsUserSession, isMainnet } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const alert = useAlert();
  const network = new StacksNetwork();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const id = params.id;
  const assetContractName = params.assetContractName;
  const [isValidAssetIdentifier, setIsValidAssetIdentifier] = useState(true);
  const userData = userSession.loadUserData();
  const [metadata, setMetadata] = useState(null);
  const [waitTransaction, setWaitTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [isListing, setIsListing] = useState(true);
  const walletAddress =
    userData.profile.stxAddress[isMainnet ? "mainnet" : "testnet"];
  const [pendingSaleDetails, setPendingSaleDetails] = useState(null);
  const [isListingPendingTx, setIsListingPendingTx] = useState(false);
  const [isUnlistingPendingTx, setIsUnlistingPendingTx] = useState(false);
  const [isBuyingPendingTx, setIsBuyingPendingTx] = useState(false);
  const [isReleasingPendingTx, setIsReleasingPendingTx] = useState(false);
  const [isLicensingPendingTx, setIsLicensingPendingTx] = useState(false);
  const [licenseDetails, setLicenseDetails] = useState(null);
  const [pendingTx, setPendingTx] = useState();

  useEffect(() => {
    if (assetIdentifiers.some((v) => v.includes(assetContractName))) {
      getGenuineMetadata();
    } else {
      setIsValidAssetIdentifier(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (metadata) {
      getGenuineLicenseDetails();
      if (
        metadata.author !== walletAddress &&
        metadata.owner === walletAddress
      ) {
        getPendingListTx(
          "buy-license-in-ustx",
          setIsLicensingPendingTx,
          updateListingDetails
        );
      }
    }
    if (
      metadata &&
      metadata.listingDetails === "none" &&
      metadata.owner === `${smartistsContractAddress}.${assetContractName}`
    ) {
      getPendingSaleDetails();
      return true;
    }

    if (
      metadata &&
      metadata.listingDetails === "none" &&
      walletAddress === metadata.owner
    ) {
      getPendingListTx(
        "list-in-ustx",
        setIsListingPendingTx,
        updateListingDetails
      );
      return true;
    }

    if (
      metadata &&
      walletAddress === metadata.owner &&
      typeof metadata.listingDetails === "object"
    ) {
      getPendingUnlistAndUpdateTx();
      return true;
    }

    if (
      metadata &&
      walletAddress !== metadata.owner &&
      typeof metadata.listingDetails === "object"
    ) {
      getPendingListTx(
        "buy-in-ustx",
        setIsBuyingPendingTx,
        getGenuineLicenseDetails
      );
      return true;
    }
  }, [metadata]);

  useEffect(() => {
    if (pendingSaleDetails && walletAddress === pendingSaleDetails.owner) {
      getPendingListTx(
        "release-genuine",
        setIsReleasingPendingTx,
        updateListingDetails
      );
    }
  }, [pendingSaleDetails]);

  const updateListingDetails = async () => {
    const listingDetails = await smartContractsApi.callReadOnlyFunction({
      contractAddress: smartistsContractAddress,
      contractName: assetContractName,
      functionName: "get-listing-details",
      readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
        sender: walletAddress,
        arguments: [cvToHex(uintCV(id))],
      }),
    });

    let listingCv = deserializeCV(
      Buffer.from(listingDetails.result.substr(2), "hex")
    );

    const listing =
      "value" in listingCv
        ? {
            owner: cvToString(listingCv.value.data.owner),
            price: cvToString(listingCv.value.data.price).substr(1),
          }
        : cvToString(listingCv);
    setMetadata({ ...metadata, listingDetails: listing });
  };

  const getPendingSaleDetails = async () => {
    try {
      const pendingSaleDetails = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: assetContractName,
        functionName: "get-pending-sale-details",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: walletAddress,
          arguments: [cvToHex(uintCV(id))],
        }),
      });

      let pendingSaleCv = deserializeCV(
        Buffer.from(pendingSaleDetails.result.substr(2), "hex")
      );

      const pendingSale = pendingSaleCv.value
        ? {
            newOwner: cvToString(pendingSaleCv.value.data["new-owner"]),
            owner: cvToString(pendingSaleCv.value.data.owner),
            price: cvToString(pendingSaleCv.value.data.price).substr(1),
          }
        : cvToString(pendingSaleCv);

      setPendingSaleDetails(pendingSale);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePendingSaleDetails = async () => {
    try {
      const listingDetails = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: assetContractName,
        functionName: "get-listing-details",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: walletAddress,
          arguments: [cvToHex(uintCV(id))],
        }),
      });

      const pendingSaleDetails = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: assetContractName,
        functionName: "get-pending-sale-details",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: walletAddress,
          arguments: [cvToHex(uintCV(id))],
        }),
      });

      const ownerDetails = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: assetContractName,
        functionName: "get-owner",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: walletAddress,
          arguments: [cvToHex(uintCV(id))],
        }),
      });

      const ownerCv = deserializeCV(
        Buffer.from(ownerDetails.result.substr(2), "hex")
      );

      let listingCv = deserializeCV(
        Buffer.from(listingDetails.result.substr(2), "hex")
      );

      const listing =
        "value" in listingCv
          ? {
              owner: cvToString(listingCv.value.data.owner),
              price: cvToString(listingCv.value.data.price).substr(1),
            }
          : cvToString(listingCv);

      let pendingSaleCv = deserializeCV(
        Buffer.from(pendingSaleDetails.result.substr(2), "hex")
      );

      const pendingSale = pendingSaleCv.value
        ? {
            newOwner: cvToString(pendingSaleCv.value.data["new-owner"]),
            owner: cvToString(pendingSaleCv.value.data.owner),
            price: cvToString(pendingSaleCv.value.data.price).substr(1),
          }
        : cvToString(pendingSaleCv);

      setMetadata({
        ...metadata,
        listingDetails: listing,
        owner: cvToString(ownerCv.value.value),
      });

      setPendingSaleDetails(pendingSale);
    } catch (error) {
      console.log(error);
    }
  };

  const getMempoolTx = async () => {
    return await transactionApi.getMempoolTransactionList({
      address: `${smartistsContractAddress}.${assetContractName}`,
    });
  };

  const poll = async function (fn, fnCondition, setState, ms) {
    let result = await fn();
    setState(true);
    while (fnCondition(result)) {
      await wait(ms);
      result = await fn();
    }
    return result;
  };

  const wait = function (ms = 5000) {
    console.log("getting transaction");
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  async function trackTransaction(txId, setState, updateFunction) {
    try {
      let fetchReport = () =>
        axios.get(`${StacksApiUrl}/extended/v1/tx/${txId}`);
      let validate = (result) => result.data.tx_status === "pending";
      let response = await poll(fetchReport, validate, setState, 5000);
      setState(false);
      if (updateFunction) {
        await updateFunction();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getPendingListTx = async (functionName, setState, updateFunction) => {
    try {
      const pendingTx = await getMempoolTx();
      const filteredTx = pendingTx.results.filter(
        (tx) =>
          tx.tx_status === "pending" &&
          tx.sender_address === walletAddress &&
          tx.contract_call.function_args !== null &&
          tx.contract_call.function_args.length > 0 &&
          tx.contract_call.function_args[0].name === "genuine-id" &&
          tx.contract_call.function_args[0].repr === cvToString(uintCV(id)) &&
          tx.contract_call.function_name === functionName
      );

      if (filteredTx.length > 0) {
        trackTransaction(filteredTx[0].tx_id, setState, updateFunction);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPendingUnlistAndUpdateTx = async () => {
    try {
      const pendingTx = await getMempoolTx();
      const filteredTx = pendingTx.results.filter(
        (tx) =>
          tx.tx_status === "pending" &&
          tx.sender_address === walletAddress &&
          tx.contract_call.function_args !== null &&
          tx.contract_call.function_args.length > 0 &&
          tx.contract_call.function_args[0].name === "genuine-id" &&
          tx.contract_call.function_args[0].repr === cvToString(uintCV(id)) &&
          (tx.contract_call.function_name === "unlist-in-ustx" ||
            tx.contract_call.function_name === "list-in-ustx")
      );

      if (filteredTx.length > 0) {
        const firstTx = filteredTx.reduce(function (prev, curr) {
          return prev.nonce < curr.nonce ? prev : curr;
        });

        const unlistTx = filteredTx.filter(
          (tx) => tx.contract_call.function_name === "unlist-in-ustx"
        );
        const listTx = filteredTx.filter(
          (tx) => tx.contract_call.function_name === "list-in-ustx"
        );

        if (firstTx.contract_call.function_name === "unlist-in-ustx") {
          if (unlistTx.length > 0) {
            if (listTx.length > 0) {
              setIsListingPendingTx(true);
            }
            trackTransaction(
              unlistTx[0].tx_id,
              setIsUnlistingPendingTx,
              updateListingDetails
            );
          }
        } else {
          if (listTx.length > 0) {
            if (unlistTx.length > 0) {
              setIsUnlistingPendingTx(true);
            }
            trackTransaction(
              listTx[0].tx_id,
              setIsListingPendingTx,
              updateListingDetails
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGenuineMetadata = async () => {
    if (isInteger(parseInt(id))) {
      try {
        const rawMetadata = await smartContractsApi.callReadOnlyFunction({
          contractAddress: smartistsContractAddress,
          contractName: assetContractName,
          functionName: "get-metadata",
          readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
            sender: walletAddress,
            arguments: [cvToHex(uintCV(id))],
          }),
        });

        const listingDetails = await smartContractsApi.callReadOnlyFunction({
          contractAddress: smartistsContractAddress,
          contractName: assetContractName,
          functionName: "get-listing-details",
          readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
            sender: walletAddress,
            arguments: [cvToHex(uintCV(id))],
          }),
        });

        const ownerDetails = await smartContractsApi.callReadOnlyFunction({
          contractAddress: smartistsContractAddress,
          contractName: assetContractName,
          functionName: "get-owner",
          readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
            sender: walletAddress,
            arguments: [cvToHex(uintCV(id))],
          }),
        });

        let metadataCV = deserializeCV(
          Buffer.from(rawMetadata.result.substr(2), "hex")
        );

        let listingCv = deserializeCV(
          Buffer.from(listingDetails.result.substr(2), "hex")
        );

        const ownerCv = deserializeCV(
          Buffer.from(ownerDetails.result.substr(2), "hex")
        );

        const listing =
          "value" in listingCv
            ? {
                owner: cvToString(listingCv.value.data.owner),
                price: cvToString(listingCv.value.data.price).substr(1),
              }
            : cvToString(listingCv);
        metadataCV = metadataCV.value.data;

        let data = {
          id,
          author: cvToString(metadataCV["author"]),
          createdAt: cvToString(metadataCV["created-at"]).substr(1),
          level: parseInt(cvToString(metadataCV["level"]).substr(1)),
          metadataUri: metadataCV["metadata-uri"].data,
          listingDetails: listing,
          owner: cvToString(ownerCv.value.value),
        };

        let NftMetadata = await axios.get(
          `https://smartists.mypinata.cloud/ipfs/${data.metadataUri.replace(
            "ipfs://",
            ""
          )}`
        );

        data = { ...data, ...NftMetadata.data };
        delete data["author_address"];
        setMetadata(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setMetadata(null);
      setIsLoading(false);
      return false;
    }
  };

  const getGenuineLicenseDetails = async () => {
    if (metadata) {
      try {
        const licensingLevelDetails =
          await smartContractsApi.callReadOnlyFunction({
            contractAddress: smartistsContractAddress,
            contractName: assetContractName,
            functionName: "get-license-level-details",
            readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
              sender: walletAddress,
              arguments: [cvToHex(uintCV(metadata.level))],
            }),
          });
        let levelDetailsCv = deserializeCV(
          Buffer.from(licensingLevelDetails.result.substr(2), "hex")
        );
        const levelDetails =
          "value" in levelDetailsCv
            ? {
                level: metadata.level,
                price: parseInt(
                  cvToString(levelDetailsCv.value.data.price).substr(1)
                ),
                rightsGranted: {
                  display: JSON.parse(
                    cvToString(
                      levelDetailsCv.value.data["rights-granted"].data.display
                    )
                  ),
                  copy: JSON.parse(
                    cvToString(
                      levelDetailsCv.value.data["rights-granted"].data.copy
                    )
                  ),
                  adapt: JSON.parse(
                    cvToString(
                      levelDetailsCv.value.data["rights-granted"].data.adapt
                    )
                  ),
                  distribution: JSON.parse(
                    cvToString(
                      levelDetailsCv.value.data["rights-granted"].data
                        .distribution
                    )
                  ),
                },
              }
            : cvToString(levelDetailsCv);

        let licenseDetails;
        if (metadata.author !== walletAddress) {
          const licenseDetailsContractCv =
            await smartContractsApi.callReadOnlyFunction({
              contractAddress: smartistsContractAddress,
              contractName: assetContractName,
              functionName: "get-genuine-license-details",
              readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
                sender: walletAddress,
                arguments: [cvToHex(uintCV(metadata.id))],
              }),
            });

          let licenseDetailsCv = deserializeCV(
            Buffer.from(licenseDetailsContractCv.result.substr(2), "hex")
          );
          licenseDetails =
            "value" in licenseDetailsCv
              ? {
                  author: cvToString(licenseDetailsCv.value.data["author"]),
                  licensee: cvToString(licenseDetailsCv.value.data["licensee"]),
                  createdAt: parseInt(
                    cvToString(
                      licenseDetailsCv.value.data["created-at"]
                    ).substr(1)
                  ),
                  expireAt: parseInt(
                    cvToString(licenseDetailsCv.value.data["expire-at"]).substr(
                      1
                    )
                  ),
                  updatedAt: parseInt(
                    cvToString(
                      licenseDetailsCv.value.data["updated-at"]
                    ).substr(1)
                  ),
                }
              : {};
        }
        setLicenseDetails({ ...levelDetails, ...licenseDetails });
      } catch (error) {
        setLicenseDetails(null);
        console.log(error);
      }
    }
  };

  return (
    <>
      {!isLoading ? (
        isValidAssetIdentifier && metadata ? (
          waitTransaction ? (
            <WaitTransaction
              transactionId={transactionId}
              navigate={navigate}
              userWalletAddress={walletAddress}
              setWaitTransaction={setWaitTransaction}
              setTransactionId={setTransactionId}
            />
          ) : (
            <Content
              metadata={metadata}
              navigate={navigate}
              assetContractName={assetContractName}
              walletAddress={walletAddress}
              waitTransaction={waitTransaction}
              setWaitTransaction={setWaitTransaction}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
              setIsListing={setIsListing}
              isListing={isListing}
              network={network}
              alert={alert}
              userData={userData}
              pendingSaleDetails={pendingSaleDetails}
              isListingPendingTx={isListingPendingTx}
              setIsListingPendingTx={setIsListingPendingTx}
              isUnlistingPendingTx={isUnlistingPendingTx}
              setIsUnlistingPendingTx={setIsUnlistingPendingTx}
              trackTransaction={trackTransaction}
              updateListingDetails={updateListingDetails}
              isBuyingPendingTx={isBuyingPendingTx}
              setIsBuyingPendingTx={setIsBuyingPendingTx}
              updatePendingSaleDetails={updatePendingSaleDetails}
              setIsReleasingPendingTx={setIsReleasingPendingTx}
              isReleasingPendingTx={isReleasingPendingTx}
              isLicensingPendingTx={isLicensingPendingTx}
              setIsLicensingPendingTx={setIsLicensingPendingTx}
              licenseDetails={licenseDetails}
              getGenuineLicenseDetails={getGenuineLicenseDetails}
            />
          )
        ) : (
          <div className="flex justify-center mt-20">
            <div className="text-center">
              <h1 className=" text-4xl font-medium text-gray-700">Error 404</h1>
              <p className="text-sm text-gray-400 mt-4">
                The NFT you're looking does not exist
              </p>
              <div className="flex justify-center mt-8">
                <div className="flex flex-col">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${smartistsUserSession.walletAddress}`);
                    }}
                    className="px-8 py-2 shadow rounded-full mt-2"
                  >
                    <p className="text-base font-medium leading-normal text-gray-900 w-full">
                      Back to dashboard
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}
    </>
  );
}

const Content = (props) => {
  const {
    metadata,
    navigate,
    assetContractName,
    walletAddress,
    setWaitTransaction,
    waitTransaction,
    transactionId,
    setTransactionId,
    setIsListing,
    isListing,
    network,
    alert,
    userData,
    pendingSaleDetails,
    isListingPendingTx,
    setIsListingPendingTx,
    isUnlistingPendingTx,
    setIsUnlistingPendingTx,
    trackTransaction,
    updateListingDetails,
    isBuyingPendingTx,
    setIsBuyingPendingTx,
    updatePendingSaleDetails,
    setIsReleasingPendingTx,
    isReleasingPendingTx,
    isLicensingPendingTx,
    setIsLicensingPendingTx,
    licenseDetails,
    getGenuineLicenseDetails,
  } = props;
  // console.log(metadata);

  const [isListingOpen, setIsListingOpen] = useState(false);
  const [isLicensingOpen, setIsLicensingOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [price, setPrice] = useState("");

  const [isFileVerified, setIsFileVerified] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isBuyingLicense, setIsBuyingLicense] = useState(false);

  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [isProcessingLicensing, setIsProcessingLicensing] = useState(false);

  useEffect(() => {
    const localStorageNFT = localStorage.getItem("memberNftVerifiedFiles");

    if (localStorageNFT) {
      const parsedData = JSON.parse(localStorageNFT);
      if (parsedData.constructor === Array && parsedData.length !== 0) {
        if (
          parsedData.filter(
            (nft) =>
              nft.fileHash === metadata.file_hash &&
              nft.fileName === metadata.file_name_personal_copy
          ).length > 0
        ) {
          setIsFileVerified(true);
        } else {
          setIsFileVerified(false);
        }
      } else {
        setIsFileVerified(false);
      }
    } else {
      setIsFileVerified(false);
    }
  }, []);

  const contractUnlist = async () => {
    const transactionOptions = {
      contractAddress: smartistsContractAddress,
      contractName: assetContractName,
      functionName: "unlist-in-ustx",
      functionArgs: [
        uintCV(parseInt(metadata.id)),
        // level === 0 ? noneCV() : someCV(uintCV(level)),
        // stringAsciiCV(`ipfs://${uploadIPFS.data.ipfsData.IpfsHash}`),
      ],
      network,
      appDetails,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: async (data) => {
        alert.success(
          "Successfully placed your transaction. Please for a while."
        );

        trackTransaction(
          data.txId,
          setIsUnlistingPendingTx,
          updateListingDetails
        );
        setIsListingOpen(false);
        setTransactionId(data.txId);
        setWaitTransaction(true);
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
      onCancel: () => {
        console.log("Cancelled");
      },
    };
    await openContractCall(transactionOptions);
  };

  const contractBuy = async () => {
    const nonFungibleAssetInfo = createAssetInfo(
      smartistsContractAddress,
      assetContractName,
      "Genuine"
    );
    const transactionOptions = {
      contractAddress: smartistsContractAddress,
      contractName: assetContractName,
      functionName: "buy-in-ustx",
      functionArgs: [
        uintCV(parseInt(metadata.id)),
        // stringAsciiCV(getPublicKeyFromPrivate(userData.appPrivateKey)),
        // level === 0 ? noneCV() : someCV(uintCV(level)),
        // stringAsciiCV(`ipfs://${uploadIPFS.data.ipfsData.IpfsHash}`),
      ],
      network,
      appDetails,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardNonFungiblePostCondition(
          metadata.owner,
          NonFungibleConditionCode.DoesNotOwn,
          nonFungibleAssetInfo,
          uintCV(parseInt(metadata.id))
        ),
        makeStandardSTXPostCondition(
          walletAddress,
          FungibleConditionCode.Equal,
          new BigNum(parseInt(metadata.listingDetails.price))
        ),
      ],
      onFinish: (data) => {
        alert.success(
          "Successfully placed your transaction. Please for a while."
        );
        trackTransaction(
          data.txId,
          setIsBuyingPendingTx,
          updatePendingSaleDetails
        );
        // navigate(`/${userData.profile.stxAddress.mainnet}/studio/nft`);
        setIsListingOpen(false);
        setTransactionId(data.txId);
        setWaitTransaction(true);
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
      onCancel: () => {
        console.log("Cancelled");
      },
    };
    await openContractCall(transactionOptions);
  };

  const contractList = async () => {
    if (price !== "") {
      setIsProcessingTransaction(true);
      const transactionOptions = {
        contractAddress: smartistsContractAddress,
        contractName: "genuine-v1",
        functionName: "list-in-ustx",
        functionArgs: [
          uintCV(parseInt(metadata.id)),
          uintCV(parseInt(price * 1000000)),
          // level === 0 ? noneCV() : someCV(uintCV(level)),
          // stringAsciiCV(`ipfs://${uploadIPFS.data.ipfsData.IpfsHash}`),
        ],
        network,
        appDetails,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        onFinish: async (data) => {
          setIsProcessingTransaction(false);
          alert.success(
            "Successfully placed your transaction. Please for a while."
          );

          trackTransaction(
            data.txId,
            setIsListingPendingTx,
            updateListingDetails
          );
          setIsListingOpen(false);
          setTransactionId(data.txId);
          // setIsListingPendingTx(data.txId);
          setWaitTransaction(true);
          console.log("Stacks Transaction:", data.stacksTransaction);
          console.log("Transaction ID:", data.txId);
          console.log("Raw transaction:", data.txRaw);
        },
        onCancel: () => {
          setIsProcessingTransaction(false);
          setFormLoading(false);
          console.log("Cancelled");
        },
      };

      try {
        const checkFile = async () => {
          try {
            const personalCopy = await getFileFromStorage(
              metadata.file_name_personal_copy,
              {
                decrypt: true,
              }
            );
            return personalCopy;
          } catch (error) {
            return null;
          }
        };
        const personalCopy = await checkFile();

        if (
          !personalCopy ||
          !personalCopy.buffer ||
          sha256(personalCopy.buffer) !== metadata.file_hash
        ) {
          console.log("missing from storage");
          const localStorageNFT = localStorage.getItem(
            "memberNftVerifiedFiles"
          );
          let nftList = [];
          if (localStorageNFT) {
            const parsedData = JSON.parse(localStorageNFT);
            if (parsedData.constructor === Array) {
              nftList = [...JSON.parse(localStorageNFT)];
            }
          }

          if (nftList.length !== 0) {
            const verifiedList = nftList.filter(
              (nft) =>
                nft.fileHash !== metadata.file_hash &&
                nft.fileName !== metadata.file_name_personal_copy
            );
            localStorage.setItem(
              "memberNftVerifiedFiles",
              JSON.stringify(verifiedList)
            );
          }

          setIsFileVerified(false);
          setIsProcessingTransaction(false);
          alert.error("Please verify your file");
        } else {
          await openContractCall(transactionOptions);
        }
      } catch (error) {
        console.log(error);
        setIsProcessingTransaction(false);
        setIsFileVerified(false);
        alert.error("There was an error processing your request");
      }
    } else {
      alert.error("Please fill the up the required details!");
    }
  };

  const contractRelease = async () => {
    console.log(pendingSaleDetails);
    console.log(metadata);
    setIsProcessingTransaction(true);
    const nonFungibleAssetInfo = createAssetInfo(
      smartistsContractAddress,
      assetContractName,
      "Genuine"
    );
    const transactionOptions = {
      contractAddress: smartistsContractAddress,
      contractName: assetContractName,
      functionName: "release-genuine",
      functionArgs: [uintCV(parseInt(metadata.id))],
      network,
      appDetails,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeContractNonFungiblePostCondition(
          smartistsContractAddress,
          assetContractName,
          NonFungibleConditionCode.DoesNotOwn,
          nonFungibleAssetInfo,
          uintCV(parseInt(metadata.id))
        ),
      ],
      onFinish: (data) => {
        setIsProcessingTransaction(false);
        alert.success(
          "Successfully placed your transaction. Please for a while."
        );
        // navigate(`/${userData.profile.stxAddress.mainnet}/studio/nft`);
        const localStorageNFT = localStorage.getItem("memberNftVerifiedFiles");
        let nftList = [];
        if (localStorageNFT) {
          const parsedData = JSON.parse(localStorageNFT);
          if (parsedData.constructor === Array) {
            nftList = [...JSON.parse(localStorageNFT)];
          }
        }

        if (nftList.length !== 0) {
          const verifiedList = nftList.filter(
            (nft) =>
              nft.fileHash !== metadata.file_hash &&
              nft.fileName !== metadata.file_name_personal_copy
          );
          localStorage.setItem(
            "memberNftVerifiedFiles",
            JSON.stringify(verifiedList)
          );
        }
        setIsListingOpen(false);
        setTransactionId(data.txId);
        setWaitTransaction(true);
        trackTransaction(
          data.txId,
          setIsReleasingPendingTx,
          updateListingDetails
        );
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
      onCancel: () => {
        setIsProcessingTransaction(false);
        console.log("Cancelled");
      },
    };

    try {
      const checkFile = async () => {
        try {
          const personalCopy = await getFileFromStorage(
            metadata.file_name_personal_copy,
            {
              decrypt: true,
            }
          );
          return personalCopy;
        } catch (error) {
          return null;
        }
      };
      const personalCopy = await checkFile();

      if (
        !personalCopy ||
        !personalCopy.buffer ||
        sha256(personalCopy.buffer) !== metadata.file_hash
      ) {
        console.log("missing from storage");
        const localStorageNFT = localStorage.getItem("memberNftVerifiedFiles");
        let nftList = [];
        if (localStorageNFT) {
          const parsedData = JSON.parse(localStorageNFT);
          if (parsedData.constructor === Array) {
            nftList = [...JSON.parse(localStorageNFT)];
          }
        }

        if (nftList.length !== 0) {
          const verifiedList = nftList.filter(
            (nft) =>
              nft.fileHash !== metadata.file_hash &&
              nft.fileName !== metadata.file_name_personal_copy
          );
          localStorage.setItem(
            "memberNftVerifiedFiles",
            JSON.stringify(verifiedList)
          );
        }
        setIsProcessingTransaction(false);
        setIsFileVerified(false);
        alert.error("Please verify your file");
      } else {
        let newOwnerPublicKey = await axios.get(
          `${apiServer}/smartistsusers/public-key/${pendingSaleDetails.newOwner}`
        );
        newOwnerPublicKey = newOwnerPublicKey.data.SmartistsUser.publicKey;

        await deleteFileFromStorage(metadata.file_name);

        await addFileToStorage(
          { name: metadata.file_name },
          personalCopy.buffer,
          {
            encrypt: newOwnerPublicKey,
          }
        );
        await openContractCall(transactionOptions);
      }
    } catch (error) {
      console.log(error);
      setIsProcessingTransaction(false);
      alert.error("There was an error processing your request");
    }
  };

  const verifyFile = async () => {
    setIsLoadingFile(true);
    const localStorageNFT = localStorage.getItem("memberNftVerifiedFiles");
    let nftList = [];
    console.log(JSON.parse(localStorageNFT));

    if (localStorageNFT) {
      const parsedData = JSON.parse(localStorageNFT);
      if (parsedData.constructor === Array) {
        nftList = [...JSON.parse(localStorageNFT)];
      }
    }

    if (nftList.length !== 0) {
      if (
        nftList.filter(
          (nft) =>
            nft.fileHash === metadata.file_hash &&
            nft.fileName === metadata.file_name_personal_copy
        ).length > 0
      ) {
        setIsFileVerified(true);
        setIsLoadingFile(false);
        alert.info("File already verified");
        return true;
      }
    }

    try {
      const checkFile = async () => {
        try {
          const personalCopy = await getFileFromStorage(
            metadata.file_name_personal_copy,
            {
              decrypt: true,
            }
          );
          return personalCopy;
        } catch (error) {
          return null;
        }
      };

      const personalCopy = await checkFile();
      if (
        personalCopy &&
        personalCopy.buffer &&
        sha256(personalCopy.buffer) === metadata.file_hash
      ) {
        localStorage.setItem(
          "memberNftVerifiedFiles",
          JSON.stringify([
            ...nftList,
            {
              fileName: metadata.file_name_personal_copy,
              fileHash: metadata.file_hash,
              owner: metadata.owner,
              verifiedAt: Date.now(),
            },
          ])
        );
        setIsFileVerified(true);
        setIsLoadingFile(false);
        alert.success("File verified");
        return true;
      }
      const lastOwnerDetails = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: assetContractName,
        functionName: "get-last-owner",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: walletAddress,
          arguments: [cvToHex(uintCV(metadata.id))],
        }),
      });
      let lastOwnerCv = deserializeCV(
        Buffer.from(lastOwnerDetails.result.substr(2), "hex")
      );
      const lastOwnerAddress =
        "value" in lastOwnerCv
          ? cvToString(lastOwnerCv.value)
          : cvToString(lastOwnerCv);
      if (lastOwnerAddress === "none") {
        throw Error("No previous owner");
      }
      let lastOwnerPublicKey = await axios.get(
        `${apiServer}/smartistsusers/public-key/${lastOwnerAddress}`
      );
      lastOwnerPublicKey = lastOwnerPublicKey.data.SmartistsUser.publicKey;
      const gaiaReadUrl = publicKeyToAddress(lastOwnerPublicKey);

      const checkFromLastOwner = async () => {
        try {
          const encryptedFile = await axios.get(
            `https://gaia.blockstack.org/hub/${gaiaReadUrl}/${metadata.file_name}`
          );
          return encryptedFile.data;
        } catch (error) {
          return null;
        }
      };

      const lastOwnerCopy = await checkFromLastOwner();
      if (!lastOwnerCopy) {
        setIsLoadingFile(false);
        alert.error(
          "Last owner did not processed your copy. Please contact the last owner or author to give you a copy"
        );
        return true;
      }
      const content = await decryptContent(JSON.stringify(lastOwnerCopy), {
        privateKey: userData.appPrivateKey,
      });

      if (!content.buffer || sha256(content.buffer) !== metadata.file_hash) {
        setIsLoadingFile(false);
        alert.error(
          "Last owner changed their copy to other copy please report to the admin"
        );
        return true;
      }

      await addFileToStorage(
        { name: metadata.file_name_personal_copy },
        content.buffer,
        {
          encrypt: true,
        }
      );

      await addFileToStorage({ name: metadata.file_name }, content.buffer, {
        encrypt: true,
      });

      localStorage.setItem(
        "memberNftVerifiedFiles",
        JSON.stringify([
          ...nftList,
          {
            fileName: metadata.file_name_personal_copy,
            fileHash: metadata.file_hash,
            owner: metadata.owner,
            verifiedAt: Date.now(),
          },
        ])
      );
      setIsFileVerified(true);
      setIsLoadingFile(false);
      alert.success("File verified and uploaded to your Gaia Storage");
    } catch (error) {
      setIsLoadingFile(false);
      alert.error("There was an error verifying your file");
      console.log(error);
    }
  };

  const downloadFile = async () => {
    setIsLoadingFile(true);

    try {
      const checkFile = async () => {
        try {
          const personalCopy = await getFileFromStorage(
            metadata.file_name_personal_copy,
            {
              decrypt: true,
            }
          );
          return personalCopy;
        } catch (error) {
          return null;
        }
      };
      const personalCopy = await checkFile();
      console.log(personalCopy);

      if (
        !personalCopy ||
        !personalCopy.buffer ||
        sha256(personalCopy.buffer) !== metadata.file_hash
      ) {
        console.log("missing from storage");
        const localStorageNFT = localStorage.getItem("memberNftVerifiedFiles");
        let nftList = [];
        if (localStorageNFT) {
          const parsedData = JSON.parse(localStorageNFT);
          if (parsedData.constructor === Array) {
            nftList = [...JSON.parse(localStorageNFT)];
          }
        }

        if (nftList.length !== 0) {
          const verifiedList = nftList.filter(
            (nft) =>
              nft.fileHash !== metadata.file_hash &&
              nft.fileName !== metadata.file_name_personal_copy
          );
          localStorage.setItem(
            "memberNftVerifiedFiles",
            JSON.stringify(verifiedList)
          );
        }
        setIsLoadingFile(false);
        setIsFileVerified(false);
        alert.error("Please verify your file");
      } else {
        const fileBlob = new Blob([personalCopy.buffer], {
          type: metadata.file_mime_type,
        });
        const url = window.URL.createObjectURL(fileBlob);
        console.log(fileBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          metadata.file_name_personal_copy.replace("smartists/nft/", "")
        );

        // Append to html link element page
        document.body.appendChild(link);

        link.click();
        setIsLoadingFile(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingFile(false);
      setIsFileVerified(false);
      alert.error("Please verify your file");
    }
  };

  const contractBuyLicense = async () => {
    const transactionOptions = {
      contractAddress: smartistsContractAddress,
      contractName: assetContractName,
      functionName: "buy-license-in-ustx",
      functionArgs: [uintCV(parseInt(metadata.id))],
      network,
      appDetails,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          walletAddress,
          FungibleConditionCode.Equal,
          new BigNum(parseInt(licenseDetails.price))
        ),
      ],
      onFinish: (data) => {
        alert.success(
          "Successfully placed your transaction. Please for a while."
        );
        setIsListingOpen(false);
        setTransactionId(data.txId);
        setWaitTransaction(true);
        trackTransaction(
          data.txId,
          setIsLicensingPendingTx,
          getGenuineLicenseDetails
        );
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
      onCancel: () => {
        alert.info("Please verify your file again before transacting");
        console.log("Cancelled");
      },
    };

    try {
      await openContractCall(transactionOptions);
    } catch (error) {
      console.log(error);
      setIsProcessingTransaction(false);
      alert.error("There was an error processing your request");
    }
  };

  useEffect(() => {
    if (licenseDetails) {
      // const test = Object.keys(licenseDetails.rightsGranted).filter(function (key) {
      //   return licenseDetails.rightsGranted[key];
      // });
    }
  }, [licenseDetails]);

  return (
    <div className="w-full">
      <Grid className="w-full mt-16">
        <div className="flex flex-col col-span-full lg:col-span-5">
          <div className="inline-flex space-x-2 items-start justify-start">
            <p className="text-lg font-medium leading-normal text-gray-600 capitalize">
              {assetContractName.replace("-", " ")}
            </p>
            <div className="flex items-center justify-center px-2.5 py-1.5 bg-gray-100 rounded-2xl">
              <p className="text-xs font-medium leading-none text-center text-gray-800">
                {/* {featuredWork.media.fileType} */}
              </p>
            </div>
          </div>
          <p className="text-4xl font-medium leading-10 text-gray-800">
            {`#${metadata.id} - ${metadata.name}`}{" "}
          </p>

          {pendingSaleDetails && (
            <p className="text-base text-gray-600 mt-8">
              Sold for{" "}
              <span className="text-gray-800 font-semibold">
                {pendingSaleDetails.price / 1000000} STX
              </span>
            </p>
          )}
          <p className="text-base text-gray-600 mt-8">
            {metadata.listingDetails === "none" ? (
              metadata.owner ===
              `${smartistsContractAddress}.${assetContractName}` ? (
                pendingSaleDetails &&
                pendingSaleDetails.owner ===
                  walletAddress ? null : pendingSaleDetails &&
                  pendingSaleDetails.newOwner === walletAddress ? (
                  "Your NFT will be sent to you once the owner makes you a copy of the original file of the NFT and releases it"
                ) : (
                  "This NFT is pending for transfer to the new owner"
                )
              ) : (
                "This NFT is not for sale"
              )
            ) : (
              <>
                Listed for{" "}
                <span className="text-gray-800 font-semibold">
                  {metadata.listingDetails.price / 1000000} STX
                </span>
              </>
            )}
          </p>
          <div className="mt-8">
            <ul className="grid gap-2 w-64">
              {metadata.listingDetails === "none" &&
                walletAddress === metadata.owner && (
                  <>
                    <li
                      className={classNames(
                        "p-2 flex items-center",
                        isListingPendingTx || isProcessingTransaction
                          ? "bg-gray-200"
                          : "hover:bg-gray-100 cursor-pointer"
                      )}
                      onClick={() => {
                        if (isListingPendingTx || isProcessingTransaction) {
                          return true;
                        }
                        setIsListing(true);
                        setIsListingOpen(true);
                      }}
                    >
                      <span
                        className={classNames(
                          "text-md",
                          isListingPendingTx || isProcessingTransaction
                            ? "text-gray-400"
                            : "text-red-900"
                        )}
                      >
                        <BsPlusSquare />
                      </span>
                      <span className="ml-4 text-gray-600 font-medium flex-1">
                        {isProcessingTransaction ? (
                          <span className="ml-1">Processing...</span>
                        ) : isListingPendingTx ? (
                          <span className="ml-1">List Pending...</span>
                        ) : (
                          "List"
                        )}
                      </span>
                      <span>
                        {isListingPendingTx || isProcessingTransaction ? (
                          <Oval
                            ariaLabel="loading-indicator"
                            height={24}
                            width={24}
                            strokeWidth={5}
                            strokeWidthSecondary={1}
                            color="blue"
                            secondaryColor="gray"
                            className="mr-8"
                          />
                        ) : null}
                      </span>
                    </li>

                    <li className="p-2 flex items-center bg-gray-200">
                      <span
                        className={classNames(
                          "text-md",
                          true ? "text-gray-400" : "text-red-900"
                        )}
                      >
                        <BsGift />
                      </span>
                      <span className="ml-4 text-gray-600 font-medium flex-1">
                        Transfer
                      </span>
                    </li>
                    {walletAddress !== metadata.author ? (
                      <>
                        {licenseDetails && "expireAt" in licenseDetails ? (
                          <li
                            className={classNames(
                              "p-2 flex items-center",
                              isLicensingPendingTx
                                ? "bg-gray-200"
                                : "hover:bg-gray-100 cursor-pointer"
                            )}
                            onClick={() => {
                              if (isLicensingPendingTx) {
                                return true;
                              }
                              // setIsBuyingLicense(true);
                              // setIsLicensingOpen(true);
                            }}
                          >
                            <span
                              className={classNames(
                                "text-md",
                                isLicensingPendingTx
                                  ? "text-gray-400"
                                  : "text-red-900"
                              )}
                            >
                              <BsKey />
                            </span>
                            <span className="ml-4 text-gray-600 font-medium flex-1">
                              {isLicensingPendingTx
                                ? "Renew License Pending..."
                                : "Renew License"}
                            </span>
                            <span>
                              {isLicensingPendingTx ? (
                                <Oval
                                  ariaLabel="loading-indicator"
                                  height={24}
                                  width={24}
                                  strokeWidth={5}
                                  strokeWidthSecondary={1}
                                  color="blue"
                                  secondaryColor="gray"
                                  className="mr-8"
                                />
                              ) : null}
                            </span>
                          </li>
                        ) : metadata.level === 1 ? null : (
                          <li
                            className={classNames(
                              "p-2 flex items-center",
                              isLicensingPendingTx
                                ? "bg-gray-200"
                                : "hover:bg-gray-100 cursor-pointer"
                            )}
                            onClick={() => {
                              if (isLicensingPendingTx) {
                                return true;
                              }
                              setIsBuyingLicense(true);
                              setIsLicensingOpen(true);
                            }}
                          >
                            <span
                              className={classNames(
                                "text-md",
                                isLicensingPendingTx
                                  ? "text-gray-400"
                                  : "text-red-900"
                              )}
                            >
                              <BsKey />
                            </span>
                            <span className="ml-4 text-gray-600 font-medium flex-1">
                              {isLicensingPendingTx
                                ? "Buy License Pending..."
                                : "Buy License"}
                            </span>
                            <span>
                              {isLicensingPendingTx ? (
                                <Oval
                                  ariaLabel="loading-indicator"
                                  height={24}
                                  width={24}
                                  strokeWidth={5}
                                  strokeWidthSecondary={1}
                                  color="blue"
                                  secondaryColor="gray"
                                  className="mr-8"
                                />
                              ) : null}
                            </span>
                          </li>
                        )}

                        {isFileVerified ? (
                          <li
                            className={classNames(
                              "p-2 flex items-center",
                              isLoadingFile
                                ? "bg-gray-200"
                                : "hover:bg-gray-100 cursor-pointer"
                            )}
                            onClick={() => {
                              if (isLoadingFile) {
                                return true;
                              }
                              downloadFile();
                            }}
                          >
                            <span
                              className={classNames(
                                "text-md",
                                isLoadingFile ? "text-gray-400" : "text-red-900"
                              )}
                            >
                              <BsDownload />
                            </span>
                            <span className="ml-4 text-gray-600 font-medium flex-1">
                              {isLoadingFile
                                ? "Downloading File..."
                                : "Download File"}
                            </span>
                            <span>
                              {isLoadingFile ? (
                                <Oval
                                  ariaLabel="loading-indicator"
                                  height={24}
                                  width={24}
                                  strokeWidth={5}
                                  strokeWidthSecondary={1}
                                  color="blue"
                                  secondaryColor="gray"
                                  className="mr-8"
                                />
                              ) : null}
                            </span>
                          </li>
                        ) : (
                          <li
                            className={classNames(
                              "p-2 flex items-center",
                              isLoadingFile
                                ? "bg-gray-200"
                                : "hover:bg-gray-100 cursor-pointer"
                            )}
                            onClick={() => {
                              if (isLoadingFile) {
                                return true;
                              }
                              verifyFile();
                            }}
                          >
                            <span
                              className={classNames(
                                "text-md",
                                isLoadingFile ? "text-gray-400" : "text-red-900"
                              )}
                            >
                              <BsDownload />
                            </span>
                            <span className="ml-4 text-gray-600 font-medium flex-1">
                              {isLoadingFile
                                ? "Verifying File..."
                                : "Verify File"}
                            </span>
                            <span>
                              {isLoadingFile ? (
                                <Oval
                                  ariaLabel="loading-indicator"
                                  height={24}
                                  width={24}
                                  strokeWidth={5}
                                  strokeWidthSecondary={1}
                                  color="blue"
                                  secondaryColor="gray"
                                  className="mr-8"
                                />
                              ) : null}
                            </span>
                          </li>
                        )}
                      </>
                    ) : (
                      <>
                        <li
                          className={classNames(
                            "p-2 flex items-center",
                            isLoadingFile
                              ? "bg-gray-200"
                              : "hover:bg-gray-100 cursor-pointer"
                          )}
                          onClick={() => {
                            if (isLoadingFile) {
                              return true;
                            }
                            downloadFile();
                          }}
                        >
                          <span
                            className={classNames(
                              "text-md",
                              isLoadingFile ? "text-gray-400" : "text-red-900"
                            )}
                          >
                            <BsDownload />
                          </span>
                          <span className="ml-4 text-gray-600 font-medium flex-1">
                            {isLoadingFile
                              ? "Downloading File..."
                              : "Download File"}
                          </span>
                          <span>
                            {isLoadingFile ? (
                              <Oval
                                ariaLabel="loading-indicator"
                                height={24}
                                width={24}
                                strokeWidth={5}
                                strokeWidthSecondary={1}
                                color="blue"
                                secondaryColor="gray"
                                className="mr-8"
                              />
                            ) : null}
                          </span>
                        </li>
                      </>
                    )}
                  </>
                )}

              {metadata.listingDetails !== "none" &&
                walletAddress === metadata.owner && (
                  <>
                    <li
                      className={classNames(
                        "p-2 flex items-center",
                        isListingPendingTx
                          ? "bg-gray-200"
                          : "hover:bg-gray-100 cursor-pointer"
                      )}
                      onClick={() => {
                        if (isListingPendingTx) {
                          return true;
                        }
                        setIsListing(false);
                        setIsListingOpen(true);
                      }}
                    >
                      <span
                        className={classNames(
                          "text-md",
                          isListingPendingTx ? "text-gray-400" : "text-red-900"
                        )}
                      >
                        <BsPencilSquare />
                      </span>
                      <span className="ml-4 text-gray-600 font-medium flex-1">
                        {isListingPendingTx
                          ? "Update Pending..."
                          : "Update Price"}
                      </span>
                      <span>
                        {isListingPendingTx ? (
                          <Oval
                            ariaLabel="loading-indicator"
                            height={24}
                            width={24}
                            strokeWidth={5}
                            strokeWidthSecondary={1}
                            color="blue"
                            secondaryColor="gray"
                            className="mr-8"
                          />
                        ) : null}
                      </span>
                    </li>
                    <li
                      className={classNames(
                        "p-2 flex items-center",
                        isUnlistingPendingTx
                          ? "bg-gray-200"
                          : "hover:bg-gray-100 cursor-pointer"
                      )}
                      onClick={() => {
                        if (isUnlistingPendingTx) {
                          return true;
                        }
                        contractUnlist();
                      }}
                    >
                      <span
                        className={classNames(
                          "text-md",
                          isUnlistingPendingTx
                            ? "text-gray-400"
                            : "text-red-900"
                        )}
                      >
                        <BsXSquare />
                      </span>
                      <span className="ml-4 text-gray-600 font-medium flex-1">
                        {isUnlistingPendingTx ? "Unlist Pending..." : "Unlist"}
                      </span>
                      <span>
                        {isUnlistingPendingTx ? (
                          <Oval
                            ariaLabel="loading-indicator"
                            height={24}
                            width={24}
                            strokeWidth={5}
                            strokeWidthSecondary={1}
                            color="blue"
                            secondaryColor="gray"
                            className="mr-8"
                          />
                        ) : null}
                      </span>
                    </li>
                    {walletAddress !== metadata.author ? (
                      isFileVerified ? (
                        <li
                          className={classNames(
                            "p-2 flex items-center",
                            isLoadingFile
                              ? "bg-gray-200"
                              : "hover:bg-gray-100 cursor-pointer"
                          )}
                          onClick={() => {
                            if (isLoadingFile) {
                              return true;
                            }
                            downloadFile();
                          }}
                        >
                          <span
                            className={classNames(
                              "text-md",
                              isLoadingFile ? "text-gray-400" : "text-red-900"
                            )}
                          >
                            <BsDownload />
                          </span>
                          <span className="ml-4 text-gray-600 font-medium flex-1">
                            {isLoadingFile
                              ? "Downloading File..."
                              : "Download File"}
                          </span>
                          <span>
                            {isLoadingFile ? (
                              <Oval
                                ariaLabel="loading-indicator"
                                height={24}
                                width={24}
                                strokeWidth={5}
                                strokeWidthSecondary={1}
                                color="blue"
                                secondaryColor="gray"
                                className="mr-8"
                              />
                            ) : null}
                          </span>
                        </li>
                      ) : (
                        <li
                          className={classNames(
                            "p-2 flex items-center",
                            isLoadingFile
                              ? "bg-gray-200"
                              : "hover:bg-gray-100 cursor-pointer"
                          )}
                          onClick={() => {
                            if (isLoadingFile) {
                              return true;
                            }
                            verifyFile();
                          }}
                        >
                          <span
                            className={classNames(
                              "text-md",
                              isLoadingFile ? "text-gray-400" : "text-red-900"
                            )}
                          >
                            <BsDownload />
                          </span>
                          <span className="ml-4 text-gray-600 font-medium flex-1">
                            {isLoadingFile
                              ? "Verifying File..."
                              : "Verify File"}
                          </span>
                          <span>
                            {isLoadingFile ? (
                              <Oval
                                ariaLabel="loading-indicator"
                                height={24}
                                width={24}
                                strokeWidth={5}
                                strokeWidthSecondary={1}
                                color="blue"
                                secondaryColor="gray"
                                className="mr-8"
                              />
                            ) : null}
                          </span>
                        </li>
                      )
                    ) : null}
                  </>
                )}
              {metadata.listingDetails !== "none" &&
                walletAddress !== metadata.owner && (
                  <li
                    className={classNames(
                      "p-2 flex items-center",
                      isBuyingPendingTx
                        ? "bg-gray-200"
                        : "hover:bg-gray-100 cursor-pointer"
                    )}
                    onClick={() => {
                      if (isBuyingPendingTx) {
                        return true;
                      }
                      contractBuy();
                    }}
                  >
                    <span>
                      <img
                        src={StxIcon}
                        alt="Stacks Icon"
                        height={24}
                        width={24}
                      />
                    </span>
                    <span className="ml-4 text-gray-600 font-medium flex-1">
                      {isBuyingPendingTx ? "Buy Pending..." : "Buy"}
                    </span>
                    <span>
                      {isBuyingPendingTx ? (
                        <Oval
                          ariaLabel="loading-indicator"
                          height={24}
                          width={24}
                          strokeWidth={5}
                          strokeWidthSecondary={1}
                          color="blue"
                          secondaryColor="gray"
                          className="mr-8"
                        />
                      ) : null}
                    </span>
                  </li>
                )}
              {metadata.listingDetails === "none" &&
                metadata.owner ===
                  `${smartistsContractAddress}.${assetContractName}` &&
                pendingSaleDetails &&
                pendingSaleDetails.owner === walletAddress && (
                  <>
                    <li
                      className={classNames(
                        "p-2 flex items-center -mt-8",
                        isReleasingPendingTx || isProcessingTransaction
                          ? "bg-gray-200"
                          : "hover:bg-gray-100 cursor-pointer"
                      )}
                      onClick={() => {
                        if (isReleasingPendingTx || isProcessingTransaction) {
                          return true;
                        }
                        contractRelease();
                      }}
                    >
                      <span
                        className={classNames(
                          "text-md",
                          isReleasingPendingTx || isProcessingTransaction
                            ? "text-gray-400"
                            : "text-red-900"
                        )}
                      >
                        <IoRocketOutline />
                      </span>
                      <span className="ml-4 text-gray-600 font-medium flex-1">
                        {isProcessingTransaction
                          ? "Processing..."
                          : isReleasingPendingTx
                          ? "Release Pending..."
                          : "Release"}
                      </span>
                      <span>
                        {isReleasingPendingTx || isProcessingTransaction ? (
                          <Oval
                            ariaLabel="loading-indicator"
                            height={24}
                            width={24}
                            strokeWidth={5}
                            strokeWidthSecondary={1}
                            color="blue"
                            secondaryColor="gray"
                            className="mr-8"
                          />
                        ) : null}
                      </span>
                    </li>

                    {metadata.author !== walletAddress ? (
                      isFileVerified ? (
                        <li
                          className={classNames(
                            "p-2 flex items-center",
                            isLoadingFile
                              ? "bg-gray-200"
                              : "hover:bg-gray-100 cursor-pointer"
                          )}
                          onClick={() => {
                            if (isLoadingFile) {
                              return true;
                            }
                            downloadFile();
                          }}
                        >
                          <span
                            className={classNames(
                              "text-md",
                              isLoadingFile ? "text-gray-400" : "text-red-900"
                            )}
                          >
                            <BsDownload />
                          </span>
                          <span className="ml-4 text-gray-600 font-medium flex-1">
                            {isLoadingFile
                              ? "Downloading File..."
                              : "Download File"}
                          </span>
                          <span>
                            {isLoadingFile ? (
                              <Oval
                                ariaLabel="loading-indicator"
                                height={24}
                                width={24}
                                strokeWidth={5}
                                strokeWidthSecondary={1}
                                color="blue"
                                secondaryColor="gray"
                                className="mr-8"
                              />
                            ) : null}
                          </span>
                        </li>
                      ) : (
                        <li
                          className={classNames(
                            "p-2 flex items-center",
                            isLoadingFile
                              ? "bg-gray-200"
                              : "hover:bg-gray-100 cursor-pointer"
                          )}
                          onClick={() => {
                            if (isLoadingFile) {
                              return true;
                            }
                            verifyFile();
                          }}
                        >
                          <span
                            className={classNames(
                              "text-md",
                              isLoadingFile ? "text-gray-400" : "text-red-900"
                            )}
                          >
                            <BsDownload />
                          </span>
                          <span className="ml-4 text-gray-600 font-medium flex-1">
                            {isLoadingFile
                              ? "Verifying File..."
                              : "Verify File"}
                          </span>
                          <span>
                            {isLoadingFile ? (
                              <Oval
                                ariaLabel="loading-indicator"
                                height={24}
                                width={24}
                                strokeWidth={5}
                                strokeWidthSecondary={1}
                                color="blue"
                                secondaryColor="gray"
                                className="mr-8"
                              />
                            ) : null}
                          </span>
                        </li>
                      )
                    ) : null}
                  </>
                )}
            </ul>
          </div>

          <hr className="mt-12" />

          <div className="mt-4">
            {metadata.listingDetails === "none" &&
            metadata.owner ===
              `${smartistsContractAddress}.${assetContractName}` ? (
              pendingSaleDetails ? (
                <>
                  <p className="font-normal text-xs text-gray-500 leading-6">
                    Bought by
                  </p>
                  <p
                    className="font-medium text-xs text-gray-600 leading-6 hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/${pendingSaleDetails.newOwner}`);
                    }}
                  >
                    {pendingSaleDetails.newOwner}
                  </p>
                  <p className="font-normal text-xs text-gray-500 leading-6 mt-2">
                    Owned by
                  </p>
                  <p
                    className="font-medium text-xs text-gray-600 leading-6 hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(`/${pendingSaleDetails.owner}`);
                    }}
                  >
                    {pendingSaleDetails.owner}
                  </p>
                  <p className="font-normal text-xs text-gray-500 leading-6 mt-2">
                    Temporarily moved to contract address for pending sale of
                    owner.
                  </p>
                  <a
                    className="font-medium text-xs text-gray-600 leading-6 hover:underline cursor-pointer"
                    href={`${StacksExplorer}/txid/${metadata.owner}?chain=${
                      isMocknet || isMainnet ? "mainnet" : "testnet"
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {metadata.owner}
                  </a>
                </>
              ) : (
                "-"
              )
            ) : (
              <>
                <p className="font-normal text-xs text-gray-500 leading-6">
                  Owned by
                </p>
                <p
                  className="font-medium text-xs text-gray-600 leading-6 hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(`/${metadata.owner}`);
                  }}
                >
                  {metadata.owner}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7 flex flex-col col-span-full">
          {metadata.file_mime_type.startsWith("image/") && (
            <img
              className="w-full h-auto object-contain max-h-75vh rounded-lg"
              src={`https://smartists.mypinata.cloud/ipfs/${metadata.thumbnail.replace(
                "ipfs://",
                ""
              )}`}
              alt="Artwork"
            />
          )}

          <div className="mt-6">
            <div className="flex flex-col space-y-4 items-start justify-start">
              <div>
                <p className="font-normal text-xs text-gray-500 leading-6">
                  Description
                </p>
                <p className="font-semibold text-sm text-gray-600 leading-6">
                  {metadata.description}
                </p>
              </div>
              <div>
                <p className="font-normal text-xs text-gray-500 leading-6">
                  Author
                </p>
                <p className="font-semibold text-sm text-gray-600 leading-6">
                  {metadata.author}
                </p>
              </div>
            </div>
          </div>
          <div>
            <hr className="mt-8" />
            <div className="mt-4">
              <p className="font-medium text-lg text-gray-600">
                License details
              </p>
              <div className="flex flex-col space-y-4 items-start justify-start mt-4">
                <div>
                  <p className="font-normal text-xs text-gray-500 leading-6">
                    Licensing level
                  </p>
                  <p className="font-semibold text-sm text-gray-600 leading-6">
                    {metadata.level}
                  </p>
                </div>
                <div>
                  <p className="font-normal text-xs text-gray-500 leading-6">
                    Rights granted
                  </p>
                  <p className="font-semibold text-sm text-gray-600 leading-6">
                    {licenseDetails &&
                      Object.keys(licenseDetails.rightsGranted)
                        .filter(function (key) {
                          return licenseDetails.rightsGranted[key];
                        })
                        .join(", ")}
                  </p>
                </div>
                {metadata.owner === walletAddress && (
                  <div>
                    <p className="font-normal text-xs text-gray-500 leading-6">
                      License status
                    </p>
                    <p className="font-semibold text-sm text-gray-600 leading-6">
                      {metadata.author !== walletAddress ? (
                        licenseDetails && "expireAt" in licenseDetails ? (
                          licenseDetails.expireAt >
                          Math.floor(Date.now() / 1000) ? (
                            <span className=" text-green-700">Active</span>
                          ) : (
                            "Expired"
                          )
                        ) : metadata.level === 1 ? (
                          "Level 1 cannot be licensed"
                        ) : (
                          "Available for licensing"
                        )
                      ) : (
                        "License not available for authors"
                      )}
                    </p>
                  </div>
                )}

                {metadata.owner === walletAddress &&
                  metadata.author !== walletAddress &&
                  licenseDetails &&
                  "expireAt" in licenseDetails && (
                    <>
                      <div>
                        <p className="font-normal text-xs text-gray-500 leading-6">
                          Expire at
                        </p>
                        <p className="font-semibold text-sm text-gray-600 leading-6">
                          {new Date(
                            licenseDetails.expireAt * 1000
                          ).toUTCString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-normal text-xs text-gray-500 leading-6">
                          Licensed at
                        </p>
                        <p className="font-semibold text-sm text-gray-600 leading-6">
                          {new Date(
                            licenseDetails.updatedAt * 1000
                          ).toUTCString()}
                        </p>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Grid>
      <ListModal
        isListingOpen={isListingOpen}
        setIsListingOpen={setIsListingOpen}
        metadata={metadata}
        assetContractName={assetContractName}
        waitTransaction={waitTransaction}
        setWaitTransaction={setWaitTransaction}
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        isListing={isListing}
        formLoading={formLoading}
        setFormLoading={setFormLoading}
        price={price}
        setPrice={setPrice}
        contractList={contractList}
        isProcessingTransaction={isProcessingTransaction}
      />
      <LicenseModal
        isLicensingOpen={isLicensingOpen}
        setIsLicensingOpen={setIsLicensingOpen}
        metadata={metadata}
        assetContractName={assetContractName}
        isBuyingLicense={isBuyingLicense}
        walletAddress={walletAddress}
        licenseDetails={licenseDetails}
        contractBuyLicense={contractBuyLicense}
      />
    </div>
  );
};

export default View;
