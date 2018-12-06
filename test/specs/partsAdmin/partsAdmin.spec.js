const {
  navigateToPartsAdmin,
  performLogin,
  performLogout
} = require('../specHelpers');

describe('PartsAdmin', () => {
  beforeEach(() => {
    browser.url('./');
    browser.waitForText('[data-reactroot]');
    performLogin();
  });

  afterEach(() => {
    performLogout();
  });

  it('should be able to navigate to Admin', () => {
    navigateToPartsAdmin();
  });

});