/* global browser, beforeEach, describe, afterEach, it, expect */
const {
  navigateToOrderHistory,
  performCreateOrder,
  performLogin,
  performLogout
} = require('../specHelpers');

describe('Order History', () => {
  describe('Without Orders', () => {
    beforeEach(() => {
      browser.url('./');
      browser.waitForText('[data-reactroot]');
      performLogin('1234');
    });

    it('should show no results if no results are partsOrders are available', () => {
      navigateToOrderHistory();
      expect(browser.isExisting('.no-results'));
    });
  });

  describe('With Orders', () => {
    beforeEach(() => {
      browser.url('./');
      browser.waitForText('[data-reactroot]');
      performLogin();
    });

    afterEach(() => {
      performLogout();
    });

    it('should be able to navigate to order parts', () => {
      navigateToOrderHistory();
    });

    it('should show the most recently ordered part at the top of the order parts table', () => {
      performCreateOrder('713', 'mockWorkOrderNumber'); // Part Description SHOE
      navigateToOrderHistory();
      const orderDescCol = browser.getText('td.order-description-col');
      if (typeof orderDescCol === 'string') {
        expect(orderDescCol).toBe('BLADE GAUGE');
      } else {
        expect(orderDescCol[0]).toBe('BLADE GAUGE');
      }

      const workOrderNumberCol = browser.getText('td.work-order-number-col');
      if (typeof workOrderNumberCol === 'string') {
        expect(workOrderNumberCol).toBe('mockWorkOrderNumber');
      } else {
        expect(workOrderNumberCol[0]).toBe('mockWorkOrderNumber');
      }
    });

    it('should show Not Provided for non provided work order number orders', () => {
      performCreateOrder('BC', ''); // Part Description SHOE
      navigateToOrderHistory();
      const workOrderNumberCol = browser.getText('td.work-order-number-col');
      if (typeof workOrderNumberCol === 'string') {
        expect(workOrderNumberCol).toBe('Not Provided');
      } else {
        expect(workOrderNumberCol[0]).toBe('Not Provided');
      }
    });

    it('should be able to click row and navigate to Order Details', () => {
      performCreateOrder('BC', '');
      navigateToOrderHistory();
      browser.click('tbody tr');
      browser.pause(200);
      expect(browser.isExisting('.order-details'));
    });

    it('should be able to click back from Order Details to return to Order History', () => {
      performCreateOrder('BC', '');
      navigateToOrderHistory();
      browser.click('tbody tr');
      browser.pause(200);
      expect(browser.isExisting('.order-details'));
      browser.click('.breadcrumb-nav #order-history');
      expect(browser.isExisting('.order-history'));
    });
  });
});
