export const validateInputForBlankSpacesAndSpecialCharacters = (value: any) => {
  const text = value?.trim();
  if (value === '') {
    return true;
  }
  if (text === '') {
    return text?.length || 'Input cannot be all white spaces';
  } else {
    return !/[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Special characters are not allowed';
  }
};
