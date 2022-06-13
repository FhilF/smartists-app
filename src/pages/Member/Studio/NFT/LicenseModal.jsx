import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import {
  smartistsContractAddress,
  StacksNetwork,
  StacksApiUriWs,
  smartContractsApi,
} from "config";
import {
  noneCV,
  someCV,
  uintCV,
  PostConditionMode,
  cvToHex,
  deserializeCV,
  cvToString,
} from "@stacks/transactions";
import { ReadOnlyFunctionArgsFromJSON } from "@stacks/blockchain-api-client";
import { openContractCall } from "@stacks/connect";
import { useAlert } from "react-alert";

import { connectWebSocketClient } from "@stacks/blockchain-api-client";

import { appDetails } from "utils/stacks-util/auth";
import { Oval } from "react-loader-spinner";
function ListModal(props) {
  const {
    metadata,
    assetContractName,
    isLicensingOpen,
    setIsLicensingOpen,
    isBuyingLicense,
    walletAddress,
    licenseDetails,
    contractBuyLicense,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [licensingDetails, setLicensingDetails] = useState(null);
  useEffect(() => {}, []);

  return (
    <Transition.Root show={isLicensingOpen} as={Fragment}>
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
                    {isBuyingLicense ? "Buy license" : "Renew license"}
                  </p>
                  <div className="flex items-center ">
                    <span
                      className="text-lg cursor-pointer"
                      onClick={() => {
                        setIsLicensingOpen(false);
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
                          backgroundImage: `url(https://smartists.mypinata.cloud/ipfs/${metadata.thumbnail.replace(
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
                  <div className="w-full"></div>
                  <div className="w-full">
                    <hr className="w-full mb-0" />
                  </div>
                  <div className="w-full">
                    <p className="text-gray-800 text-sm">Licensing breakdown</p>
                    <div className="mt-2 w-full">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                          <p className="text-xs text-gray-800">Details</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs text-gray-800">Price</p>
                        </div>
                        <div className="col-span-3 mt-2">
                          <p className="text-sm text-gray-800 font-semibold">
                            {`License level ${metadata.level} - (${
                              licenseDetails &&
                              Object.keys(licenseDetails.rightsGranted)
                                .filter(function (key) {
                                  return licenseDetails.rightsGranted[key];
                                })
                                .join(", ")
                            })`}
                          </p>
                        </div>
                        <div className="col-span-1 mt-2">
                          <p className="text-sm text-gray-800 font-semibold">
                            {licenseDetails &&
                              `${licenseDetails.price / 1000000} STX`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full pt-6">
                    <hr className="w-full mb-0" />
                  </div>
                  <div className="w-full">
                    <div className="mt-2 w-full">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                          <p className="text-sm text-gray-800 font-semibold">
                            You will pay
                          </p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-sm text-gray-800 font-semibold">
                            {licenseDetails &&
                              `${licenseDetails.price / 1000000} STX`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    className="px-8 py-2 text-gray-600 shadow rounded-md w-28 font-medium text-sm"
                    onClick={() => {
                      setIsLicensingOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-8 py-2 text-white shadow rounded-md bg-red-900 w-28 font-medium text-sm"
                    onClick={() => {
                      if (!licenseDetails) {
                        return true;
                      }
                      
                      contractBuyLicense();
                      //   contractList();
                    }}
                  >
                    {isBuyingLicense ? "Buy" : "Renew"}
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
