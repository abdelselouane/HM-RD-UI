import styled from 'styled-components';

export const Card = styled.div`
  width: 85%;
  margin-bottom: 20px;

  .card-content {
    padding: 0px 25px;
  }
`;

export const Title = styled.span`
  align-items: flex-end;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  border-bottom: solid #666 1px;
  padding-bottom: 15px;

  h2 {
    display: inline-block;
    color: #f96302;
    font-weight: 900;
    padding-right: 25px;
  }

  span {
    text-transform: capitalize;
  }
`;

export const Row = styled.div`
  display: flex;
  padding: 15px;
`;

export const Col = styled.div`
  ${props => props.flex && `flex: ${props.flex}`}
  display: flex;
  flex-direction: column;
`;

export const Label = styled.div`
  font-weight: 700;
  color: #666;
`;
