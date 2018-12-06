/* global describe, beforeAll, it, expect */
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import { Card, Row, Col, Title, Label } from './styles';

import DetailsCard from './index';

describe('<DetailsCard />', () => {
  let wrapper;
  let props;

  beforeAll(() => {
    props = {
      purchaseOrderNbr: '971070001',
      purchaseOrderStatDesc: 'SUBMITTED',
      parts: [
        {
          partDescription: 'mockDescription3',
          partNbr: 'abc-123',
          brandName: 'mockbrand',
          quantity: 1
        },
        {
          partDescription: 'mockDescription4',
          partNbr: 'cba-321',
          brandName: 'mockbrand',
          quantity: 2
        }
      ]
    };

    wrapper = shallow(<DetailsCard {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    [Card, Row, Col, Title, Label].forEach(Component => {
      expect(toJson(shallow(<Component flex="0" />))).toMatchSnapshot();
    });
  });
});
