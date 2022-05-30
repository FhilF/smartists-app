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
  isMainnet,
} from "config";
import axios from "axios";

function Card(props) {
  const {
    genuineHexId,
    smartistsUserData,
    navigate,
    isMainnet,
    assetIdentifier,
  } = props;
  const id = deserializeCV(Buffer.from(genuineHexId.hex.substr(2), "hex"));
  const [metadata, setMetadata] = useState(null);
  const assetContractName = assetIdentifier.split(".")[1].split("::Genuine")[0];
  useEffect(() => {
    getGenuineMetadata(
      smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"]
    );
  }, []);

  const getGenuineMetadata = async (walletAddress) => {
    const intId = cvToString(
      deserializeCV(Buffer.from(genuineHexId.hex.substr(2), "hex"))
    ).substr(1);
    try {
      const rawMetadata = await smartContractsApi.callReadOnlyFunction({
        contractAddress: smartistsContractAddress,
        contractName: "genuine-v1",
        functionName: "get-metadata",
        readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
          sender: walletAddress,
          arguments: [cvToHex(uintCV(intId))],
        }),
      });

      let metadataCV = deserializeCV(
        Buffer.from(rawMetadata.result.substr(2), "hex")
      );

      metadataCV = metadataCV.value.data;
      let data = {
        id: intId,
        author: cvToString(metadataCV["author"]),
        createdAt: cvToString(metadataCV["created-at"]).substr(1),
        level:cvToString(metadataCV["level"]).substr(1),
        metadataUri: metadataCV["metadata-uri"].data,
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="bg-white card rounded-xl cursor-pointer"
      onClick={(e) => {
        metadata && navigate(`/nft/${assetContractName}/${metadata.id}`);
      }}
    >
      <div className="relative">
        <div>
          <div
            className="w-full h-72 bg-center bg-cover rounded-t-xl"
            style={
              metadata && {
                backgroundImage: `url(https://smartists.mypinata.cloud/ipfs/${metadata.image.replace(
                  "ipfs://",
                  ""
                )})`,
              }
            }
          ></div>

          <div className="p-4 pt-4">
            <p className="text-lg font-medium leading-7 text-gray-600">
              {metadata && `#${metadata.id} - ${metadata.name}`}{" "}
            </p>
            <p className="text-xs text-gray-400 mt-1 capitalize">
              {metadata && assetContractName.replace("-", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
