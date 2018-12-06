import styled, { css } from 'styled-components';

const expandableTableCss = css`
  &.standard-table > thead > tr > th {
    background-color: ${({ theme }) => theme.white} !important; 
    &.sortable {
      &:after {
        position: static !important;
        padding-left: 10px;
      }
    }  
  }

  &.standard-table > tbody > tr {
    > td {
      border-bottom: 1px solid ${({ theme }) => theme.black14};
    }

    &:nth-child(4n + 1):hover > td,
    &:nth-child(4n + 2):hover > td,
    &:nth-child(4n + 3):hover > td,
    &:nth-child(4n + 4):hover > td {
      background-color: unset !important;
    }

    &:nth-child(4n + 1) td,
    &:nth-child(4n + 2) td {
      background-color: ${({ theme }) => theme.black11} !important;
    }

    &:nth-child(4n + 3) td,
    &:nth-child(4n + 4) td {
      background-color: ${({ theme }) => theme.white} !important;
    }

    &[id^='expandable'] {
      &:nth-child(4n + 1):hover,
      &:nth-child(4n + 1):hover > td,
      &:nth-child(4n + 2):hover,
      &:nth-child(4n + 2):hover > td {
        background-color: ${({ theme }) => theme.black11} !important;
      }

      &:nth-child(4n + 3):hover,
      &:nth-child(4n + 3):hover > td,
      &:nth-child(4n + 4):hover,
      &:nth-child(4n + 4):hover > td {
        background-color: ${({ theme }) => theme.white} !important;
      }
    }
  }
`;

const clearOnHoverCss = css`
  &.standard-table > thead > tr:hover,
  &.standard-table > thead > tr:hover > th {
    background-color: inherit !important;
  }
`;

export const StyledTable = styled.table`
  background-color: unset !important;
  ${({ isExpandable }) => isExpandable && expandableTableCss} ${({ clearOnHover }) =>
  clearOnHover && clearOnHoverCss};
`;

export const StyledTh = styled.th`
  ${props => {
    if (
      props.thProps &&
      props.thProps.color &&
      Object.keys(props.theme).includes(props.thProps.color)
    ) {
      return {
        ...props.thProps,
        color: `${props.theme[props.thProps.color]} !important`
      };
    }
    return props.thProps;
  }};
`;
