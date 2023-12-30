export const validateInputForBlankSpaces = (value: any) => {
  const text = value?.trim();
  if (value === '') {
    return true;
  }
  if (text === '') {
    return text?.length || 'Input cannot be all white spaces';
  }
};
