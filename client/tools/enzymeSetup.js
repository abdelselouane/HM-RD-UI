import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockGlobals from '../src/utils/mockGlobals';

Enzyme.configure({ adapter: new Adapter() });
mockGlobals();
