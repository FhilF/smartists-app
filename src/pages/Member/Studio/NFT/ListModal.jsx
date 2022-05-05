import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { smartistsContractAddress, StacksNetwork } from "config";
import { noneCV, someCV, uintCV, PostConditionMode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { useAlert } from "react-alert";

import { appDetails } from "utils/stacks-util/auth";
function ListModal(props) {
  const {
    isListingOpen,
    setIsListingOpen,
    metadata,
    assetContractName,
    setWaitTransaction,
    waitTransaction,
    transactionId,
    setTransactionId,
    isListing,
  } = props;

  const alert = useAlert();
  const network = new StacksNetwork();

  const [price, setPrice] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  // const [isApprove, setIsApprove] = useState(false);
  const ContractList = async () => {
    if (price !== "") {
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
          setFormLoading(false);
          console.log("Cancelled");
        },
      };
      await openContractCall(transactionOptions);
    } else {
      alert.error("Please fill the up the required details!");
    }
  };
  return (
    <Transition.Root show={isListingOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {}}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom text-left bg-white rounded-lg p-8 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4 lg:w-full lg:max-w-xl">
              <div>
                <div className="flex">
                  <p className=" font-medium text-gray-600 text-lg flex-1">
                    {isListing ? "List for sale" : "Update price"}
                  </p>
                  <div className="flex items-center ">
                    <span
                      className="text-lg cursor-pointer"
                      onClick={() => {
                        setIsListingOpen(false);
                      }}
                    >
                      <IoCloseSharp />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-4 items-start justify-start">
                  <div className="mt-4 w-full bg-gray-200 p-3 rounded-lg flex">
                    <div>
                      <div
                        className=" bg-center bg-cover rounded-xl"
                        style={{
                          height: "72px",
                          width: "72px",
                          backgroundImage: `url(https://smartists.mypinata.cloud/ipfs/${metadata.image.replace(
                            "ipfs://",
                            ""
                          )})`,
                        }}
                      ></div>
                    </div>
                    <div className="flex-1 ml-3 flex items-center">
                      <div>
                        <p className=" text-gray-800">
                          {`#${metadata.id} - ${metadata.name}`}{" "}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {assetContractName}
                        </p>

                        <p className="text-gray-400 text-xs mt-2">
                          {`Licensing: ${metadata.level}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">
                      Enter the amount of STX you want the buyer to pay for your
                      NFT
                    </p>
                  </div>
                  <div className="w-full">
                    <input
                      style={{ appearance: "textfield" }}
                      placeholder="0.000000 STX"
                      id="name"
                      className="appearance-none text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300 outline-red-900"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      type="number"
                      autoComplete="off"
                      // disabled={formLoading}
                    />
                  </div>
                  <div className="w-full">
                    <hr className="w-full mb-0" />
                  </div>
                  <div className="w-full">
                    <p className="text-gray-800 text-sm">Listing breakdown</p>
                    <div className="mt-2 flex">
                      <p className="text-xs text-gray-800 flex-1">Price</p>
                      <p className="text-xs text-gray-800">
                        {price && `${price} STX`}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <hr className="w-full mb-0" />
                  </div>
                  <div className="w-full">
                    <div className="mt-2 flex">
                      <p className="text-sm text-gray-800 flex-1">
                        You will receive
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {price && `${price} STX`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    className="px-8 py-2 text-gray-600 shadow rounded-md w-28 font-medium text-sm"
                    onClick={() => {
                      setIsListingOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-8 py-2 text-white shadow rounded-md bg-red-900 w-28 font-medium text-sm"
                    onClick={() => {
                      ContractList();
                    }}
                  >
                    {isListing ? "List" : "Update"}
                    
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ListModal;
