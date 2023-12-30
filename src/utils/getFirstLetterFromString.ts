export const getFirstLetterFromString = (text: string) => {
  let trimmedText = text.trim();
  let firstLetter = '';
  var format = /[!@#$%^&*()_+=[\]{};':"“”`\\|,.<>?]+/;
  for (let i = 0; i < trimmedText?.length; i++) {
    if (firstLetter === '') {
      if (!format.test(trimmedText[i])) {
        firstLetter = trimmedText[i];
      }
    }
  }

  return firstLetter;
};
