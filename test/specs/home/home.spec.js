/* global browser, describe, beforeEach, afterEach, it, expect */
const {
  performLogin,
  performLogout,
  checkIsOnHome
} = require('../specHelpers');

describe('Home', () => {
  beforeEach(() => {
    browser.url('./');
    browser.waitForText('[data-reactroot]');
    performLogin();
  });

  afterEach(() => {
    performLogout();
  });

  describe('header component', () => {
    it('should exist with username and logout button', () => {
      checkIsOnHome();
      expect(browser.getText('.header-actions .username')).toBe('asm001');
      expect(browser.isExisting('.logout-btn')).toBe(true);
    });
  });

  describe('landing page', () => {
    it('should go to partsFinderUrl when users clicks parts finder', () => {
      checkIsOnHome();
      browser.element('.repair-tile.parts-search').click();
      browser.pause(500);

      const [repairDepotUrl, fideltoneUrl] = browser.getTabIds();
      browser.switchTab(fideltoneUrl);
      expect(browser.getUrl()).toBe('https://thdqa.fidelitonebtb.com/rms/ems');

      browser.switchTab(repairDepotUrl);
      expect(browser.getText('.product-info')).toContain('Repair Depot');
    });

    it('should go to partsFinderUrl when users presses enter on parts finder tile', () => {
      checkIsOnHome();
      browser.keys(['Enter']);
      browser.pause(500);

      const [repairDepotUrl, fideltoneUrl] = browser.getTabIds();
      browser.switchTab(fideltoneUrl);
      expect(browser.getUrl()).toBe('https://thdqa.fidelitonebtb.com/rms/ems');

      browser.switchTab(repairDepotUrl);
      expect(browser.getText('.product-info')).toContain('Repair Depot');
    });

    it('should go to workOrders Page when users presses enter on work orders tile', () =>  {
      checkIsOnHome();
      browser.keys(['ArrowRight', 'Enter']);
      browser.pause(500);
      expect(browser.getText('.workOrders-text')).toContain('Work Order Search');
    });

    it('should go to orderParts Page when users presses enter on order parts tile', () => {
      checkIsOnHome();
      browser.keys(['ArrowRight', 'ArrowRight', 'Enter']);
      browser.pause(500);
      expect(browser.getText('.work-order-number-label')).toContain(
        'Work Order Number'
      );
      expect(browser.getText('.cart-header-title')).toContain('Parts Cart');
    });

    it('should go to Order History tile when users press right arrow from Order Parts tile ', () => {
      checkIsOnHome();
      browser.keys(['ArrowRight', 'ArrowRight']);
      expect(browser.isExisting('.tile-active.order-parts')).toBe(true);
      browser.keys(['ArrowRight']);
      expect(browser.isExisting('.tile-active.order-history')).toBe(true);
    });

    it('should go to Inventory tile when users press left arrow from Order Parts tile ', () => {
      checkIsOnHome();
      expect(browser.isExisting('.tile-active.parts-search')).toBe(true);
    });

    it('should go to Parts Finder tile when users press right arrow 4 times from  Parts Finder tile ', () => {
      checkIsOnHome();
      expect(browser.isExisting('.tile-active.parts-search')).toBe(true);
      browser.keys(['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight','ArrowRight']);
      expect(browser.isExisting('.tile-active.parts-search')).toBe(true);
    });

    it('should go to order history when users clicks on order history tile', () => {
      checkIsOnHome();
      browser.element('.repair-tile.order-history').click();
      expect(browser.isExisting('.order-history-page')).toBe(true);
    });

    it('should go to Parts Search tile when users press left arrow from Order Parts tile ', () => {
      checkIsOnHome();
      browser.keys(['ArrowRight', 'ArrowRight']);
      expect(browser.isExisting('.tile-active.order-parts')).toBe(true);
      browser.keys(['ArrowLeft', 'ArrowLeft']);
      expect(browser.isExisting('.tile-active.parts-search')).toBe(true);
    });

    it('should go to Order History tile when users press left arrow from Parts Finder tile ', () => {
      checkIsOnHome();
      expect(browser.isExisting('.tile-active.parts-search')).toBe(true);
      browser.keys('ArrowLeft');
      expect(browser.isExisting('.tile-active.inventory')).toBe(true);
    });
  });
});
