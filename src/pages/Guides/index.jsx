import React, { useState, useEffect, useRef, createRef } from "react";
import Accordion from "components/Accordion";
import { useParams } from "react-router-dom";

function Guides() {
  return (
    <div className="w-full flex justify-center">
      <div className=" max-w-screen-lg w-full">
        <div>
          <div className="mt-20">
            <h1 className=" font-medium text-3xl">Guides</h1>
            <p className="mt-4 text-gray-500">
              Below are guides that can help you use smartists
            </p>
          </div>
          <div className="w-full mt-4">
            <ul className="flex flex-col items-start justify-start w-full">
              <Accordion title="Install Hiro wallet" link="https://youtu.be/5OBOAfaSU_4?t=142"/>
              <Accordion title="Create account on Smartists" link="/guides/create-account-on-smartists"/>
              {/* <li className="items-center font-semibold text-lg w-full 2xl:w-3/5 border-b border-solid border-gray-600/20 py-6">
            <a href="# " onClick="">
              How do I join smartists?
            </a>
          </li>
          <li className="items-center font-semibold text-lg w-full 2xl:w-3/5 border-b border-solid border-gray-600/20 py-6">
            <a href="# " onClick="">
              How do I mint?
            </a>
          </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guides;
