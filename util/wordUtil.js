export const capitalizeFirstLetter = (str) => {
  if (typeof str !== "string") {
    return ""; // Return an empty string for non-string inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function getLastTenCharacters(inputString) {
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return ''; // Return an empty string for non-string inputs or empty strings
  }

  // Use substring method to get the last 10 characters
  return inputString.slice(-10);
}