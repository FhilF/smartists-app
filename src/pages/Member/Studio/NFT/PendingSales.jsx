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
import classNames from "classnames";
import { contractName } from "config";

function PendingSale(props) {
  const {
    searchParams,
    setSearchParams,
    userSessionedWalletAddress,
    userWalletAddress,
  } = props;
  const navigate = useNavigate();

  const [listedNft, setListedNft] = useState([]);
  const [nftList, setNftList] = useState([]);
  useEffect(() => {
    const fetchMarketItems = async () => {

      try {
        const lastTokenId = await smartContractsApi.callReadOnlyFunction({
          contractAddress: smartistsContractAddress,
          contractName,
          functionName: "get-last-token-id",
          readOnlyFunctionArgs: ReadOnlyFunctionArgsFromJSON({
            sender: userSessionedWalletAddress,
            arguments: [],
          }),
        });
        let lastTokenIdCv = deserializeCV(
          Buffer.from(lastTokenId.result.substr(2), "hex")
        );
        const marketItems = await fetchMapEntry(
          smartistsContractAddress,
          contractName,
          "pending-sale",
          parseInt(cvToString(lastTokenIdCv.value).substr(1))
        );
        let filteredItems = [];
        marketItems.forEach((el) => {
          const modifiedItem = {
            ...el,
            owner: cvToString(el.data.owner),
            newOwner: cvToString(el.data["new-owner"]),
            price: cvToString(el.data.price),
          };
          delete modifiedItem["data"];
          filteredItems = [...filteredItems, modifiedItem];
        });

        // console.log(filteredItems);

        setListedNft(filteredItems);
      } catch (error) {}
    };
    fetchMarketItems();
  }, []);

  useEffect(() => {
    if (listedNft.length > 0) {
      if (
        searchParams.get("type") === "sold" ||
        searchParams.get("type") === null
      ) {
        const filterItems = listedNft.filter(
          (item) => item.owner === userWalletAddress
        );
        setNftList(filterItems);
        return true;
      }

      if (searchParams.get("type") === "bought") {
        const filterItems = listedNft.filter(
          (item) => item.newOwner === userWalletAddress
        );
        setNftList(filterItems);
        return true;
      }
    }
  }, [listedNft, searchParams]);

  const getCategory = () => {
    if (
      searchParams.get("type") === null ||
      searchParams.get("type") === "sold"
    ) {
      return "pending-sale-sold";
    }

    if (searchParams.get("type") === "bought") {
      return "pending-sale-bought";
    }
  };

  return (
    <div>
      <div className="mt-8">
        <div className="flex justify-center">
          <ul className="flex">
            <li
              className={classNames(
                "cursor-pointer font-semibold",
                (searchParams.get("type") === null ||
                  searchParams.get("type") === "sold") &&
                  "border-red-900 border-solid  border-b-2"
              )}
              onClick={() => {
                searchParams.set("type", "sold");
                setSearchParams(searchParams);
              }}
            >
              Sold
            </li>
            <li
              className={classNames(
                "cursor-pointer ml-6 font-semibold",
                searchParams.get("type") === "bought" &&
                  "border-red-900 border-solid  border-b-2"
              )}
              onClick={() => {
                searchParams.set("type", "bought");
                setSearchParams(searchParams);
              }}
            >
              Bought
            </li>
          </ul>
        </div>

        <div className=" grid grid-cols-3 gap-6 mt-10">
          {orderBy(
            nftList,
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
                userWalletAddress={userWalletAddress}
                userSessionedWalletAddress={userSessionedWalletAddress}
                price={el.price}
                owner={el.owner}
                newOwner={el.newOwner}
                category={getCategory()}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PendingSale;
