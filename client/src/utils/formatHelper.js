import unescape from 'lodash.unescape';
import replace from 'lodash.replace';
import dateformat from 'dateformat';

export const decodeHtml = encodedText =>
  replace(unescape(encodedText), '&apos;', "'");

export const getFormattedDate = (date, formatStr = 'mmm dd, yyyy') => {
  if (!date) {
    return dateformat(new Date(), formatStr);
  }
  return dateformat(date.split('-'), formatStr);
};

export default decodeHtml;
