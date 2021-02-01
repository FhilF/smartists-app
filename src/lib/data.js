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
