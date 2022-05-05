import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import emailjs from 'emailjs-com';
import { useAlert } from "react-alert";
import placeHolder from "../assets/images/avatar-placeholder.png";

export default function ContactModal({ open, setOpen, user }) {
  const alert = useAlert();
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    // try {
    //   const templateParams = {
    //     message,
    //     fromName: user.name,
    //     toEmail: user.email,
    //   };
    //   await emailjs.send(process.env.REACT_APP_EMAILJS_SERVICEID, process.env.REACT_APP_EMAILJS_TEMPLATEID, templateParams, process.env.REACT_APP_EMAILJS_USERID);
    //   setOpen(false);
    //   setMessage('');
    //   alert.success("Message sent successfully");
    // } catch (error) {
    //   console.log(error.message);
    //   alert.error("There was a problem sending the message");
    // }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-3/4 2xl:w-1/4 sm:p-14">

              <p className="w-full text-xl font-semibold leading-7 text-gray-500">Contact with</p>
              <div className="inline-flex space-x-6 items-center justify-start mt-6">
                <div className=" w-20 h-20 m-auto">
                  <div
                    style={{
                      backgroundImage: `url(${user?.displayPicture
                        ? user?.displayPicture
                        : placeHolder
                        })`,
                    }}
                    className="z-50 h-full w-full rounded-full bg-center bg-cover border-gray-400 border"
                  ></div>
                </div>
                <div className="inline-flex flex-col space-y-0.5 items-start justify-start">
                  <p className="w-full text-base leading-normal text-gray-500">
                    {
                      user.isArtist.boolean ?
                        user.isArtUser.boolean ?
                          `Artist & Art-user - ${user.isArtUser.info.majorInterest}`
                          :
                          "Artist"
                        :
                        `Art-user - ${user.isArtUser.info.majorInterest}`
                    }
                  </p>
                  <p className="w-full text-xl font-semibold leading-7 text-gray-900">
                    {user.name !== null
                      ? user.name
                      : "Anonymous Person"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-7 items-center justify-end w-full h-2/3 mt-6">
                <div className="flex flex-col space-y-1 items-start justify-start w-full h-36">
                  <p className="text-sm font-medium leading-tight text-gray-700">Message</p>
                  <textarea
                    className="text-base leading-normal text-gray-500 w-full px-3 py-2 bg-white shadow border rounded-md border-gray-300"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-end w-full">
                  <div
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-900 shadow rounded-full cursor-pointer"
                    onClick={sendMessage}
                  >
                    <p className="text-base font-medium leading-normal text-white">Send Message</p>
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
