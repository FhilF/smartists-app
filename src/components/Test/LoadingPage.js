import React from "react";
import { SyncLoader } from "react-spinners";

function LoadingPage(props) {
  const { message } = props;
  return (
    <div className="flex h-screen w-screen justify-center items-center min-h-screen min-w-full max-w-max">
      <div className="flex flex-col items-center">
        <SyncLoader color={"#84170e"} loading={true} size={15} />
        {message && (
          <p className="text-lg text-center mt-6 font-semibold tracking-wide">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoadingPage;
