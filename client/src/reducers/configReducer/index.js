import {
  LOAD_CONFIG,
  LOAD_CONFIG_ERROR
} from '../../constants/actionTypes';

export const initialState = {
  appName: '',
  partsFinderUrl: '',
  partsServiceUrl: '',
  error: false
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG:
      return {
        ...state,
        appName: action.payload.projectInfo.appName,
        partsFinderUrl: action.payload.partsFinderUrl,
        partsServiceUrl: action.payload.partsServiceUrl,
        error: false
      };
    case LOAD_CONFIG_ERROR:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
}
