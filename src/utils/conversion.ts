export const convertFeetToCm = (feet: number, inch: number) => {
  let totalInch = (feet ?? 0) * 12 + (inch ?? 0);

  let heightInCm = (totalInch ?? 0) * 2.54;

  return heightInCm;
};

export const convertCmToFeet = (heightValue: number) => {
  let totalInchFromCm = (heightValue ?? 0) / 2.54;
  let feetValue = parseInt(((totalInchFromCm ?? 0) / 12).toString());
  let inchValue = (totalInchFromCm ?? 0) % 12;

  return { feetValue, inchValue };
};
