import React, { useEffect, useState } from "react";
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
  cvToHex,
  deserializeCV,
  cvToString,
  cvToInt,
} from "@stacks/transactions";

import { ReadOnlyFunctionArgsFromJSON } from "@stacks/blockchain-api-client";

import {
  smartContractsApi,
  nonFungibleTokensApi,
  smartistsContractAddress,
  accountsApi,
} from "config";
import axios from "axios";
import { Oval } from "react-loader-spinner";

function Card(props) {
  const {
    id,
    transaction,
    userWalletAddress,
    navigate,
    contractName,
    contractAddress,
    index,
    price,
    owner,
    newOwner,
    category,
    userSessionedWalletAddress,
  } = props;
  // const id = deserializeCV(Buffer.from(genuineHexId.hex.substr(2), "hex"));
  const [metadata, setMetadata] = useState(null);
  useEffect(() => {
    if (id) {
      getGenuineMetadata();
    }

    if (transaction) {
      getPendingMintMetadata();
    }
  }, []);

  const getGenuineMetadata = async () => {
    try {
      const rawMetadata = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: contractName,
        functionName: "get-metadata",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: userSessionedWalletAddress,
          arguments: [cvToHex(uintCV(id))],
        }),
      });

      let metadataCV = deserializeCV(
        Buffer.from(rawMetadata.result.substr(2), "hex")
      );

      metadataCV = metadataCV.value.data;
      let data = {
        id: id,
        author: cvToString(metadataCV["author"]),
        createdAt: cvToString(metadataCV["created-at"]).substr(1),
        level: cvToString(metadataCV["level"]).substr(1),
        metadataUri: metadataCV["metadata-uri"].data,
      };

      let nftMetadata = await axios.get(
        `https://smartists.mypinata.cloud/ipfs/${data.metadataUri.replace(
          "ipfs://",
          ""
        )}`
      );

      let details = {};
      if (!price) {
        const listingDetails = await smartContractsApi.callReadOnlyFunction({
          contractAddress: smartistsContractAddress,
          contractName: contractName,
          functionName: "get-listing-details",
          readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
            sender: userSessionedWalletAddress,
            arguments: [cvToHex(uintCV(id))],
          }),
        });

        const listingCv = deserializeCV(
          Buffer.from(listingDetails.result.substr(2), "hex")
        );
        if (cvToString(listingCv) !== "none") {
          details = {
            owner: cvToString(listingCv.value.data.owner),
            price: cvToString(listingCv.value.data.price),
          };
        }
      }

      data = { ...data, ...nftMetadata.data, ...details };
      delete data["author_address"];
      // console.log(data);
      setMetadata(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPendingMintMetadata = async () => {
    const ipfsId = cvToString(
      deserializeCV(
        Buffer.from(
          transaction.contract_call.function_args[1].hex.substr(2),
          "hex"
        )
      )
    )
      .substr(1)
      .replace('"', "");
    try {
      let nftMetadata = await axios.get(
        `https://smartists.mypinata.cloud/ipfs/${ipfsId.replace("ipfs://", "")}`
      );
      const data = {
        ...nftMetadata.data,
        author: nftMetadata.data.author,
        level: cvToString(
          deserializeCV(
            Buffer.from(
              transaction.contract_call.function_args[0].hex.substr(2),
              "hex"
            )
          )
        ).substr(1),
      };
      delete data["author_address"];
      setMetadata(data);
      // console.log(nftMetadata);
    } catch (error) {}
  };
  // console.log({ userWalletAddress, owner });

  return (
    <div className="bg-white card rounded-xl shadow-md">
      <div className="relative">
        <div
          className="cursor-pointer"
          onClick={(e) => {
            metadata && navigate(`/nft/${contractName}/${metadata.id}`);
          }}
        >
          <div
            className="w-full h-72 bg-center bg-cover rounded-t-xl"
            style={
              metadata && {
                backgroundImage: `url(https://smartists.mypinata.cloud/ipfs/${metadata.thumbnail.replace(
                  "ipfs://",
                  ""
                )})`,
              }
            }
          ></div>

          <div className="pt-4 pb-4">
            <div className="px-4 ">
              <p className="text-lg font-medium leading-7 text-gray-600">
                {id
                  ? metadata && `#${metadata.id} - ${metadata.name}`
                  : metadata && `${metadata.name}`}
              </p>
              <div className="mt-1 flex">
                <p className="text-xs text-gray-400 mt capitalize flex-1">
                  {metadata && contractName.replace("-", " ")}
                </p>
                <p className="text-xs text-gray-400 mt capitalize">
                  {metadata && metadata.level && `Level ${metadata.level}`}
                </p>
              </div>
            </div>
            <hr />
            <div className="px-4 flex items-center max-h-5">
              <p className="flex-1 text-sm font-semibold text-gray-600">
                {price
                  ? `${parseInt(price.substr(1)) / 1000000} stx`
                  : id
                  ? metadata && metadata.price
                    ? `${parseInt(metadata.price.substr(1)) / 1000000} stx`
                    : "Not for sale"
                  : "N/A"}
              </p>
              {(category === "pending-sale-sold" ||
                category === "pending-sale-bought") &&
                metadata &&
                userSessionedWalletAddress === owner && (
                  <button
                    className="text-sm bg-red-800 rounded-full px-3 py-1 text-white hover:bg-red-900 w-24 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      metadata &&
                        navigate(`/nft/${contractName}/${metadata.id}`);
                    }}
                  >
                    Release
                  </button>
                )}

              {((category === "pending-sale-sold" &&
                userSessionedWalletAddress !== owner &&
                metadata) ||
                (category === "pending-sale-bought" && (userSessionedWalletAddress === newOwner || userSessionedWalletAddress !== owner) && metadata) ||
                (category === "owned" && metadata && !metadata.price) ||
                (category === "not-owned" && metadata && !metadata.price)) && (
                <button
                  className="text-sm bg-red-800 rounded-full px-3 py-1 text-white hover:bg-red-900 w-24 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    metadata && navigate(`/nft/${contractName}/${metadata.id}`);
                  }}
                >
                  View
                </button>
              )}
              {((category === "owned" && metadata && metadata.price) ||
                (category === "market-item" &&
                  userSessionedWalletAddress === owner)) && (
                <button
                  className="text-sm rounded-full px-3 py-1 text-gray-600 border border-solid border-gray-600 w-24 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    metadata && navigate(`/nft/${contractName}/${metadata.id}`);
                  }}
                >
                  Unlist
                </button>
              )}

              {((category === "not-owned" && metadata && metadata.price) ||
                (category === "market-item" &&
                  userSessionedWalletAddress !== owner &&
                  price)) && (
                <button
                  className="text-sm bg-red-800 rounded-full px-3 py-1 text-white hover:bg-red-900 w-24 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    metadata && navigate(`/nft/${contractName}/${metadata.id}`);
                  }}
                >
                  Buy
                </button>
              )}

              {/* {price ? (
                userWalletAddress === owner ? (
                  <button
                    className="text-sm rounded-full px-3 py-1 text-gray-600 border border-solid border-gray-600 w-24 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      metadata &&
                        navigate(`/nft/${contractName}/${metadata.id}`);
                    }}
                  >
                    Unlist
                  </button>
                ) : (
                  <button
                    className="text-sm bg-red-800 rounded-full px-3 py-1 text-white hover:bg-red-900 w-24 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      metadata &&
                        navigate(`/nft/${contractName}/${metadata.id}`);
                    }}
                  >
                    Buy now
                  </button>
                )
              ) : id ? (
                metadata && metadata.price ? (
                  <button
                    className="text-sm rounded-full px-3 py-1 text-gray-600 border border-solid border-gray-600 w-24 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      metadata &&
                        navigate(`/nft/${contractName}/${metadata.id}`);
                    }}
                  >
                    Unlist
                  </button>
                ) : (
                  <button
                    className="text-sm bg-red-800 rounded-full px-3 py-1 text-white hover:bg-red-900 w-24 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      metadata &&
                        navigate(`/nft/${contractName}/${metadata.id}`);
                    }}
                  >
                    View
                  </button>
                )
              ) : null} */}
            </div>
          </div>
        </div>
        {transaction && (
          <div className=" absolute w-full h-full z-10 top-0 left-0 right-0 bottom-0">
            <div className="w-full h-full bg-gray-500/20 rounded-xl flex items-center justify-center">
              <Oval
                ariaLabel="loading-indicator"
                height={80}
                width={80}
                strokeWidth={5}
                strokeWidthSecondary={1}
                color="maroon"
                secondaryColor="gray"
                className="mr-8"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
