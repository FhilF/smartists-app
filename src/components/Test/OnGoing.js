import React from "react";
import Button from "../customComponents/Button";
import Loader from "react-loader-spinner";
import UnderConstruction from "../assets/images/under-construction.png"

function OnGoing() {
  return (
    <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
      <div className="flex justify-center">
        <div className="w-full pl-4 pr-4 sm:p-0">
          <div className="flex justify-center relative mt-32">
            <div className="relative text-center">
              <div className="flex justify-center">
                <img src={UnderConstruction} alt="aaaa" className=" w-24 h-24"/>
              </div>
              <h1 className="text-gray-800 text-4xlfont-semibold mt-8">
                This page is still under maintenance
              </h1>
              <h3 className="text-gray-400 text-2xl mt-4">
                Sorry for the inconvenience
              </h3>
              <div className="mt-4">
                <Button variant="contained" color="secondary" link="/">
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnGoing;
