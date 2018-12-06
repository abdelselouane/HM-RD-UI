/* global browser, beforeEach, describe, afterEach, it, expect */
const {
  navigateToInventory,
  performLogin,
  performLogout
} = require('../specHelpers');

describe('Inventory', () => {
  beforeEach(() => {
    browser.url('./');
    browser.waitForText('[data-reactroot]');
    performLogin();
  });

  afterEach(() => {
    performLogout();
  });

  describe('Receive Order', () =>{
    it('should render existing open orders', () => {
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      expect(browser.getText('tbody tr:first-child .date-created-col')).toBe("2018-06-04");
    });

    it('should render existing open orders with sortable option', () => {
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      expect(browser.getText('tbody tr:first-child .date-created-col')).toBe("2018-06-04");
      browser.click('.table-header thead tr .date-created-col.sortable');
      expect(browser.getText('tbody tr:first-child .date-created-col')).toBe("2018-07-14");
    });

    it('should open receive part modal when clicking on receive parts button and close when clicking on cancel', () =>{
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
      browser.click('tbody tr td.receive-col button');
      expect(browser.isExisting('.card.modal')).toBe(true);
      browser.click('#cancel');
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
    });

    it('should open receive part modal set the quantity to 1 then close the modal', () =>{
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
      browser.click('tbody tr td.receive-col button');
      expect(browser.isExisting('.card.modal')).toBe(true);
      browser.click('.counter-increment');
      expect(browser.getValue('.counter-value')).toBe('01');
      browser.click('#cancel');
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
    });

    it('should open receive part modal decrement the quantity by 1 then close the modal', () =>{
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
      browser.click('tbody tr td.receive-col button');
      expect(browser.isExisting('.card.modal')).toBe(true);
      browser.click('.counter-increment');
      expect(browser.getValue('.counter-value')).toBe('01');
      browser.click('.counter-decrement');
      expect(browser.getValue('.counter-value')).toBe('00');
      browser.click('#cancel');
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
    });

    it('should open receive part modal change the location then close the modal', () =>{
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
      browser.click('tbody tr td.receive-col button');
      expect(browser.isExisting('.card.modal')).toBe(true);
      expect(browser.isExisting('#location310-0101')).toBe(true);
      browser.setValue('#location310-0101', 'A12');
      browser.click('#cancel');
      expect(browser.isExisting('tbody tr td.receive-col')).toBe(true);
    });

    it('should open receive part modal change the quantity then save the modal', () =>{
      navigateToInventory();

      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      browser.click('tbody tr:first-child td.receive-col button');
      browser.click('.counter-increment');
      expect(browser.getValue('.counter-value')).toBe('01');
      browser.click('#receive-part');
      browser.pause(200);
      expect(browser.isExisting('.banner.success.open')).toBe(true);
      expect(browser.isExisting('.banner.error.open')).toBe(false);
    });

    it('should open receive part modal change the quantity then save the modal for error', () =>{
      navigateToInventory();
      browser.click('#receive-purchase-orders-tab');
      browser.pause(100);
      browser.click('tbody tr:nth-child(n+2) td.receive-col button');
      browser.click('.counter-increment');
      expect(browser.getValue('.counter-value')).toBe('01');
      browser.click('#receive-part');
      browser.pause(200);
      expect(browser.isExisting('.banner.success.open')).toBe(false);
      expect(browser.isExisting('.banner.error.open')).toBe(true);
    });

  });

  describe('Manage Inventory', () => {
    it('should switch to save mode from initial edit mode', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('.edit-col .button.tertiary.sm:first-child')[0]).toBe('Save');
    });

    it('should filter inventory rows based on searchInput', () => {
      navigateToInventory();
      expect(browser.elements('tbody td.part-number-col').value.length).toBe(2);
      browser.setValue('.text-input-container.search input', '71352031');
      expect(browser.elements('tbody td.part-number-col').value.length).toBe(1);
      browser.setValue('.text-input-container.search input', 'MRCS CUTTER SET FOR MINI-ROOTER');
      expect(browser.elements('tbody td.part-number-col').value.length).toBe(1);
    });

    it('should switch back to edit mode after clicking save', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('.edit-col .button.tertiary.sm:first-child')[0]).toBe('Save');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getAttribute('.edit-col .button.tertiary.sm i', 'class')[0]).toBe('icon_pencil');
    });

    it('should have input fields in location and on hand columns once edit is clicked', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', 'ABC');
      expect(browser.getAttribute('.location-col input', 'value')).toBe('ABC');
      browser.setValue('.available-col input', '99');
      expect(browser.getAttribute('.available-col input', 'value')).toBe('99');
    });

    it('should save edits to location and bin on save click', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', 'ABC');
      browser.setValue('.available-col input', '99');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.location-col')[0]).toBe('ABC');
      expect(browser.getText('td.available-col')[0]).toBe('99');
    });

    it('should only allow 2 digits in on hand input', () => {
      navigateToInventory();

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.available-col input', '1');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.available-col')[0]).toBe('1');

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.available-col input', '991');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.available-col')[0]).toBe('99');
    });

    it('should only allow less than 10 characters in bin input', () => {
      navigateToInventory();

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', 'A7');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.location-col')[0]).toBe('A7');

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', '12345678901');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.location-col')[0]).toBe('1234567890');
    });

    it('should be able to switch between On Hand Inventory and Receive Orders tabs', () => {
      navigateToInventory();
      // browser.click('.inventory-tabs [role=tablist] #receive-orders-tab');
      // expect(browser.getAttribute('.tabs .tabpanel.on-hand-inventory', 'hidden')).toBe('true');
      browser.click('.inventory-tabs [role=tablist] #on-hand-inventory-tab');
      expect(browser.getAttribute('.tabs .tabpanel.on-hand-inventory', 'hidden')).toBe(null);
    });

    it('should show new row on Manually Add Inventory click', () => {
      navigateToInventory();
      // Showing as actionable
      expect(browser.isExisting('.inventory-tabs button.manage-inv.primary')).toBeTruthy();
      browser.click('.inventory-tabs button.manage-inv');
      // Showing as secondary
      expect(browser.isExisting('.inventory-tabs button.manage-inv.primary')).not.toBeTruthy();
      expect(browser.isExisting('.inventory-tabs .search.dropdown.input-field')).toBeTruthy();
    });
    
    it('should switch to save mode from initial edit mode', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('.edit-col .button.tertiary.sm:first-child')[0]).toBe('Save');
    });

    it('should switch back to edit mode after clicking save', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('.edit-col .button.tertiary.sm:first-child')[0]).toBe('Save');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getAttribute('.edit-col .button.tertiary.sm i', 'class')[0]).toBe('icon_pencil');
    });

    it('should have input fields in location and on hand columns once edit is clicked', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', 'ABC');
      expect(browser.getAttribute('.location-col input', 'value')).toBe('ABC');
      browser.setValue('.available-col input', '99');
      expect(browser.getAttribute('.available-col input', 'value')).toBe('99');
    });

    it('should save edits to location and bin on save click', () => {
      navigateToInventory();
      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', 'ABC');
      browser.setValue('.available-col input', '99');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.location-col')[0]).toBe('ABC');
      expect(browser.getText('td.available-col')[0]).toBe('99');
    });

    it('should only allow 2 digits in on hand input', () => {
      navigateToInventory();

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.available-col input', '1');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.available-col')[0]).toBe('1');

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.available-col input', '991');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.available-col')[0]).toBe('99');
    });

    it('should only allow less than 10 characters in bin input', () => {
      navigateToInventory();

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', 'A7');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.location-col')[0]).toBe('A7');

      browser.click('.edit-col .button.tertiary.sm:first-child');
      browser.setValue('.location-col input', '12345678901');
      browser.click('.edit-col .button.tertiary.sm:first-child');
      expect(browser.getText('td.location-col')[0]).toBe('1234567890');
    });

    it('should show new row on Manually Add Inventory click', () => {
      navigateToInventory();
      // Showing as actionable
      expect(browser.isExisting('.inventory-tabs button.manage-inv.primary')).toBeTruthy();
      browser.click('.inventory-tabs button.manage-inv');
      // Showing as secondary
      expect(browser.isExisting('.inventory-tabs button.manage-inv.primary')).not.toBeTruthy();
      expect(browser.isExisting('.inventory-tabs .search.dropdown.input-field')).toBeTruthy();
    });

    it('should show new row on Manually Add Inventory click', () => {
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      expect(browser.isExisting('.inventory-tabs .search.dropdown.input-field')).toBeTruthy();
    });

    it('should show a dropdown when typing 2 or more characters into the part search', () => {
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', '3');
      expect(browser.isExisting('.search.dropdown ~ div .scrollable-table tr')).not.toBeTruthy();
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', '33');
      expect(browser.isExisting('.search.dropdown ~ div .scrollable-table tr')).toBeTruthy();
      expect(browser.getText('.search.dropdown ~ div .scrollable-table tr .part-number-col:first-child')).toBe('330-0070');
    });

    it('should hide dropdown when clicking outside of the dropdown and reappear when clicking back into textfield', () => {
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', '33');
      expect(browser.isExisting('.search.dropdown ~ div .scrollable-table tr')).toBeTruthy();
      browser.click('.inventory-tabs');
      expect(browser.isExisting('.search.dropdown ~ div .scrollable-table tr')).not.toBeTruthy();
      browser.click('.inventory-tabs input.search.dropdown.input-field');
      expect(browser.isExisting('.search.dropdown ~ div .scrollable-table tr')).toBeTruthy();
    });

    it('should set the values in the row when selecting the particular part in the search dropdown and the particuar part is not avaliable in the inventory', () =>{
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', '33');
      browser.click('.search.dropdown ~ div .scrollable-table tr .part-number-col:first-child');
      expect(browser.getText('td.part-number-col')[0]).toBe('330-0070');
      expect(browser.getText('td.description-col')[0]).toBe('Grip, Handle');
      expect(browser.getText('td.brand-col')[0]).toBe('GENERAL EQUIPMENT COMPANY');
      expect(browser.getText('td.total-col')[0]).toBe('');
      expect(browser.getText('td.allocated-col')[0]).toBe('');
      expect(browser.getValue('td.available-col input')).toBe('');
      expect(browser.getValue('td.location-col input')).toBe('');
    });

    it('should set the values in the row when selecting the particular part in the search dropdown and the particuar part is already avaliable in the inventory', () =>{
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', 'MRCS');
      browser.click('.search.dropdown ~ div .scrollable-table tr .part-number-col:first-child');
      expect(browser.getText('td.part-number-col')[0]).toBe('MRCS');
      expect(browser.getText('td.description-col')[0]).toBe('MRCS CUTTER SET FOR MINI-ROOTER');
      expect(browser.getText('td.brand-col')[0]).toBe('GENERAL WIRE SPRING CO');
      expect(browser.getText('td.total-col')[0]).toBe('3');
      expect(browser.getText('td.allocated-col')[0]).toBe('1');
      expect(browser.getValue('td.available-col input')).toBe('2');
      expect(browser.getValue('td.location-col input')).toBe('A1');
    });

    it('should update the particular part row entries, when saving the part', () =>{
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', 'BC1300');
      browser.click('.search.dropdown ~ div .scrollable-table tr .part-number-col:first-child');
      browser.setValue('td.available-col input', 25 );
      browser.setValue('td.location-col input', 'V11' );
      browser.click('td.edit-col button');
      browser.setValue('.text-input-container.search input', 'BC1300');
      expect(browser.getText('td.part-number-col')).toBe('BC1300');
      expect(browser.getText('td.total-col')).toBe('25');
      expect(browser.getText('td.allocated-col')).toBe('0');
      expect(browser.getText('td.available-col')).toBe('25');
      expect(browser.getText('td.location-col')).toBe('V11');
    });

    it('should show error box on avaliableQty, when saving an newTotalQty less than initialTotalQty', () =>{
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.inventory-tabs input.search.dropdown.input-field', 'BC1300');
      browser.click('.search.dropdown ~ div .scrollable-table tr .part-number-col:first-child');
      browser.setValue('td.available-col input', 10 );     
      browser.click('td.edit-col button');
      expect(browser.isExisting('.available-quantity.error')).toBeTruthy;     
    });

    it('should allow manual add when no inventory available', () => {
      performLogout();
      performLogin('9723');
      navigateToInventory();
      browser.click('.inventory-tabs button.manage-inv');
      browser.setValue('.text-input-container.search input', 'BC1300');
      expect(browser.isExisting('.search.dropdown ~ div .scrollable-table tr')).toBeTruthy();
    })
  });
});
