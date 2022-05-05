import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "customComponents/IconButton";
import { MdKeyboardBackspace } from "react-icons/md";
import Grid from "customComponents/Grid";
import {
  smartContractsApi,
  nonFungibleTokensApi,
  smartistsContractAddress,
  accountsApi,
  isMainnet,
  assetIdentifiers,
  StacksNetwork,
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
} from "@stacks/transactions";

import axios from "axios";

import { ReadOnlyFunctionArgsFromJSON } from "@stacks/blockchain-api-client";

import { isEmpty, isInteger } from "lodash";
import { userSession } from "utils/stacks-util/auth";
import ListModal from "./ListModal";
import WaitTransaction from "components/WaitTransaction";

import { openContractCall } from "@stacks/connect";
import { appDetails } from "utils/stacks-util/auth";
import { useAlert } from "react-alert";
import { getPublicKeyFromPrivate } from "@stacks/encryption";
import { StacksExplorer } from "config";
import { isMocknet } from "config";
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

  useEffect(() => {
    if (assetIdentifiers.some((v) => v.includes(assetContractName))) {
      getGenuineMetadata();
    } else {
      setIsValidAssetIdentifier(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      metadata &&
      metadata.listingDetails === "none" &&
      metadata.owner === `${smartistsContractAddress}.${assetContractName}`
    ) {
      getPendingSaleDetails();
    }
  }, [metadata]);

  const getPendingSaleDetails = async () => {
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

    const pendingSail = pendingSaleCv.value.value
      ? {
          newOwner: cvToString(pendingSaleCv.value.value.data["new-owner"]),
          owner: cvToString(pendingSaleCv.value.value.data.owner),
          price: cvToString(pendingSaleCv.value.value.data.price).substr(1),
          publicKey: cvToString(pendingSaleCv.value.value.data["public-key"]),
        }
      : cvToString(pendingSaleCv.value);

    setPendingSaleDetails(pendingSail);
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

        const listing = listingCv.value.value
          ? {
              owner: cvToString(listingCv.value.value.data.owner),
              price: cvToString(listingCv.value.value.data.price).substr(1),
            }
          : cvToString(listingCv.value);
        metadataCV = metadataCV.value.value.data;

        let data = {
          id,
          author: cvToString(metadataCV["author"]),
          createdAt: cvToString(metadataCV["created-at"]).substr(1),
          level:
            cvToString(metadataCV["level"]) === "none"
              ? "none"
              : cvToString(metadataCV["level"].value).substr(1),
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
  } = props;
  // console.log(metadata);

  const [isListingOpen, setIsListingOpen] = useState(false);
  console.log(metadata)

  useEffect(() => {}, [metadata]);

  const ContractUnlist = async () => {
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
      onFinish: (data) => {
        alert.success(
          "Successfully placed your transaction. Please for a while."
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

  const ContractPurchase = async () => {
    const nonFungibleAssetInfo = createAssetInfo(
      smartistsContractAddress,
      assetContractName,
      "Genuine"
    );
    const transactionOptions = {
      contractAddress: smartistsContractAddress,
      contractName: assetContractName,
      functionName: "purchase-in-ustx",
      functionArgs: [
        uintCV(parseInt(metadata.id)),
        stringAsciiCV(getPublicKeyFromPrivate(userData.appPrivateKey)),
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
          <p className="text-base text-gray-600 mt-8">
            {metadata.listingDetails === "none" ? (
              metadata.owner ===
              `${smartistsContractAddress}.${assetContractName}` ? (
                pendingSaleDetails &&
                pendingSaleDetails.owner === walletAddress ? (
                  <button className="px-8 py-2 text-white shadow rounded-md bg-red-900 w-44 font-medium">
                    Release
                  </button>
                ) : pendingSaleDetails &&
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
            {metadata.listingDetails === "none" ? (
              walletAddress === metadata.owner ? (
                <>
                  <button
                    className="px-8 py-2 text-white shadow rounded-md bg-red-900 w-44 font-medium"
                    onClick={() => {
                      setIsListing(true);
                      setIsListingOpen(true);
                    }}
                  >
                    List
                  </button>
                  <button className="px-8 py-2 text-gray-600 shadow rounded-md  w-44 font-medium">
                    Transfer
                  </button>
                </>
              ) : null
            ) : walletAddress === metadata.owner ? (
              <>
                <button
                  className="px-8 py-2 text-white shadow rounded-md bg-red-900 w-44 font-medium"
                  onClick={() => {
                    setIsListing(false);
                    setIsListingOpen(true);
                  }}
                >
                  Update Price
                </button>
                <button
                  className="px-8 py-2 text-gray-600 shadow rounded-md  w-44 font-medium"
                  onClick={() => {
                    ContractUnlist();
                  }}
                >
                  Unlist
                </button>
              </>
            ) : (
              <button
                className="px-8 py-2 text-white shadow rounded-md bg-red-900 w-44 font-medium"
                onClick={() => {
                  ContractPurchase();
                }}
              >
                Purchase
              </button>
            )}
          </div>
          <hr className="mt-12" />

          <div className="mt-4">
            {metadata.listingDetails === "none" &&
            metadata.owner ===
              `${smartistsContractAddress}.${assetContractName}` ? (
              pendingSaleDetails ? (
                <>
                  <p className="font-normal text-xs text-gray-500 leading-6">
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
          {metadata.raw_file_mime_type.startsWith("image/") && (
            <img
              className="w-full h-auto object-contain max-h-75vh rounded-lg"
              src={`https://smartists.mypinata.cloud/ipfs/${metadata.image.replace(
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
                  Licensing level
                </p>
                <p className="font-semibold text-sm text-gray-600 leading-6">
                  {metadata.level}
                </p>
              </div>
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
      />
    </div>
  );
};

export default View;
