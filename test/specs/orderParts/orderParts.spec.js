/* global browser, beforeEach, describe, afterEach, it, expect */
const {
  performLogout,
  performLogin,
  checkIsOnHome,
  checkIsOnOrderHistory,
  navigateToOrderParts,
  click
} = require('../specHelpers');

describe('Order Parts', () => {
  beforeEach(() => {
    browser.url('./');
    browser.waitForText('[data-reactroot]');
    performLogin();
    navigateToOrderParts();
  });

  afterEach(() => {
    performLogout();
  });

  describe('OrderParts Page', () => {
    it('should go to the home page when users clicks return to Home button', () => {
      browser.element('.breadcrumb-nav #home').click();
      checkIsOnHome();
    });

    it('should show no results in table if search input is blank or less than 2 characters', () => {
      browser.setValue('.text-input-container .part-search', '');
      expect(browser.isExisting('.table-body tbody tr')).toBe(false);

      browser.setValue('.text-input-container .part-search', 'a');
      expect(browser.isExisting('.table-body tbody tr')).toBe(false);
    });

    it('should show results in table if search input is 2 or more characters and the part exists', () => {
      browser.setValue('.text-input-container .part-search', 'bc');
      browser.pause(500);
      expect(browser.isExisting('.table-body tbody tr')).toBe(true);

      browser.setValue('.text-input-container .part-search', 'mr');
      browser.pause(500);
      expect(browser.isExisting('.table-body tbody tr')).toBe(true);
    });

    it('should show display error in page if search input is 2 and service returns error', () => {
      browser.setValue('.text-input-container .part-search', 'mockError');
      browser.pause(500);
      expect(browser.isExisting('.banner.error.open')).toBe(true);
    });

    it("should show 'No results found' text when search input is greater than 2 but no results", () => {
      browser.setValue('.text-input-container .part-search', 'bcx');
      browser.pause(500);
      expect(browser.isExisting('.no-results')).toBe(true);
    });

    it('should able to select and deselect a part', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');
      browser.element('.table-body tr:first-child').click();
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('false');
    });

    it('should show disabled row for the parts having EDI-flag with No and show information banner on click', () => {
      browser.setValue('.text-input-container .part-search', 'MRCS');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('false');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-disabled')).toBe('true');
      browser.element('.table-body tr:first-child').click();
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('false');
      expect(browser.isExisting('.banner.information.open')).toBe(true);
      expect(browser.isExisting('.cart-item:first-child .part-nbr')).toBe(false);
    });

    it('should able to select a part, make a new search, return to previous and have part still selected', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');

      browser.setValue('.text-input-container .part-search', '31');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('false');

      browser.setValue('.text-input-container .part-search', 'bc1300');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');
    });

    it('should able to select a part and remove it by clicking the remove on cart item remove button', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');

      browser.element('.cart-item:first-child .remove-btn').click();

      expect(browser.isExisting('.cart-item:first-child .part-nbr')).toBe(false);
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('false');
    });

    it('should add multiple parts from multiple searches to the cart', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();
      browser.setValue('.text-input-container .part-search', '310-0081');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');
      expect(browser.getText('.cart-item:last-child .part-nbr')).toBe('310-0081');
    });

    it('should not be able to click on submit order button unless cart has at least one item', () => {
      expect(browser.getAttribute('.submit-order', 'disabled')).toBe('true');

      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();

      expect(browser.getAttribute('.submit-order', 'disabled')).toBe(null);
    });

    it('should clear results and cart if navigate back to home', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.element('.table-body tr:first-child').click();

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');

      browser.element('.breadcrumb-nav #home').click();

      browser.keys(['Enter']);

      expect(browser.isExisting('.table-body tr:first-child')).toBe(false);
      expect(browser.isExisting('.cart-item:first-child')).toBe(false);
    });

    it('should increment/decrement the quantity when click on "+/-" button', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');

      browser.click('#bc1300-inc');
      expect(browser.getValue('#bc1300-qty')).toBe('02');

      browser.click('#bc1300-dec');
      expect(browser.getValue('#bc1300-qty')).toBe('01');
    });

    it('should not be able to edit the input quantity by the textbox edit ', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');

      expect(browser.getAttribute('#bc1300-qty', 'readonly')).toBe('true');
    });

    it('should not allow increments passed the quantity limit', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');

      click('#bc1300-inc', 11);
      expect(browser.getValue('#bc1300-qty')).toBe('10');
    });

    it('should not allow decrements passed the quantity minimum', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      expect(browser.getAttribute('tr:first-child [role=checkbox]', 'aria-checked')).toBe('true');

      expect(browser.getText('.cart-item:first-child .part-nbr')).toBe('BC1300');

      click('#bc1300-dec', 10);
      expect(browser.getValue('#bc1300-qty')).toBe('01');
    });

    it('should display confirmation dialog for PartsOrder', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');     
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      browser.click('.submit-order');    
      expect(browser.getText('.card-title')).toBe('Submit?');
    });

    it('should display purchaseOrderFailure dialog for PartsOrder failure', () => {
      browser.setValue('.text-input-container .part-search', '330-0070');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      browser.click('.submit-order');
      browser.click('.button#yes');
      browser.pause(200);
      expect(browser.getText('.card-title')).toBe('Parts Order Submission Failed');
    });

    it('should display submittedParts dialog for PartsOrder', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      browser.click('.submit-order');
      browser.click('.button#yes');
      browser.pause(200);
      expect(browser.getText('.card-title')).toBe('Success!');
    });

    it('should return user to home on ReturnToHomeClick in submittedParts dialog for PartsOrder', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      browser.click('.submit-order');
      browser.click('.button#yes');
      browser.pause(200);
      browser.click('.button#return-to-homepage');
      checkIsOnHome();
    });

    it('should return user to Parts Order History Page on View Parts Order history in submittedParts dialog for PartsOrder', () => {
      browser.setValue('.text-input-container .part-search', 'bc1300');
      browser.pause(500);
      browser.click('.table-body tr:first-child');
      browser.click('.submit-order');
      browser.click('.button#yes');
      browser.pause(200);
      browser.click('.button#view-order-history');
      checkIsOnOrderHistory();
    });
  });
});
