export const formatStrData = (str) => {
  if (!str || 0 === str.length || !str.trim()) {
    return null;
  }
  return str.trimStart().trimEnd();
};

export const isEmptyStr = (str) => {
  if (!str || 0 === str.length || !str.trim()) {
    return null;
  }
  return str;
};

export const isEmpty = (str) => {
  if (!str || 0 === str.length || !str.trim()) {
    return true;
  }
  return false;
};

export const truncate = (input, lengthTrunc) => {
  if (input.length > lengthTrunc) {
    return input.substring(0, lengthTrunc) + "...";
  }
  return input;
};

export const isValidURL = (str) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};
