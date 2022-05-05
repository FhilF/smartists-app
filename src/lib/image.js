import { SUPPORTED_IMAGE_FORMATS } from "./constants";

import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";

const previewImageOptions = {
  maxSizeMB: 7,
  maxWidthOrHeight: 1400,
  useWebWorker: true,
};

const uploadImageOptions = {
  maxSizeMB: 3,
  maxWidthOrHeight: 1400,
  useWebWorker: true,
};


export const handleCompressPreviewImage = async (file) => {
  try {
    const compressedFile = await imageCompression(file, previewImageOptions);
    const tempUrls = window.URL.createObjectURL(compressedFile);
    return {
      result: "success",
      data: { rawFile: file, compressedFile: tempUrls },
    };
  } catch (error) {
    return {
      result: "error",
      data: error,
    };
  }
};

export const handleMediaInputChange = async (e) => {
  e.preventDefault();
  const files = e.target.files;
  if (files.length !== 1) {
    return null;
  }

  let file = files[0];
  const fileNameSplit = file.type.split("/");
  const fileExtension = fileNameSplit[fileNameSplit.length - 1].toLowerCase();

  if (!SUPPORTED_IMAGE_FORMATS.includes(fileExtension)) {
    return { result: "error", cause: "file not supported" };
  }

  try {
    const compressedFile = await imageCompression(file, previewImageOptions);
    const tempUrls = window.URL.createObjectURL(compressedFile);
    return {
      result: "success",
      data: { rawFile: file, compressedFile: tempUrls },
    };
  } catch (error) {
    return {
      result: "error",
      data: error,
    };
  }
};

export const uploadFile = async (userSession, dir, file, options) => {
  const id = uuidv4();
  let extension;
  if (file.type === "image/png") {
    extension = ".png";
  } else if (file.type === "image/jpg") {
    extension = ".jpg";
  } else if (file.type === "image/jpeg") {
    extension = ".jpeg";
  } else {
    extension = "";
  }

  const filename = `${dir}/${id}${extension}`;
  const gaialink = await userSession.putFile(filename, file, options);
  return gaialink;
};

export const updateFile = async (userSession, dir, id, file, options) => {
  let extension;
  if (file.type === "image/png") {
    extension = ".png";
  } else if (file.type === "image/jpg") {
    extension = ".jpg";
  } else if (file.type === "image/jpeg") {
    extension = ".jpeg";
  } else {
    extension = "";
  }

  const filename = `${dir}/${id}`;
  const gaialink = await userSession.putFile(filename, file, options);
  return gaialink;
};


export const handleCompress = async (file, a) => {
  try {
    const compressedFile = await imageCompression(file, uploadImageOptions);
    return {
      result: "success",
      data: compressedFile,
    };
  } catch (error) {
    return {
      result: "error",
      data: error,
    };
  }
};
