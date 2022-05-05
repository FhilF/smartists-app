import React from "react";

import imagePlaceHolder from "../assets/images/mountain-placeholder.jpg";
import Button from "../customComponents/Button";
function FeaturedProject() {
  return (
    <div className="bg-white card mt-4">
      <div className="grid grid-cols-3">
        <div>
          <div
            className="w-full h-44 bg-center bg-cover"
            style={{ backgroundImage: `url(${imagePlaceHolder})` }}
          ></div>
        </div>
        <div className="col-span-2 px-4 py-2 flex flex-col">
          <div className="">
            <p className="font-semibold text-lg text-gray-800">Lorem Ipsum</p>
            <p className="font-normal text-sm text-gray-600">
              Where does it come from?
            </p>
            <p className="font-normal text-sm text-gray-400 mt-4">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. the
              readable content of a page when looking at its layout.
            </p>
          </div>
          <div className="flex self-end items-end flex-grow">
            <div>
              <Button link="project" color="secondary" size="small">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProject;
