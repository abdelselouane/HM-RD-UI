import { Container as BaseContainer } from '../../components/page';

export const Container = BaseContainer.extend`
background-color: ${({ theme }) => theme.white};
box-sizing: border-box;
display: flex;
flex-direction: column;
justify-content: flex-start;
height: 100%;
overflow-y: hidden;
width: 100%;


.inventory-tabs {
  height: 100%;
}

.tabs span {
  &:focus {
    outline: none !important;
  }
  
  &[role=tab]:first-child {
    border-left: none;
  }
}

[role=tabpanel] {
    display: flex;
    flex-direction: column;
    height: 95%;
    overflow: hidden;
    padding: 20px 0px;

    .text-input-container.search {
      margin: 15px 15px;
      width: 65%;

      &.dropdown {
        width: 75%;
        margin: 15px 0px;
      }
    }
}

.search-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  button {
    flex: 0.15;
  }
}

.text-input-container .input-field {
  margin-top: 0em;
}

.edit-col .button {
  margin: 0px;
}

.text-input-container.search {
  flex: 0.5;

  input {
    margin-top: -6px;
  }

  .icon_search {
    bottom: 0;
    color: ${({ theme }) => theme.orange};
    font-size: 30px;
    padding: 5px 10px;
    position: absolute;
    right: 0;
    z-index: 1;
  }
}
`;

export default Container;
