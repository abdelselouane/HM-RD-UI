/* global beforeAll, describe, expect, it, jest */
import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import Table from './table';
import Row from './row';
import * as Styles from './styles';

describe('<Table />', () => {
  let wrapper;
  let props;

  beforeAll(() => {
    props = {
      columns: [
        {
          name: 'Mock Column',
          key: 'mockColumn',
          sortable: true,
          orderBy: {
            className: 'ascending',
            key: 'mockColumn'
          }
        }
      ],
      rows: [
        {
          key: 'abc-1234',
          selected: false,
          mockColumn: 'abc-1234'
        }
      ],
      handleRowClick: jest.fn(),
      handleSortClick: jest.fn()
    };

    wrapper = shallow(<Table {...props} />);
  });

  it('should render properly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ isAlternating: false });
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ isExpandable: true });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    Object.values(Styles).forEach(Component => {
      expect(toJson(shallow(<Component />))).toMatchSnapshot();
    });
    expect(
      toJson(shallow(<Styles.StyledTh tdProps={{ color: 'orange' }} theme={{ orange: '#000' }} />))
    ).toMatchSnapshot();
  });

  it('should call handleSortClick method when column header is clicked', () => {
    expect(wrapper.find('.standard-table thead tr .sortable')).toHaveLength(1);
    const spy = jest.spyOn(props, 'handleSortClick');
    wrapper.find('.standard-table thead tr .sortable').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should render header if showHeader set to true', () => {
    wrapper.setProps({ showHeader: true });
    expect(wrapper.find('.table-header thead')).toHaveLength(1);
  });

  it('should render header if showHeader set to false', () => {
    wrapper.setProps({ showHeader: false });
    expect(wrapper.find('.table-header thead')).toHaveLength(0);
  });

  it('should render checkbox column if showCheckbox set to true', () => {
    wrapper.setProps({ showHeader: true, showCheckbox: true });
    expect(wrapper.find('.table-header .checkbox-col')).toHaveLength(1);
  });

  it('should render checkbox column if showCheckbox set to false', () => {
    wrapper.setProps({ showHeader: true, showCheckbox: false });
    expect(wrapper.find('.table-header .checkbox-col')).toHaveLength(0);
  });

  it('should set the table header classname if classname is defined', () => {
    wrapper.setProps({ showHeader: true, className: 'mock-class' });
    expect(wrapper.find('.table-header.mock-class')).toHaveLength(1);
  });

  it('should set the th classname', () => {
    wrapper.setProps({ showHeader: true });
    expect(wrapper.find(Styles.StyledTh)).toHaveLength(1);
  });

  it('should set the scrollable-table style if showResults is false', () => {
    wrapper.setProps({ showResults: true });
    expect(wrapper.find('.scrollable-table').prop('style')).toMatchObject({});
  });

  it('should set the scrollable-table style if showResults is false', () => {
    wrapper.setProps({ showResults: false });
    expect(wrapper.find('.scrollable-table').prop('style')).toMatchObject({
      overflowY: 'hidden'
    });
  });

  it('should set the table body classname if classname is defined', () => {
    wrapper.setProps({ className: 'mock-class' });
    expect(wrapper.find('.table-body.mock-class')).toHaveLength(1);
  });

  it('should render no results table row if showResults is false', () => {
    wrapper.setProps({ showResults: false });
    expect(wrapper.find('tr td.no-results')).toHaveLength(1);
  });

  it('should render Row component if showResults is true', () => {
    wrapper.setProps({ showResults: true });
    expect(wrapper.find(Row)).toHaveLength(1);
  });

  it('should not render Row component if showResults is true and rows are empty', () => {
    wrapper.setProps({ showResults: true, rows: [] });
    expect(wrapper.find(Row)).toHaveLength(0);
  });
});
