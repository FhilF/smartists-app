import {
  encryptContent,
  makeECPrivateKey,
  getPublicKeyFromPrivate,
  decryptContent,
  listFiles,
  getFile,
  putFile,
  deleteFile,
  loadUserData,
} from "blockstack";
import { SUPPORTED_IMAGE_FORMATS } from "./constants";

import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";

const previewImageOptions = {
  maxSizeMB: 7,
  maxWidthOrHeight: 1800,
  useWebWorker: true,
};

const uploadImageOptions = {
  maxSizeMB: 3,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export const uploadFile = async (userSession, dir, file, options) => {
  const id = uuidv4();

  const filename = `${dir}/${id}`;
  const gaialink = await userSession.putFile(filename, file, options);
  return { fileName: filename, link: gaialink };
};

const getFileBlob = (fileByteArray) => {
  return URL.createObjectURL(new Blob([new Uint8Array(fileByteArray)]));
};

const getFileFromStorage = (username, fileName, imageKey) => {
  return new Promise(function (resolve, rejetc) {
    getFile(fileName, { username: username, decrypt: false })
      .then((file) => {
        if (file) {
          var content;
          if (imageKey) {
            try {
              content = decryptContent(file, { privateKey: imageKey });
            } catch (err) {
              rejetc(err);
            }
          } else {
            content = file;
          }
          resolve(content);
        } else {
          resolve();
        }
      })
      .catch((err) => rejetc(err));
  });
};

const _getFileUrl = (fileName, username, imageKey) => {
  return new Promise(function (resolve, reject) {
    getFileFromStorage(fileName, username, imageKey)
      .then((file) => {
        if (file) {
          resolve(getFileBlob(file));
        } else {
          resolve();
        }
      })
      .catch((err) => reject(err));
  });
};

export const getMediaFile = (username, fileName, imageKey) => {
  return _getFileUrl(username, fileName, imageKey);
};

const deleteFileFromStorage = (fileName) => {
  return new Promise(function (resolve, reject) {
    deleteFile(fileName)
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  });
};

export const deleteMediaFile = (fileName) => {
  return deleteFileFromStorage(fileName);
};

const getFileFromUserStorage = (username, fileName, imageKey) => {
  return new Promise(function (resolve, rejetc) {
    getFile(fileName, {
      username: username,
      verify: false,
      decrypt: false,
      zoneFileLookupURL: "https://core.blockstack.org/v1/names/",
    })
      .then((file) => {
        if (file) {
          var content;
          if (imageKey) {
            try {
              content = decryptContent(file, { privateKey: imageKey });
            } catch (err) {
              rejetc(err);
            }
          } else {
            content = file;
          }
          resolve(content);
        } else {
          resolve();
        }
      })
      .catch((err) => rejetc(err));
  });
};

const _getFileFromUserUrl = (fileName, username, imageKey) => {
  return new Promise(function (resolve, reject) {
    getFileFromUserStorage(fileName, username, imageKey)
      .then((file) => {
        if (file) {
          resolve(getFileBlob(file));
        } else {
          resolve();
        }
      })
      .catch((err) => reject(err));
  });
};

export const getMediaFileFromUser = (username, fileName, imageKey) => {
  return _getFileFromUserUrl(username, fileName, imageKey);
};
