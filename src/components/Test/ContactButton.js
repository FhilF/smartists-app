import React, { useState } from "react";
import ContactModal from "./ContactModal";
import { ReactComponent as ContactIcon } from "../assets/svg-icon/ContactIcon.svg";

function ContactButton({ user }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="inline-flex space-x-2 items-center justify-center w-44 py-2 pl-2.5 pr-3 bg-white bg-opacity-0 shadow border-2 rounded-full border-red-800 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <ContactIcon />
        <p className="text-sm font-medium leading-none text-red-900">Contact</p>
      </div>
      <ContactModal open={open} setOpen={setOpen} user={user} />
    </>
  );
}

export default ContactButton;