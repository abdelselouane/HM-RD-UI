import { Container as BaseContainer } from '../../components/page';

export const Container = BaseContainer.extend`
  background-color: ${({ theme }) => theme.white};
  align-items: flex-start;
  display: flex;
  flex-direction: column;

  .title {
    padding: 0px 20px;
  }
  
  .order-history-header {
    margin: 0px;
  
    thead tr {
      margin-left: 1em;
  
      th {
        border: none;
        font-size: 18px;
  
        &:first-child {
          padding-left: 20px;
        }
      }
    }
  }
`;

export default Container;
