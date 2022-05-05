import classNames from "classnames";
import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { StacksNetwork } from "config";
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from "@stacks/transactions";



import { openSTXTransfer, openContractCall } from "@stacks/connect";

import { userSession } from "utils/stacks-util/auth";

function NFT(props) {
  const {
    isSessionedUser,
    signedInSmartistsUser,
    setSignedInSmartistsUser,
    smartistsUserData,
  } = props;
  const [pageRoute, setPageRoute] = useState("all");
  const navigate = useNavigate();
  const network = new StacksNetwork();

  const transfer = async () => {};

  const testGetTime = async () => {
    const options = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "hello-world",
      functionName: "test",
      functionArgs: [],
      network,
      appDetails: {
        name: "My App",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };

    await openContractCall(options);
  };

  const test = async () => {
    const options = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "hello-world",
      functionName: "say-hi",
      functionArgs: [],
      network,
      appDetails: {
        name: "My App",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };

    await openContractCall(options);
  };

  const mint = async () => {
    const options = {
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "genuine-v1",
      functionName: "create-genuine",
      functionArgs: [stringAsciiCV("hey-ascii")],
      network,
      appDetails: {
        name: "My App",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };

    await openContractCall(options);
  };

  return (
    <div>
      <button
        onClick={(e) => {
          test();
        }}
      >
        Test
      </button>

      <button
        onClick={(e) => {
          mint();
        }}
      >
        Mint
      </button>


      <button
        onClick={(e) => {
          testGetTime();
        }}
      >
        Get Time
      </button>
    </div>
  );
}

export default NFT;
