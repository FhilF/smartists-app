import React, { useState, useEffect } from "react";

import { UserGroup } from "radiks";

import { useBlockstack } from "react-blockstack";
import SmartistsUser from "routes/SmartistsUser";

function Home(props) {
  const { history, smartistsUser } = props;
  const { userSession } = useBlockstack();
  useEffect(() => {
    history.push(`/member/${smartistsUser[0].attrs.username}`);
  }, []);
  var files = [];
  // userSession
  //   .listFiles(function (filename) {
  //     files.push(filename);
  //     console.log(filename);
  //     return true; // to continue files listing
  //   })
  //   .then(function (filesCount) {
  //     console.log("Files count: " + filesCount);
  //   });

  // const aaaaaa = async () => {
  //   const group = new UserGroup({ name: "My Group Name" });
  //   await group.create();
  // };

  useEffect(() => {
    // aaaaaa();
  }, []);
  return <div>Home</div>;
}

export default Home;
