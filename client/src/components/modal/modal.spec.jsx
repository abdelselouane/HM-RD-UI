/* global describe, beforeAll, it, expect, jest */
import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Modal, { SuccessModal, FailureModal, ConfirmationModal, InfoModal } from './index';

describe('<Modal />', () => {
  let modalWrapper;
  let modalProps;

  beforeAll(() => {
    modalProps = {
      isOpen: true,
      title: {
        className: 'mockClassNameTitle',
        text: 'mockTitle',
        icon: 'mockIcon'
      },
      content: {
        className: 'mockClassNameContent',
        text: 'mockContent'
      },
      buttons: [
        {
          className: 'mockClassNameButton',
          text: 'mockButton',
          onClick: jest.fn()
        }
      ]
    };

    modalWrapper = shallow(<Modal {...modalProps} />);
  });

  it('should render properly', () => {
    expect(toJson(modalWrapper)).toMatchSnapshot();
  });

  it('should call button function on click', () => {
    const spy = jest.spyOn(modalProps.buttons[0], 'onClick');
    modalWrapper
      .find(`.button.${modalProps.buttons[0].className}`)
      .simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  describe('ReceiveParts Modals', () => {
    describe('<InfoModal />', () => {
      let props;
      let wrapper;
      const partsDetailsColumns = [
        {
          name: 'Part Number',
          key: 'partNbr'
        }, {
          name: 'Description',
          key: 'partDescription'
        }, {
          name: 'Location',
          key: 'location'
        }, {
          name: 'Received Quantity',
          key: 'receivedQuantity'
        }, {
          name: 'Receiving',
          key: 'receive'
        }
      ];

      const mockPart1 = {
        partNbr: '310-0101',
        brandNbr: 1001,
        brandName: 'MAKITA',
        partLocation: '',
        quantityOrdered: 1,
        partDescription: 'GASKET, TRANSMISSION',
        partsOrderDetailId: 1,
        previousQuantityReceived: 1,
        currentQuantityReceived: 0,
        key: 'row-1',
        location: 'A1',
        receivedQuantity: 1,
        receive: ''
      };

      const mockPart2 = {
        partNbr: '310-0102',
        brandNbr: 1001,
        brandName: 'MAKITA',
        partLocation: '',
        quantityOrdered: 10,
        partDescription: 'GASKET, TRANSMISSION-2',
        partsOrderDetailId: 2,
        previousQuantityReceived: 1,
        currentQuantityReceived: 0,
        key: 'row-2',
        location: 'A2',
        receivedQuantity: 2,
        receive: ''
      };
      
      const mockPart3 = {
        partNbr: '310-0105',
        brandNbr: 1001,
        brandName: 'MAKITA',
        partLocation: '',
        quantityOrdered: 10,
        partDescription: 'GASKET, TRANSMISSION-2',
        partsOrderDetailId: 2,
        previousQuantityReceived: 1,
        currentQuantityReceived: 0,
        key: 'row-3',
        location: 'A2',
        receivedQuantity: 2,
        receive: ''
      };

      const mockPart4 = {
        partNbr: '310-0106',
        brandNbr: 1001,
        brandName: 'MAKITA',
        partLocation: '',
        quantityOrdered: 10,
        partDescription: 'GASKET, TRANSMISSION-2',
        partsOrderDetailId: 2,
        previousQuantityReceived: 1,
        currentQuantityReceived: 0,
        key: 'row-4',
        location: 'A2',
        receivedQuantity: 2,
        receive: ''
      };

      const mockPart5 = {
        partNbr: '310-0107',
        brandNbr: 1001,
        brandName: 'MAKITA',
        partLocation: '',
        quantityOrdered: 10,
        partDescription: 'GASKET, TRANSMISSION-2',
        partsOrderDetailId: 2,
        previousQuantityReceived: 1,
        currentQuantityReceived: 0,
        key: 'row-5',
        location: 'A2',
        receivedQuantity: 2,
        receive: ''
      };


      const mockPart1Ar = [mockPart1, mockPart2];
      const mockPart2Ar = [mockPart1, mockPart2, mockPart3, mockPart4, mockPart5];
      beforeAll(() => {
        props = {
          onPrimaryClick: jest.fn(),
          onSecondaryClick: jest.fn(),
          columns: partsDetailsColumns,
          rows: mockPart1Ar,
          selectedPurchaseOrderNbr: '9710700001'
        };

        wrapper = mount(<InfoModal {...props} />);
      });

      it('should render properly', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('should render properly with 5 rows', () => {
        wrapper.setProps({ rows: mockPart2Ar });
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('should call click functions on appropriate button clicks', () => {
        const secondaryClickSpy = jest.spyOn(props, 'onSecondaryClick');
        wrapper.find('#cancel').simulate('click');
        expect(secondaryClickSpy).toHaveBeenCalled();

        const primaryClickSpy = jest.spyOn(props, 'onPrimaryClick');
        wrapper.find('#receive-part').simulate('click');
        expect(primaryClickSpy).toHaveBeenCalled();

        const closeButtonClickSpy = jest.spyOn(props, 'onSecondaryClick');
        wrapper.find('.icon_close').simulate('click');
        expect(closeButtonClickSpy).toHaveBeenCalled();

      });
    });
  });

  describe('OrderParts Modals', () => {
    describe('<ConfirmationModal />', () => {
      let props;
      let wrapper;

      beforeAll(() => {
        props = {
          onPrimaryClick: jest.fn(),
          onSecondaryClick: jest.fn()
        };

        wrapper = mount(<ConfirmationModal {...props} />);
      });

      it('should render properly', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('should call click functions on appropriate button clicks', () => {
        const secondaryClickSpy = jest.spyOn(props, 'onSecondaryClick');
        wrapper.find('.grey#no-edit-order').simulate('click');
        expect(secondaryClickSpy).toHaveBeenCalled();

        const primaryClickSpy = jest.spyOn(props, 'onPrimaryClick');
        wrapper.find('.yellow-primary#yes').simulate('click');
        expect(primaryClickSpy).toHaveBeenCalled();
      });
    });

    describe('<FailureModal />', () => {
      let props;
      let wrapper;

      beforeAll(() => {
        props = {
          onPrimaryClick: jest.fn(),
          onSecondaryClick: jest.fn()
        };

        wrapper = mount(<FailureModal {...props} />);
      });

      it('should render properly', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('should call click functions on appropriate button clicks', () => {
        const secondaryClickSpy = jest.spyOn(props, 'onSecondaryClick');
        wrapper.find('.red#return-to-parts-cart').simulate('click');
        expect(secondaryClickSpy).toHaveBeenCalled();

        const primaryClickSpy = jest.spyOn(props, 'onPrimaryClick');
        wrapper.find('.red-primary#return-to-homepage').simulate('click');
        expect(primaryClickSpy).toHaveBeenCalled();
      });
    });

    describe('<SuccessModal />', () => {
      let props;
      let wrapper;

      beforeAll(() => {
        props = {
          onPrimaryClick: jest.fn(),
          onSecondaryClick: jest.fn()
        };

        wrapper = mount(<SuccessModal {...props} />);
      });

      it('should render properly', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      it('should call click functions on appropriate button clicks', () => {
        const secondaryClickSpy = jest.spyOn(props, 'onSecondaryClick');
        wrapper.find('.green#view-order-history').simulate('click');
        expect(secondaryClickSpy).toHaveBeenCalled();

        const primaryClickSpy = jest.spyOn(props, 'onPrimaryClick');
        wrapper.find('.green-primary#return-to-homepage').simulate('click');
        expect(primaryClickSpy).toHaveBeenCalled();
      });
    });
  });
});
