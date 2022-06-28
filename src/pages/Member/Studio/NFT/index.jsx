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
  transactionApi,
  StacksApiUrl,
} from "config";
import { userSession } from "utils/stacks-util/auth";
import Card from "components/NftCard";
import { useDispatch, useSelector } from "react-redux";
import { getSessionedMemberNftHoldingsAsync } from "utils/redux/slice/userSessionSlice";
import { getSmartistsMemberNftHoldingsAsync } from "utils/redux/slice/smartistsUserSlice";
import { data } from "autoprefixer";
import { selectSmartistsUser } from "utils/redux/slice/smartistsUserSlice";
import { getContractStoredAssetsAsync } from "utils/redux/slice/nftSlice";
import { orderBy } from "lodash";
import PendingSales from "./PendingSales";
import { cvToString, deserializeCV } from "@stacks/transactions";
import { faucetApi } from "config";
import WaitTransactionModal from "components/WaitTransactionModal";
import { useAlert } from "react-alert";

import { contractName } from "config";

function NFT(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    smartistsUserData,
    smartistsUserSession,
  } = props;

  const alert = useAlert();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFaucet, setShowFaucet] = useState();
  const [isExistingFaucet, setIsExistingFaucet] = useState(false);
  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const navigate = useNavigate();
  const userData = userSession.loadUserData();

  const userWalletAddress =
    smartistsUserData[isMainnet ? "walletAddress" : "walletAddressTestnet"];

  const userSessionedWalletAddress =
    smartistsUserSession[isMainnet ? "walletAddress" : "walletAddressTestnet"];

  // useEffect(() => {
  //   const getAccountStatus = async () => {
  //     const txId = localStorage.getItem("faucetTxId");
  //     if (!txId) {
  //       const accountInfo = await accountsApi.getAccountInfo({
  //         principal: userSessionedWalletAddress,
  //         proof: 0,
  //       });
  //       const deserialized = deserializeCV(
  //         Buffer.from(accountInfo.balance.substr(2), "hex")
  //       );
  //       const balance = cvToString(deserialized);
  //       if (0 > balance) {
  //         setShowFaucet(true);
  //       }
  //     }
  //   };

  //   if (isSessionedUser) {
  //     getAccountStatus();
  //   }
  // }, []);

  const getTestnetStx = async () => {
    if (isSessionedUser) {
      try {
        const accountInfo = await accountsApi.getAccountInfo({
          principal: userSessionedWalletAddress,
          proof: 0,
        });
        const deserialized = deserializeCV(
          Buffer.from(accountInfo.balance.substr(2), "hex")
        );
        const balance = cvToString(deserialized);

        if (balance < 500) {
          const mempoolTx = await axios.get(
            `https://stacks-node-api.testnet.stacks.co/extended/v1/tx/mempool?recipient_address=${userSessionedWalletAddress}`
          );

          const filteredTx = mempoolTx.data.results.filter(
            (tx) =>
              tx.tx_status === "pending" &&
              tx.tx_type === "token_transfer" &&
              tx.token_transfer.recipient_address === userSessionedWalletAddress
          );
          if (filteredTx.length > 0) {
            setIsExistingFaucet(true);
            setTransactionId(filteredTx[0].tx_id);
            setOpen(true);
          } else {
            const faucetTx = await faucetApi.runFaucetStx({
              address: userSessionedWalletAddress,
            });
            setIsExistingFaucet(false);
            setTransactionId(faucetTx.txId);
            setOpen(true);
          }
        } else {
          alert.info("Please use your existing STX");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex">
        <h1 className=" text-slate-800 text-4xl font-bold text tracking-tight flex-1">
          NFT
        </h1>
        {isSessionedUser && (
          <div>
            {true && (
              <button
                className="px-8 py-2 border border-solid border-gray-600 shadow rounded-full  mr-4"
                onClick={() => {
                  getTestnetStx();
                }}
              >
                Get testnet STX
              </button>
            )}

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
          </div>
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
              searchParams.delete("type");
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
              searchParams.set("type", "sold");
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
            userWalletAddress={userWalletAddress}
            smartistsUserData={smartistsUserData}
            isSessionedUser={isSessionedUser}
            userSessionedWalletAddress={userSessionedWalletAddress}
          />
        )}
        {searchParams.get("tab") === "pending-sales" && (
          <PendingSales
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            userWalletAddress={userWalletAddress}
            userSessionedWalletAddress={userSessionedWalletAddress}
          />
        )}
      </div>
      <WaitTransactionModal
        setOpen={setOpen}
        open={open}
        transactionId={transactionId}
        isExistingFaucet={isExistingFaucet}
      />
    </div>
  );
}

const Owned = (props) => {
  const {
    smartistsUserData,
    isSessionedUser,
    userWalletAddress,
    userSessionedWalletAddress,
  } = props;
  const dispatch = useDispatch();
  const [pageRoute, setPageRoute] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pendingMints, setPendingMints] = useState([]);
  const [genuineList, setGenuineList] = useState([]);
  const navigate = useNavigate();

  const sessionedMemberState = useSelector((store) => store.userSessionReducer);
  const smartistsMemberState = useSelector(
    (store) => store.smartistsUserReducer
  );

  const getMempoolTx = async () => {
    return await transactionApi.getMempoolTransactionList({
      address: `${smartistsContractAddress}.${contractName}`,
    });
  };

  const getPendingListTx = async (functionName, setState, updateFunction) => {
    try {
      const pendingTx = await getMempoolTx();
      const filteredTx = pendingTx.results.filter(
        (tx) =>
          tx.tx_status === "pending" &&
          tx.sender_address === userWalletAddress &&
          tx.contract_call &&
          tx.contract_call.function_args !== null &&
          tx.contract_call.function_args.length > 0 &&
          tx.contract_call.function_name === functionName
      );

      setPendingMints(filteredTx);
    } catch (error) {
      console.log(error);
    }
  };

  const filterTx = (array) =>
    array.filter(
      (tx) =>
        tx.tx_status === "pending" &&
        tx.sender_address === userWalletAddress &&
        tx.contract_call &&
        tx.contract_call.function_args !== null &&
        tx.contract_call.function_args.length > 0 &&
        tx.contract_call.function_name === "create-genuine"
    );

  const poll = async function (fn, fnCondition, ms) {
    let pendingTx = await fn();
    pendingTx = filterTx(pendingTx.results);
    let resultCopy = pendingTx;
    while (fnCondition(pendingTx)) {
      try {
        await wait(ms);
        const newPendingTx = await fn();
        pendingTx = filterTx(newPendingTx.results);
        if (pendingTx.length < resultCopy.length) {
          resultCopy = pendingTx;
          await wait(3000);
          dispatch(
            getSessionedMemberNftHoldingsAsync({
              walletAddress: userWalletAddress,
              assetIdentifiers,
            })
          );
          setPendingMints(pendingTx);
        }
      } catch (error) {
        console.log(error);
      }
    }
    return pendingTx;
  };

  const wait = function (ms = 5000) {
    console.log("getting transaction");
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  async function trackTransaction() {
    try {
      let fetchReport = () => getMempoolTx();
      let validate = (result) => result.length > 0;

      let response = await poll(fetchReport, validate, 5000);
      // console.log(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isSessionedUser) {
      getPendingListTx("create-genuine");
    }
  }, []);

  useEffect(() => {
    if (pendingMints.length > 0) {
      trackTransaction();
    }
  }, [pendingMints]);

  useEffect(() => {
    if (isSessionedUser) {
      if (sessionedMemberState.nftList.status === "idle") {
        dispatch(
          getSessionedMemberNftHoldingsAsync({
            walletAddress: userWalletAddress,
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
        dispatch(
          getSmartistsMemberNftHoldingsAsync({
            walletAddress: userWalletAddress,
          })
        );
      }

      if (
        smartistsMemberState.nftList.status === "fulfilled" &&
        userWalletAddress === smartistsMemberState.nftList.walletAddress
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
        userWalletAddress !== smartistsMemberState.nftList.walletAddress
      ) {
        setGenuineList([]);
        dispatch(
          getSmartistsMemberNftHoldingsAsync({
            walletAddress: userWalletAddress,
          })
        );
      }
    }
  }, [smartistsMemberState.nftList]);

  return (
    <div className="mt-12">
      {!isLoading ? (
        !isError ? (
          genuineList.length !== 0 || pendingMints.length !== 0 ? (
            <>
              <div className=" grid grid-cols-3 gap-6">
                {pendingMints.map((el, i) => {
                  const contractName =
                    el.contract_call.contract_id.split(".")[1];
                  const contractAddress =
                    el.contract_call.contract_id.split(".")[0];
                  return (
                    <Card
                      key={i}
                      navigate={navigate}
                      transaction={el}
                      contractName={contractName}
                      contractAddress={contractAddress}
                      userWalletAddress={userWalletAddress}
                      category="pending-mint"
                    />
                  );
                })}
                {orderBy(
                  genuineList,
                  (item) => parseInt(item.value.repr.substr(1)),
                  "desc"
                ).map((el, i) => {
                  const contractName = el.asset_identifier
                    .split(".")[1]
                    .split("::Genuine")[0];
                  const contractAddress = el.asset_identifier.split(".")[0];
                  return (
                    <Card
                      key={parseInt(el.value.repr.substr(1))}
                      index={i}
                      navigate={navigate}
                      id={parseInt(el.value.repr.substr(1))}
                      contractName={contractName}
                      contractAddress={contractAddress}
                      userWalletAddress={userWalletAddress}
                      userSessionedWalletAddress={userSessionedWalletAddress}
                      category={isSessionedUser ? "owned" : "not-owned"}
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

export default NFT;
