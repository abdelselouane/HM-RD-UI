/* global browser */
const {
  performLogin,
  performLogout,
  checkIsOnLogin,
  checkIsOnHome
} = require('../specHelpers');

describe('Login', () => {
  beforeEach(() => {
    browser.url('./');
    browser.waitForText('[data-reactroot]');
  });

  describe('header component', () => {
    it('should exist', () => {
      expect(browser.getText('.product-info')).toContain('Repair Depot');
      expect(browser.isExisting('i.icon_homedepot')).toBe(true);
      expect(browser.isExisting('.header-search')).toBe(true);
      expect(browser.isExisting('.header-actions')).toBe(true);
    });
  });

  describe('login', () => {
    it('should go to home page when login credentials is valid', () => {
      performLogin();
      checkIsOnHome();
      performLogout();
    });

    it('should stay on login when login credentials is invalid', () => {
      browser.setValue('#storeNumber', '');
      browser.setValue('#username', '');
      browser.setValue('#password', '');
      browser.element('#loginBtn').click();
      browser.pause(500);
      checkIsOnLogin();

      browser.setValue('#storeNumber', '');
      browser.setValue('#username', 'testuser');
      browser.setValue('#password', 'test');
      browser.element('#loginBtn').click();
      browser.pause(500);
      checkIsOnLogin();


      browser.setValue('#storeNumber', '1111');
      browser.element('#loginBtn').click();
      browser.pause(500);
      checkIsOnLogin();

      expect(browser.isExisting('.banner.error.open')).toBe(true);
      expect(browser.getText('.banner.error.open .message'))
        .toBe('Invalid credentials: The information you provided did not match. Please try again.');

      expect(browser.getValue('#storeNumber')).toBe('');
      expect(browser.getValue('#username')).toBe('');
      expect(browser.getValue('#password')).toBe('');
    });

    it('should close the error message when clicking close on invalid login', () => {
      browser.setValue('#storeNumber', '111');
      browser.setValue('#username', 'testuser');
      browser.setValue('#password', 'test');
      browser.element('#loginBtn').click();
      browser.pause(500);
      checkIsOnLogin();
      expect(browser.isExisting('.banner.error.open')).toBe(true);
      browser.element('.banner.error.open .close').click();
      expect(browser.isExisting('.banner.error.open')).toBe(false);
    });

    it('should close the error message when user types invalid login and then enter valid login credientails', () => {
      browser.setValue('#storeNumber', '111');
      browser.setValue('#username', 'testuser');
      browser.setValue('#password', 'test');
      browser.element('#loginBtn').click();
      browser.pause(500);
      expect(browser.isExisting('.banner.error.open')).toBe(true);

      browser.setValue('#storeNumber', '111');
      browser.setValue('#username', 'a');
      browser.setValue('#password', 'a');
      browser.element('#loginBtn').click();
      browser.pause(500);

      expect(browser.isExisting('.banner.error.open')).toBe(false);
    });
  });
});
