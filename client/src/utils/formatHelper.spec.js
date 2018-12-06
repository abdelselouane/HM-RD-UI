/* global describe, expect, it */
import dateformat from 'dateformat';

import * as formatHelper from './formatHelper';

describe('formatHelper', () => {
  describe('decodeHtml', () => {
    it('should decode encoded html strings', () => {
      const input = '&apos;';
      expect(formatHelper.decodeHtml(input)).toBe("'");
    });
  });

  describe('getFormattedDate', () => {
    it('should format today\'s date to a the default format ', () => {
      expect(formatHelper.getFormattedDate()).toBe(
        dateformat(new Date(), 'mmm dd, yyyy')
      );
    });
  });
});
