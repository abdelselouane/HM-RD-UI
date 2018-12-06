import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import partsSearchReducer from './partsSearchReducer';
import cartReducer from './cartReducer';
import configReducer from './configReducer';
import notificationReducer from './notificationReducer';
import partsOrdersReducer from './partsOrdersReducer';
import inventoryReducer from './inventoryReducer';
import purchaseOrdersReducer from './purchaseOrdersReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  partsSearch: partsSearchReducer,
  cart: cartReducer,
  config: configReducer,
  notify: notificationReducer,
  partsOrders: partsOrdersReducer,
  inventory: inventoryReducer,
  purchaseOrders: purchaseOrdersReducer
});

export default rootReducer;
