export const textInputWhiteSpaceValidator = (state: string) => {
  let isInputValidated: boolean = state?.trim()?.length === 0;

  return isInputValidated;
};
