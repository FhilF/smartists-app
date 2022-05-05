import React, { useState, Fragment } from "react";
import { ReactComponent as TrashIcon } from "assets/svg-icon/TrashIcon.svg";
import { Dialog, Transition } from "@headlessui/react";
import { deleteFeaturedWorkAsync } from "utils/redux/slice/featuredWorkSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { deleteFileFromStorage } from "utils/stacks-util/storage";

function Delete(props) {
  const { featuredWork } = props;
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  const handleDelete = () => {
    deleteFileFromStorage(featuredWork.media.fileName)
      .then((res) => {
        return dispatch(deleteFeaturedWorkAsync({ id: featuredWork.id }));
      })
      .then((res) => {
        alert.success("Successfully delete your featured artwork");
        navigate(
          `/${featuredWork.Studio.SmartistsUser.walletAddress}/studio/featured-work`
        );
      })
      .catch((err) => {
        //   console.log(error);
        alert.error("There was an error processing your request!");
      });
  };

  return (
    <>
      <div
        className="inline-flex space-x-2 items-center justify-center py-2 pl-2.5 pr-3 bg-white shadow border rounded-full border-gray-400 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <TrashIcon />
        <p className="text-sm font-medium leading-none text-gray-900">
          Delete this featured artwork
        </p>
      </div>

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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4 2xl:w-1/4 sm:p-14">
                <div className="inline-flex flex-col items-center justify-start">
                  {/* <div>
                    <img src={helloImage} alt="hello" />
                  </div> */}
                  <div className="flex flex-col space-y-7 items-center justify-start">
                    <div className="flex flex-col space-y-4 items-center justify-start  text-center">
                      <p className="w-72 text-2xl font-semibold text-center text-gray-900">
                        Are you sure?
                      </p>
                      <p className="w-full text-base leading-normal text-center text-gray-500">
                        Do you really want to delete this artwork? This process
                        cannot be undone.
                      </p>
                    </div>
                    <div>
                      <button
                        className="inline-flex items-center justify-center px-4 py-2 shadow rounded-sm cursor-pointer"
                        onClick={() => setOpen(false)}
                      >
                        <p className="text-base font-medium leading-normal text-gray-900">
                          Cancel
                        </p>
                      </button>
                      <div
                        className="inline-flex items-center justify-center px-4 py-2 bg-red-900 shadow rounded-sm cursor-pointer"
                        onClick={() => handleDelete()}
                      >
                        <button className="text-base font-medium leading-normal text-white">
                          Delete
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
    </>
  );
}

export default Delete;
