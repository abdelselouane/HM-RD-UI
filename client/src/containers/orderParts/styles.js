import { Container as BaseContainer } from '../../components/page';

export const Container = BaseContainer.extend`
background: ${({ theme }) => theme.white};
`;

export default Container;
