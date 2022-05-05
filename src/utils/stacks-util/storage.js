import { v4 as uuid } from "uuid";
import { userSession } from "./auth";
import { Storage } from "@stacks/storage";

const storage = new Storage({ userSession });

export const addFileToStorage = (dir, file, options) => {
  return new Promise(function (myResolve, myReject) {
    const id = uuid();
    const fileName = `${dir ? `${dir}/` : null}${id}`;
    storage
      .putFile(fileName, file, options)
      .then((res) => {
        myResolve({ fileName, url: res });
      })
      .catch((err) => {
        console.log(err);
        myReject(err);
      });
  });
};


export const deleteFileFromStorage = async (filename) => {
  return new Promise(function (myResolve, myReject) {
    storage
      .deleteFile(filename)
      .then((res) => {
        myResolve(res);
      })
      .catch((err) => {
        console.log(err);
        myReject(err);
      });
  });
};