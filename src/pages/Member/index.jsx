import React, { useEffect } from "react";

import {
  publicKeyToAddress,
  getPublicKeyFromPrivate,
} from "@stacks/encryption";

import { userSession } from "utils/stacks-util/auth";
import { addFileToStorage } from "utils/stacks-util/storage";
function Home(props) {
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      // let fileName = "car.json";

      // let fileData = {
      //   color: "blue",
      //   electric: true,
      //   purchaseDate: "2019-04-03",
      // };

      // const options = {
      //   encrypt: false,
      // };
      // const test = async () => {
      //   try {
      //     const a = await addFileToStorage(
      //       { dir: "test123" },
      //       JSON.stringify(fileData),
      //       options
      //     );
      //     console.log(a);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // };
      // test();

      // const userData = userSession.loadUserData();
      // console.log(userData);
      // console.log(getPublicKeyFromPrivate(userData.appPrivateKey));
      // console.log(
      //   publicKeyToAddress(getPublicKeyFromPrivate(userData.appPrivateKey))
      // );
    }
  }, []);

  console.log();
  return (
    <div className="w-full mt-12 px-8">
      <div className="mt-32 flex justify-center">
        <h3 className="text-base text-gray-400">
          Member feed not yet available
        </h3>
      </div>
    </div>
  );
}

export default Home;
