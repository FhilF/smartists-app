export const isEmpty = (str) => {
  if (!str || 0 === str.length || !str.trim()) {
    return null;
  }
  return str;
};
