import React from "react";
import Button from "../customComponents/Button";

function NotFound() {
  return (
    <div className="relative max-w-screen-lg xl:max-w-screen-xl mx-auto">
      <div className="flex justify-center">
        <div className="w-full pl-4 pr-4 sm:p-0">
          <div className="flex justify-center relative mt-32">
            <div className="relative text-center">
              <h1 className="text-gray-800 text-9xl font-semibold">404</h1>
              <h3 className="text-gray-400 text-2xl mt-4">Page not found</h3>
              <div className="mt-4">
                <Button variant="contained" color="secondary" link="/">Go home</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
