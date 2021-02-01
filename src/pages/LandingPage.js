import React, { useEffect } from "react";
import { Storage } from "@stacks/storage";

import { userSession } from "../UserSession";

function LandingPage() {
  const storage = new Storage({ userSession });
  const options = {
    username: "fenrir029.id.blockstack",
    verify: false,
    decrypt: false,
    zoneFileLookupURL: "https://core.blockstack.org/v1/names/",
  };

  useEffect(() => {
    userSession
      .getFile(
        "SmartistsUser/056a905f6401-4e1a-be7b-a4cd7922edc9",
        options
      )
      .then((fileData) => {
        console.log(fileData);
      });
  }, []);

  return <div>aaa</div>;
}

export default LandingPage;
