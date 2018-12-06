import styled from 'styled-components';

const StyledTd = styled.td`
  ${props => {
    if (props.tdProps
      && props.tdProps.color
      && Object.keys(props.theme).includes(props.tdProps.color)) {
      return {
        ...props.tdProps,
        color: `${props.theme[props.tdProps.color]} !important`
      };
    }
    if (props.disableRow) {
      return {
        ...props.tdProps,
        color: `${props.theme.black14} !important`
      };
    }
    return props.tdProps;
  }}
`;

export default StyledTd;
