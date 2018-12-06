/* global browser, expect */

const performLogin = (storeNumber = '9710') => {
  browser.setValue('#storeNumber', storeNumber);
  browser.setValue('#username', 'asm001');
  browser.setValue('#password', 'testPassword!');
  browser.element('#loginBtn').click();
  browser.pause(500);
};

const performLogout = () => {
  expect(browser.isExisting('.logout-btn')).toBe(true);
  browser.element('.logout-btn').click();
};

const checkIsOnLogin = () => {
  expect(browser.isExisting('input#storeNumber')).toBe(true);
  expect(browser.isExisting('input#username')).toBe(true);
  expect(browser.isExisting('input#password')).toBe(true);
};

const checkIsOnHome = () => {
  expect(browser.isExisting('.home-page')).toBe(true);
};

const checkIsOnOrderParts = () => {
  expect(browser.isExisting('.order-parts-page')).toBe(true);
};

const checkIsOnOrderHistory = () => {
  expect(browser.isExisting('.order-history-page')).toBe(true);
};

const checkIsOnInventory = () => {
  expect(browser.isExisting('.inventory-page')).toBe(true);
};

const navigateToOrderParts = () => {
  browser.element('.repair-tile.order-parts').click();
  checkIsOnOrderParts();
};

const navigateToOrderHistory = () => {
  browser.element('.repair-tile.order-history').click();
  checkIsOnOrderHistory();
};

const navigateToInventory = () => {
  browser.element('.repair-tile.inventory').click();
  browser.pause(100);
  checkIsOnInventory();
};

const navigateToPartsAdmin = () => {
  expect(browser.isExisting('.admin-btn')).toBe(true);
  browser.element('.admin-btn').click();
  expect(browser.getUrl()).toBe('http://localhost.homedepot.com:3000/admin');
};

const performCreateOrder = (partNumber = 'bc1300', workOrderNumber = '') => {
  navigateToOrderParts();
  browser.setValue('.work-order-number-input', workOrderNumber);
  browser.setValue('.text-input-container .part-search', partNumber);
  browser.pause(200);
  browser.click('.table-body tr:first-child');
  browser.click('.submit-order');
  browser.click('.button#yes');
  browser.pause(200);
  browser.click('.button#return-to-homepage');
  checkIsOnHome();
};

const click = (selector, count) => {
  for (let i = 0; i < count; i += 1) {
    browser.click(selector);
  }
};

module.exports = {
  performLogin,
  performLogout,
  performCreateOrder,
  checkIsOnHome,
  checkIsOnLogin,
  checkIsOnOrderHistory,
  checkIsOnOrderParts,
  checkIsOnInventory,
  navigateToOrderParts,
  navigateToOrderHistory,
  navigateToInventory,
  navigateToPartsAdmin,
  click,
};
