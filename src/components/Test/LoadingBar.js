import React from "react";
import LoadingBar from "react-top-loading-bar";
function LoadingBarComponent(props) {
  const { loadingProgress, setLoadingProgress } = props;
  return (
    <>
      <LoadingBar
        color="#84170e"
        progress={loadingProgress}
        onLoaderFinished={() => setLoadingProgress(0)}
      />
    </>
  );
}

export default LoadingBarComponent;
