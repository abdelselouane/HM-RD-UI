/* global beforeAll, describe, expect, it, jest */
import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

import Row from './row';
import StyledTd from './styles';

describe('<Row />', () => {
  let props;
  let wrapper;

  beforeAll(() => {
    props = {
      onClick: jest.fn(),
      columns: [
        {
          name: 'Part Number',
          key: 'partNumber',
          tdProps: { fontStyle: 'italic' }
        },
        {
          name: '',
          key: 'expandButton',
          tdProps: { fontStyle: 'italic' }
        }
      ],
      row: {
        selected: false,
        key: 'ab-1234',
        partNumber: 'ab-1234',
        exapndButton: <i className="icon_plus" />,
        ediFlag: 'N'
      },
      showCheckbox: true
    };

    wrapper = shallow(<Row {...props} />);
  });

  it('should render the tableRow', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render styles properly', () => {
    expect(toJson(shallow(<StyledTd />))).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <StyledTd tdProps={{ color: 'orange' }} theme={{ orange: '#000' }} />
        )
      )
    ).toMatchSnapshot();
  });

  it('should render the checkbox if showCheckbox is true', () => {
    wrapper.setProps({ showCheckbox: true });
    expect(wrapper.find('td.checkbox-col [role="checkbox"]')).toHaveLength(1);
  });

  it('should not render the checkbox if showCheckbox is falsey', () => {
    wrapper.setProps({ showCheckbox: false });
    expect(wrapper.find('[role="checkbox"]')).toHaveLength(0);
  });

  it('should render the checkbox as checked if selected is true', () => {
    wrapper.setProps({
      showCheckbox: true,
      row: { ...props.row, selected: true, ediFlag: 'Y' }
    });
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]').prop('aria-checked')
    ).toBe('true');
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]').prop('aria-disabled')
    ).toBe('false');
  });

  it('should render the checkbox as not checked if selected is false', () => {
    wrapper.setProps({
      showCheckbox: true,
      row: { ...props.row, selected: false, ediFlag: 'Y' }
    });
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]').prop('aria-checked')
    ).toBe('false');
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]').prop('aria-disabled')
    ).toBe('false');
  });

  it('should render the column with classname set to col.name-col', () => {
    expect(wrapper.find('.part-number-col')).toHaveLength(1);
  });

  it('should render the row property with col.key', () => {
    expect(wrapper.find('.part-number-col').prop('children')).toBe('ab-1234');
  });

  it('should call onClick on tr click event', () => {
    wrapper.setProps({
      row: {
        ...props.row,
        selected: false,
        key: 'ab-1234',
        partNumber: 'ab-1234',
        ediFlag: 'N'
      }
    });
    const spy = jest.spyOn(props, 'onClick');
    wrapper.find('tr').simulate('click');
    expect(spy).toHaveBeenCalledWith(props.row);
    spy.mockReset();
    spy.mockRestore();
  });

  it('should wrap displayData with span with title defined, if useTitle is true on col', () => {
    wrapper.setProps({
      columns: [
        {
          name: 'Part Number',
          key: 'partNumber',
          useTitle: true
        }
      ]
    });

    expect(wrapper.find('.part-number-col').prop('children').type).toBe('span');
    expect(wrapper.find('.part-number-col').prop('children').props.title).toBe(
      'ab-1234'
    );
    expect(
      wrapper.find('.part-number-col').prop('children').props.children
    ).toBe('ab-1234');
  });

  it('should display cellData if it is not a string', () => {
    wrapper.setProps({
      columns: [
        {
          name: 'Part Number',
          key: 'partNumber'
        }
      ],
      row: {
        selected: false,
        key: 'ab-1234',
        partNumber: <em>mock</em>
      }
    });
    expect(
      wrapper.find('.part-number-col').prop('children').props.children
    ).toBe('mock');
  });

  it('should render the checkbox as not checked and disabled if ediFlag is false', () => {
    wrapper.setProps({
      showCheckbox: true,
      row: { ...props.row, ediFlag: 'N', selected: false }
    });
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]').prop('aria-checked')
    ).toBe('false');
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]').prop('aria-disabled')
    ).toBe('true');
  });

  it('should not render the checkbox and disable the row if ediFlag is false', () => {
    wrapper.setProps({
      showCheckbox: false,
      row: { ...props.row, ediFlag: 'N', selected: false }
    });
    expect(
      wrapper.find('td.checkbox-col [role="checkbox"]')).toHaveLength(0);
  });

  it('should use col.key in td className if col.name is empty string', () => {
    const mountWrapper = mount(<table><tbody><Row {...props} /></tbody></table>);
    expect(mountWrapper.find('td.expand-button-col')).toHaveLength(1);
  });
});
