import moment from 'moment';

export const getDurationHMS = (timeInSec: number) => {
  let durationHMS = {
    hour: '',
    min: '',
    sec: '',
  };
  durationHMS.hour =
    moment
      .utc(+timeInSec * 1000)
      .format('HH:mm:ss')
      .slice(0, 2) === '00'
      ? ''
      : moment
          .utc(+timeInSec * 1000)
          .format('HH:mm:ss')
          .slice(0, 2) + 'h ';
  durationHMS.min =
    moment
      .utc(+timeInSec * 1000)
      .format('HH:mm:ss')
      .slice(3, 5) === '00' && durationHMS.hour === ''
      ? ''
      : moment
          .utc(+timeInSec * 1000)
          .format('HH:mm:ss')
          .slice(3, 5) + 'm ';
  durationHMS.sec =
    moment
      .utc(+timeInSec * 1000)
      .format('HH:mm:ss')
      .slice(6, 8) + 's';

  return durationHMS;
};
