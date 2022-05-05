import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ReadOnlyFunctionArgsFromJSON } from "@stacks/blockchain-api-client";
import {
  smartContractsApi,
  nonFungibleTokensApi,
  smartistsContractAddress,
  accountsApi,
  isMainnet,
  assetIdentifiers,
} from "config";
import { userSession } from "utils/stacks-util/auth";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { getSessionedMemberNftHoldingsAsync } from "utils/redux/slice/userSessionSlice";
import { getSmartistsMemberNftHoldingsAsync } from "utils/redux/slice/smartistsUserSlice";
import { data } from "autoprefixer";
import { selectSmartistsUser } from "utils/redux/slice/smartistsUserSlice";
import { getContractStoredAssetsAsync } from "utils/redux/slice/nftSlice";

// dispatch(getSmartistsUserAsync({ walletAddress: walletAddress }));

function NFT(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    smartistsUserData,
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6 flex">
        <h1 className=" text-slate-800 text-4xl font-bold text tracking-tight flex-1">
          NFT
        </h1>
        {isSessionedUser && (
          <button
            className="px-8 py-2 text-white shadow rounded-full bg-red-900"
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/${
                  smartistsUserData[
                    isMainnet ? "walletAddress" : "walletAddressTestnet"
                  ]
                }/studio/nft/mint`
              );
            }}
          >
            Mint NFT
          </button>
        )}
      </div>
      <div className="mt-6">
        <ul className="flex">
          <li
            className={classNames(
              "text-sm cursor-pointer",
              searchParams.get("tab") === null &&
                "border-red-900 border-solid  border-b-2"
            )}
            onClick={() => {
              searchParams.delete("tab");
              setSearchParams(searchParams);
            }}
          >
            Owned
          </li>
          <li
            className={classNames(
              "text-sm cursor-pointer ml-6",
              searchParams.get("tab") === "pending-sales" &&
                "border-red-900 border-solid  border-b-2"
            )}
            onClick={() => {
              searchParams.set("tab", "pending-sales");
              setSearchParams(searchParams);
            }}
          >
            Pending Sales
          </li>
        </ul>
      </div>
      <div className="mt-12">
        {searchParams.get("tab") === null && (
          <Owned
            smartistsUserData={smartistsUserData}
            isSessionedUser={isSessionedUser}
          />
        )}
        {searchParams.get("tab") === "pending-sales" && <PendingSales />}
      </div>
    </div>
  );
}

const Owned = (props) => {
  const { smartistsUserData, isSessionedUser } = props;
  const dispatch = useDispatch();
  const [pageRoute, setPageRoute] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [genuineList, setGenuineList] = useState([]);
  const navigate = useNavigate();
  const walletAddress =
    smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"];

  const sessionedMemberState = useSelector((store) => store.userSessionReducer);
  const smartistsMemberState = useSelector(
    (store) => store.smartistsUserReducer
  );

  useEffect(() => {
    if (isSessionedUser) {
      if (sessionedMemberState.nftList.status === "idle") {
        dispatch(
          getSessionedMemberNftHoldingsAsync({
            walletAddress,
            assetIdentifiers,
          })
        );
      }
      if (sessionedMemberState.nftList.status === "fulfilled") {
        setGenuineList(sessionedMemberState.nftList.data);
        setIsLoading(false);
      }
      if (sessionedMemberState.nftList.status === "rejected") {
        setGenuineList([]);
        setIsLoading(false);
        setIsError(true);
      }
    }
  }, [sessionedMemberState.nftList]);

  useEffect(() => {
    if (!isSessionedUser) {
      if (smartistsMemberState.nftList.status === "idle") {
        dispatch(getSmartistsMemberNftHoldingsAsync({ walletAddress }));
      }

      if (
        smartistsMemberState.nftList.status === "fulfilled" &&
        walletAddress === smartistsMemberState.nftList.walletAddress
      ) {
        setGenuineList(smartistsMemberState.nftList.data);
        setIsLoading(false);
      }

      if (smartistsMemberState.nftList.status === "rejected") {
        setGenuineList([]);
        setIsLoading(false);
        setIsError(true);
      }

      if (
        smartistsMemberState.nftList.status === "fulfilled" &&
        walletAddress !== smartistsMemberState.nftList.walletAddress
      ) {
        setGenuineList([]);
        dispatch(getSmartistsMemberNftHoldingsAsync({ walletAddress }));
      }
    }
  }, [smartistsMemberState.nftList]);

  return (
    <div className="mt-12">
      {!isLoading ? (
        !isError ? (
          genuineList.length !== 0 ? (
            <>
              <div className=" grid grid-cols-3 gap-6">
                {genuineList.map((el, i) => {
                  return (
                    <Card
                      key={i}
                      navigate={navigate}
                      genuineHexId={el.value}
                      assetIdentifier={el.asset_identifier}
                      smartistsUserData={smartistsUserData}
                      isMainnet={isMainnet}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="w-full mt-8 px-8">
              <div className="mt-32 flex justify-center">
                <h3 className="text-base text-gray-400">
                  Member hasn't minted a genuine.
                </h3>
              </div>
            </div>
          )
        ) : (
          <div className="w-full mt-8 px-8">
            <div className="mt-32 flex justify-center">
              <h3 className="text-base text-gray-400">
                There was an error processing your request
              </h3>
            </div>
          </div>
        )
      ) : null}
      {/* <div className="mt-32 flex justify-center">
    <h3 className="text-base text-gray-400">
      NFT not yet available
    </h3>
  </div> */}
    </div>
  );
};

const PendingSales = (props) => {
  const {} = props;

  const dispatch = useDispatch();
  const nftState = useSelector((store) => store.nftReducer);
  useEffect(() => {
    if (nftState.contractStoredAssets.status === "idle") {
      dispatch(getContractStoredAssetsAsync());
    }

    if (nftState.contractStoredAssets.status === "fulfilled") {
      console.log(nftState.contractStoredAssets);
      
      // setGenuineList(smartistsMemberState.nftList.data);
      // setIsLoading(false);
    }

    if (nftState.contractStoredAssets.status === "rejected") {
      // setGenuineList([]);
      // setIsLoading(false);
      // setIsError(true);
    }
  }, [nftState.contractStoredAssets]);
  return <div>PendingSales</div>;
};

export default NFT;
