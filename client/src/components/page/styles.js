import styled, { css } from 'styled-components';

const defaultGrid = css`
  display: grid;
  grid-template-rows: 70px
                      48px
                      24px
                      24px
                      repeat(3, 1fr)
                      repeat(1, 72px);
  grid-template-columns: 20px 1fr repeat(4, 3fr) 1fr 20px;
  grid-template-areas:  ". . . . . . . ."
                        ". . . . . . . ."
                        ". . cmess cmess cmess cmess . ."
                        ". . cmess cmess cmess cmess . ."
                        ". . carea carea carea carea . ."
                        ". . carea carea carea carea . ."
                        ". . carea carea carea carea . ."
                        ". . . . . . . .";
`;

const lowResolutionGrid = css`
  display: grid;
  grid-template-areas:  ". . . . . . . ."
                        ". . . . . . . ."
                        ". cmess cmess cmess cmess cmess cmess ."
                        ". cmess cmess cmess cmess cmess cmess ."
                        ". carea carea carea carea carea carea ."
                        ". carea carea carea carea carea carea ."
                        ". carea carea carea carea carea carea ."
                        ". . . . . . . .";
  grid-template-rows: 70px
                      24px
                      24px
                      24px
                      repeat(3, 1fr)
                      repeat(1, 48px);
  grid-template-columns: 10px 1fr repeat(4, 3fr) 1fr 10px;
`;

export const GridLayout = styled.div`
  background-color: ${({ theme }) => theme.black12};
  box-sizing: border-box;
  color: ${({ theme }) => theme.blackA11};
  height: 100%;  
  ${props => (props.enableScroll ? 'overflow-x: scroll;' : 'overflow: hidden;')}
  
  ${() => defaultGrid}
  @media only screen and (max-width: 1024px) {
    ${() => lowResolutionGrid}
  }
`;

export const Container = styled.div`
  align-items: flex-start;
  display: flex;
  grid-area: carea;
  justify-content: center;
  ${({ hideBoxShadow }) => (hideBoxShadow ? '' : 'box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24);')}
`;
