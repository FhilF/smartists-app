import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import helloImage from "../assets/images/hello.png";

function WaitTransactionModal(props) {
  const { open, setOpen, transactionId, isExistingFaucet } = props;
  return (
    <Transition.Root show={open} as={Fragment}>
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4 2xl:w-1/2 text-center  py-24">
              <div className="inline-flex flex-col items-center justify-start">
                <div>
                  <h1 className=" text-4xl font-medium text-gray-700">
                   {isExistingFaucet ? "You already have an existing request" : "Transaction Sent"} 
                  </h1>
                  <p className="text-sm text-gray-400 mt-4">
                    Please wait for a while. This may take a while. You can check your transaction using stack's explorer.
                  </p>
                  <div className="flex justify-center mt-8">
                    <div className="flex flex-col">
                      <a
                        className="px-8 py-4 text-white shadow rounded-full bg-red-900 text-center"
                        href={`https://explorer.stacks.co/txid/${
                          transactionId && transactionId
                        }?chain=testnet`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Track your transaction
                      </a>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
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
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default WaitTransactionModal;
