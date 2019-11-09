import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/** Import service reducers */
import authReducer from './auth/authReducer';
import cityReducer from './city/cityReducer';
import categoryReducer from './category/categoryReducer';
import restaurantReducer from './restaurant/restaurantReducer';
import menuReducer from './menu/menuReducer';
import itemReducer from './item/itemReducer';
// const scenesReducer = combineReducers({
// })

// Import modal reducers
import modalReducer from '../modals/modalConductorReducer';

const servicesReducer = combineReducers({
  auth: authReducer,
  city: cityReducer,
  category: categoryReducer,
  restaurant: restaurantReducer,
  menu: menuReducer,
  item: itemReducer
});

export default combineReducers({
  routing: routerReducer,
  services: servicesReducer,
  modal: modalReducer
});
