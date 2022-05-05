import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ReactComponent as ImageIcon } from "assets/svg-icon/ImageIcon.svg";
import { ReactComponent as VideoIcon } from "assets/svg-icon/VideoIcon.svg";
import { ReactComponent as AudioIcon } from "assets/svg-icon/AudioIcon.svg";
import { ReactComponent as BlogIcon } from "assets/svg-icon/BlogIcon.svg";
import { useAlert } from "react-alert";

export default function ArtworkTypeModal(props) {
  const { open, setOpen, setMediaType, setOpenTypeModal, setOpenAddModal } =
    props;
  const alert = useAlert();
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-2/4 2xl:w-1/4 sm:p-14">
              <div className="flex flex-col space-y-2 items-center justify-start w-full">
                <p className="w-full text-xl font-semibold leading-7 text-center text-gray-900">
                  Artwork Type
                </p>
                <p className="w-full text-sm leading-normal text-center text-gray-500">
                  Choose the artwork type you are going to publish.
                </p>
              </div>
              <div className="flex flex-col space-y-2 items-start justify-start mt-6">
                <div
                  className="inline-flex space-x-2 items-center justify-start w-full px-6 py-4 bg-white shadow border rounded-lg border-gray-300 cursor-pointer"
                  onClick={() => {
                    setMediaType("Image");
                    setOpenTypeModal(false);
                    setTimeout(function () {
                      setOpenAddModal(true);
                    }, 1000);
                  }}
                >
                  <ImageIcon />
                  <div className="inline-flex flex-col items-start justify-start w-60">
                    <p className="w-full text-sm font-medium leading-tight text-gray-900">
                      Image
                    </p>
                  </div>
                </div>
                <div
                  className="inline-flex space-x-2 items-center justify-start w-full px-6 py-4 bg-white shadow border rounded-lg border-gray-300 cursor-pointer"
                  onClick={() => {
                    setMediaType("Video");
                    setOpenTypeModal(false);
                    setTimeout(function () {
                      setOpenAddModal(true);
                    }, 1000);
                  }}
                >
                  <VideoIcon />
                  <div className="inline-flex flex-col items-start justify-start w-60">
                    <p className="w-full text-sm font-medium leading-tight text-gray-900">
                      Video
                    </p>
                  </div>
                </div>
                <div
                  className="inline-flex space-x-2 items-center justify-start w-full px-6 py-4 bg-white shadow border rounded-lg border-gray-300 cursor-pointer"
                  onClick={() => {
                    setMediaType("Audio");
                    setOpenTypeModal(false);
                    setTimeout(function () {
                      setOpenAddModal(true);
                    }, 1000);
                  }}
                >
                  <AudioIcon />
                  <div className="inline-flex flex-col items-start justify-start w-60">
                    <p className="w-full text-sm font-medium leading-tight text-gray-900">
                      Audio
                    </p>
                  </div>
                </div>
                <div
                  className="inline-flex space-x-2 items-center justify-start w-full px-6 py-4 bg-white shadow border rounded-lg border-gray-300 cursor-pointer"
                  onClick={() => {
                    alert.info("Not yet available")
                    // setMediaType("Text");
                    // setOpenTypeModal(false);
                    // setTimeout(function () {
                    //   setOpenAddModal(true);
                    // }, 1000);
                  }}
                >
                  <BlogIcon />
                  <div className="inline-flex flex-col items-start justify-start w-60">
                    <p className="w-full text-sm font-medium leading-tight text-gray-900">
                      Text
                    </p>
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
