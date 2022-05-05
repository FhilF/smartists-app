// import { decryptContent } from "blockstack";

// import { SUPPORTED_IMAGE_FORMATS } from "./constants";

// import FileNotFoundMedia from "../assets/images/file-not-found.png";
// import ErrorMedia from "../assets/images/error-file.png";

// import imageCompression from "browser-image-compression";
// import { v4 as uuidv4 } from "uuid";
// import {
//   addFileToStorage,
//   getFileFromStorage,
//   deleteFileFromStorage,
// } from "../storage";

// const previewImageOptions = {
//   maxSizeMB: 7,
//   maxWidthOrHeight: 1800,
//   useWebWorker: true,
// };

// const uploadImageOptions = {
//   maxSizeMB: 3,
//   maxWidthOrHeight: 1920,
//   useWebWorker: true,
// };

// export const uploadFile = (dir, file, options) => {
//   return new Promise(function (myResolve, myReject) {
//     const id = uuidv4();
//     const fileName = `${dir ? `${dir}/` : null}${id}`;
//     addFileToStorage(fileName, file, options)
//       .then((res) => {
//         myResolve(res);
//       })
//       .catch((err) => {
//         myReject(err);
//       });
//   });
// };

// const getFileBlob = (fileByteArray) => {
//   return URL.createObjectURL(new Blob([new Uint8Array(fileByteArray)]));
// };

// const getFileFromUserStorage = (fileName, username, imageKey) => {
//   return new Promise(function (resolve, rejetc) {
//     getFileFromStorage(fileName, {
//       decrypt: false,
//       username: username || undefined,
//     })
//       .then((file) => {
//         if (file) {
//           var content;
//           if (imageKey) {
//             try {
//               content = decryptContent(file, { privateKey: imageKey });
//             } catch (err) {
//               rejetc(err);
//             }
//           } else {
//             content = file;
//           }
//           resolve(content);
//         } else {
//           resolve();
//         }
//       })
//       .catch((err) => {
//         rejetc(JSON.parse(JSON.stringify(err)));
//       });
//   });
// };

// const _deleteMediaFile = (fileName) => {
//   return new Promise(function (resolve, reject) {
//     deleteFileFromStorage(fileName)
//       .then(() => {
//         resolve();
//       })
//       .catch((err) => reject(err));
//   });
// };

// export const deleteMediaFile = (fileName) => {
//   return _deleteMediaFile(fileName);
// };

// const _getMediaFile = (fileName, username, imageKey) => {
//   return new Promise(function (resolve, reject) {
//     getFileFromUserStorage(fileName, username, imageKey)
//       .then((file) => {
//         if (file) {
//           resolve(getFileBlob(file));
//         } else {
//           resolve();
//         }
//       })
//       .catch((err) => {
//         if (err.code === "does_not_exist") {
//           resolve(FileNotFoundMedia);
//         } else {
//           resolve(ErrorMedia);
//         }
//       });
//   });
// };

// export const getMediaFile = (fileName, username, imageKey) => {
//   return _getMediaFile(fileName, username, imageKey);
// };
