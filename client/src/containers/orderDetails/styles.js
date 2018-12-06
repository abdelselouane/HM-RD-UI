import styled from 'styled-components';
import { Container as BaseContainer } from '../../components/page';

export const Container = BaseContainer.extend`
  background-color: ${({ theme }) => theme.white};
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  height: 50px;
  margin: 0px;
  margin-bottom: 30px;
  padding: 0px 20px;
  width: 100%;

  h2 {
    display: inline-block;
    margin-bottom: 0px;
  }
`;

export const PurchaseOrderList = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 20px;
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
`;
