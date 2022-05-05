import React from "react";
import Button from "customComponents/Button";

function NotAccessible() {
  return (
    <div>
      <div className="flex justify-center">
        <div className="w-full pl-4 pr-4 sm:p-0">
          <div className="flex justify-center relative mt-32">
            <div className="relative text-center">
              <h1 className="text-gray-800 text-7xl font-semibold">Sorry</h1>
              <h3 className="text-gray-400 text-2xl mt-4">
                This page is not accessible for you
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

export default NotAccessible;
