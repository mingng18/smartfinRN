export const capitalizeFirstLetter = (str) => {
  if (typeof str !== "string") {
    return ""; // Return an empty string for non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
