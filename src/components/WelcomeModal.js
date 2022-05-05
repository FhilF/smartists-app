import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import helloImage from "../assets/images/hello.png";

function WelcomeModal({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => { }}>
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
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4 2xl:w-1/4 sm:p-14 text-center">
              <div className="inline-flex flex-col items-center justify-start">
                <div>
                  <img src={helloImage} alt="hello" />
                </div>
                <div className="flex flex-col space-y-7 items-center justify-start">
                  <div className="flex flex-col space-y-4 items-center justify-start">
                    <p className="w-72 text-2xl font-semibold text-center text-gray-900">Welcome to your Smartists member</p>
                    <p className="w-full text-base leading-normal text-center text-gray-500">Here you can create a studio and share it with your clients and other Smartists members. Only registered members will be able to see your member.</p>
                  </div>
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-red-900 shadow rounded-full cursor-pointer" onClick={() => setOpen(false)}>
                    <p className="text-base font-medium leading-normal text-white">Got it</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default WelcomeModal;
