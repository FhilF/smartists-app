import React, { useState, useEffect } from "react";

import { useBlockstack } from "react-blockstack";

function Home() {
  const { userSession } = useBlockstack();
  var files = [];
  userSession
    .listFiles(function (filename) {
      files.push(filename);
      console.log(filename);
      return true; // to continue files listing
    })
    .then(function (filesCount) {
      console.log("Files count: " + filesCount);
    });
  return <div>Home</div>;
}

export default Home;
