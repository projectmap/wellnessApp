import moment from 'moment';

// moment updateLocale function to format date according to the design
moment.updateLocale('en', {
  relativeTime: {
    past: '%s',
    s: 'just now',
    ss: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    w: '1w',
    ww: '%dw',
    M: '1Mon',
    MM: '%dMon',
    y: '1Year',
  },
});

//returns the time or date from now
export const timeFormat = (time: Date) => {
  return moment(time).fromNow();
};
