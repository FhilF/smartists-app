import React, { useEffect, useState } from "react";
import { fetchMapEntry } from "utils/stacks-util/apiCaller";
import { smartistsContractAddress, smartContractsApi, isMainnet } from "config";
import { ReadOnlyFunctionArgsFromJSON } from "@stacks/blockchain-api-client";
import {
  uintCV,
  cvToHex,
  deserializeCV,
  cvToString,
} from "@stacks/transactions";
import { userSession } from "utils/stacks-util/auth";
import { orderBy } from "lodash";
import Card from "components/NftCard";
import { useNavigate } from "react-router-dom";
import WaitTransaction from "components/WaitTransaction";

function Gallery(props) {
  console.log(props);
  const navigate = useNavigate();
  const userData = userSession.loadUserData();
  const walletAddress =
    userData.profile.stxAddress[isMainnet ? "mainnet" : "testnet"];

  const [listedNft, setListedNft] = useState([]);
  useEffect(() => {
    const fetchMarketItems = async () => {
      const contractName = "genuine-v1";

      try {
        const lastTokenId = await smartContractsApi.callReadOnlyFunction({
          contractAddress: smartistsContractAddress,
          contractName,
          functionName: "get-last-token-id",
          readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
            sender: walletAddress,
            arguments: [],
          }),
        });
        let lastTokenIdCv = deserializeCV(
          Buffer.from(lastTokenId.result.substr(2), "hex")
        );
        const marketItems = await fetchMapEntry(
          smartistsContractAddress,
          "genuine-v1",
          "market-item",
          parseInt(cvToString(lastTokenIdCv.value).substr(1))
        );
        let filteredItems = [];
        marketItems.forEach((el) => {
          const modifiedItem = {
            ...el,
            owner: cvToString(el.data.owner),
            price: cvToString(el.data.price),
          };
          delete modifiedItem["data"];
          filteredItems = [...filteredItems, modifiedItem];
        });

        console.log(filteredItems);

        setListedNft(filteredItems);
      } catch (error) {}
    };
    fetchMarketItems();
  }, []);

  return (
    <div>
      <div className="mt-20">
        <div>
          <h1 className=" text-4xl">Gallery</h1>
        </div>
        <div className=" grid grid-cols-4 gap-4 mt-10">
          {orderBy(
            listedNft,
            (item) => parseInt(item.price.substr(1)),
            "asc"
          ).map((el, i) => {
            return (
              <Card
                key={el.id}
                index={i}
                navigate={navigate}
                id={el.id}
                contractName={el.contractName}
                contractAddress={el.contractAddress}
                // userWalletAddress={walletAddress}
                userSessionedWalletAddress={walletAddress}
                price={el.price}
                owner={el.owner}
                category="market-item"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
