import styled from 'styled-components';

const StyledSearchDropdown = styled.div`
  display: block;
  width: 700px;
  position: absolute;
  top: 70%;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24);
  z-index: 5;

  .scrollable-table {
    overflow-y: hidden;
  }

  .standard-table tbody tr {
    td {
      background-color: ${({ theme }) => theme.white} !important;
    }

    &:hover td {
      background-color: ${({ theme }) => theme.black10} !important;
    }
  }

  .table-body.alternating-rows {
    width: 100%;
    
    tr:nth-child(2n + 1),
    tr:nth-child(2n) {
      background-color: ${({ theme }) => theme.black10};
    }

    tr:hover td,
    tr:focus td {
      background-color: ${({ theme }) => theme.black12} !important;
    }
    
    tr td {
      border: none;
    }
  }
`;

export default StyledSearchDropdown;
