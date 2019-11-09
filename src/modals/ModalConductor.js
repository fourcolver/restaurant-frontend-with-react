import React from 'react';
import { connect } from 'react-redux';

// Import Modals
import CityAdd from './components/CityAdd';
import CityEdit from './components/CityEdit';
import CategoryAdd from './components/CategoryAdd';
import CategoryEdit from './components/CategoryEdit';
import RestaurantAdd from './components/RestaurantAdd';
import RestaurantEdit from './components/RestaurantEdit';
import MenuAdd from './components/MenuAdd';

const ModalConductor = props => {
  switch (props.modal.modalType) {
    case 'ADD_CITY_MODAL':
      return <CityAdd {...props} />;
    case 'EDIT_CITY_MODAL':
      return <CityEdit {...props} />;
    case 'ADD_CATEGORY_MODAL':
      return <CategoryAdd {...props} />;
    case 'EDIT_CATEGORY_MODAL':
      return <CategoryEdit {...props} />;
    case 'RESTAURANT_ADD_MODAL':
      return <RestaurantAdd {...props} />;
    case 'RESTAURANT_EDIT_MODAL':
      return <RestaurantEdit {...props} />;
    case 'MENU_ADD_MODAL':
      return <MenuAdd {...props} />;
    default:
      return null;
  }
};

export default connect(
  state => ({
    modal: {
      ...state.default.modal
    }
  }),
  null
)(ModalConductor);
