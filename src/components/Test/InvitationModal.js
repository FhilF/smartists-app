import React, { Fragment, useEffect } from "react";
// import { connect } from "react-redux";
import { useParams } from 'react-router-dom';
import { Dialog, Transition } from "@headlessui/react";
// import {
//   fetchSmartistsMember,
// } from "utils/actions/smartistsMemberAction";
import placeHolder from "../assets/images/avatar-placeholder.png";

function InvitationModal({ authenticate,  fetchSmartistsMember, smartistsMember }) {
  
  const { userIdentity } = useParams();
  useEffect(() => {
    // let query = {
    //   identityAddress: userIdentity,
    //   studioLookup: true,
    // };
    // if (userIdentity.charAt(0) === "@") {
    //   query = {
    //     username: userIdentity.substring(1),
    //     studioLookup: true,
    //   };
    // }
    // fetchSmartistsMember(query);
  }, []);
  
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => {}}>
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
              <div className=" w-28 h-28 m-auto">
                <div
                  style={{
                    backgroundImage: `url(${
                      smartistsMember?.displayPicture
                        ? smartistsMember?.displayPicture
                        : placeHolder
                    })`,
                  }}
                  className="z-50 h-full w-full rounded-full bg-center bg-cover border-gray-400 border"
                ></div>
              </div>
              <div className="flex flex-col mt-6 space-y-2 items-start justify-start">
                  <p className="w-full text-2xl font-semibold text-center text-gray-900">{smartistsMember?.name ? smartistsMember.name : "Anonymous Person"} has invited you to see his private studio on Smartists</p>
                  <p className="w-full text-base leading-normal text-center text-gray-500">Join Smartists and see his artworks and collaboration projects and much more.</p>
              </div>
              <div
                className="inline-flex items-center justify-center mt-6 w-64 px-6 py-3 bg-red-900 shadow rounded-full cursor-pointer"
                onClick={authenticate}
              >
                  <p className="text-base font-medium leading-normal text-white">Join Smartists</p>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

// const mapStateToProps = (state) => ({
//   smartistsMember: state.smartistsMemberReducer.smartistsMember && state.smartistsMemberReducer.smartistsMember[0],
// });
export default InvitationModal;