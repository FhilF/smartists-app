import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import * as stacks from "@stacks/blockchain-api-client";
import { StacksApiUrl, isMainnet, isMocknet, StacksExplorer } from "config";

function WaitTransaction(props) {
  const {
    transactionId,
    navigate,
    userWalletAddress,
    setWaitTransaction,
    setTransactionId,
  } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  

  return (
    <div className="flex justify-center mt-20">
      <div>
        <h1 className=" text-4xl font-medium text-gray-700">
          Transaction Sent
        </h1>
        <p className="text-sm text-gray-400 mt-4">
          Please wait for a while. This may take a while
        </p>
        <div className="flex justify-center mt-8">
          <div className="flex flex-col">
            <a
              className="px-8 py-4 text-white shadow rounded-full bg-red-900 text-center"
              href={`${StacksExplorer}/txid/0x${transactionId}${
                isMainnet || isMocknet ? "?chain=mainnet" : "?chain=testnet"
              }`}
              target="_blank"
              rel="noreferrer"
            >
              Track your transaction
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (setWaitTransaction) {
                  setWaitTransaction(false);
                  setTransactionId(null);
                } else {
                  navigate(`/${userWalletAddress}/studio/nft`);
                }
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
  );
}

export default WaitTransaction;
