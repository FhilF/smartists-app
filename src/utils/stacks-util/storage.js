import { v4 as uuid } from "uuid";
import { userSession } from "./auth";
import { Storage } from "@stacks/storage";

const storage = new Storage({ userSession });

function isObject(o) {
  return o instanceof Object && o.constructor === Object;
}

export const addFileToStorage = (filename, file, options) => {
  return new Promise(function (myResolve, myReject) {
    let finalFileName;
    if (isObject(filename)) {
      if (filename.dir && !filename.name) {
        const id = uuid();
        finalFileName = `${filename.dir}/${id}`;
      } else if (!filename.dir && filename.name) {
        finalFileName = filename.name;
      } else if (filename.dir && filename.name) {
        finalFileName = `${filename.dir}/${filename.name}`;
      } else {
        return myReject("File name missing");
      }
      storage
        .putFile(finalFileName, file, options)
        .then((res) => {
          myResolve({ fileName: finalFileName, url: res });
        })
        .catch((err) => {
          console.log(err);
          myReject(err);
        });
    } else {
      return myReject("File name missing");
    }
  });
};

export const getFileFromStorage = (filename, options) => {
  return new Promise(function (myResolve, myReject) {
    storage
      .getFile(filename, options)
      .then((res) => {
        myResolve(res);
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
