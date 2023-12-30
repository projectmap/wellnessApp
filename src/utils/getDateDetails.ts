const monthArray = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let today = new Date();

export const getDateDetails = () => {
  let requiredDate = {
    day: '',
    dayName: '',
    monthName: '',
    year: '',
  };
  requiredDate.monthName = monthArray[today.getMonth()];
  requiredDate.day = ' ' + today.getDate() + ' ';
  requiredDate.year = ' ' + today.getFullYear() + ' ';
  requiredDate.dayName = dayArray[today.getUTCDay()];

  return requiredDate;
};
