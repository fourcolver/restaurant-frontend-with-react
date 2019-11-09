import { handleActions } from 'redux-actions';

import {
  getRestaurants,
  getRestaurantsSucceed,
  getRestaurantsFailed,
  deleteRestaurant,
  deleteRestaurantSucceed,
  deleteRestaurantFailed,
  updateRestaurant,
  updateRestaurantSucceed,
  updateRestaurantFailed,
  addRestaurant,
  addRestaurantSucceed,
  addRestaurantFailed,
  getRestaurant,
  getRestaurantSucceed,
  updateCurrentRestaurant
} from './restaurantActions';

const defaultState = {
  restaurants: null,
  error: null,
  loading: false,
  messages: '',
  success: false,
  currentRestaurant: null
};

const reducer = handleActions(
  {
    [getRestaurants](state) {
      return {
        ...state,
        error: null,
        loading: true,
        message: 'Generating restaurant lists...'
      };
    },
    [getRestaurantsSucceed](
      state,
      {
        payload: { restaurants }
      }
    ) {
      return {
        ...state,
        loading: false,
        restaurants
      };
    },
    [getRestaurantsFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        error,
        loading: false
      };
    },
    [addRestaurant](state) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Adding restaurant...',
        error: null
      };
    },
    [addRestaurantSucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'Restaurant added successfully'
      };
    },
    [addRestaurantFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        success: false,
        error
      };
    },
    [deleteRestaurant](
      state,
      {
        payload: { id }
      }
    ) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Deleting restaurant...',
        error: null
      };
    },
    [deleteRestaurantSucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'Restaurant deleted successfully'
      };
    },
    [deleteRestaurantFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        success: false,
        error
      };
    },
    [updateRestaurant](state) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Updating restaurant...',
        error: null
      };
    },
    [updateRestaurantSucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'Restaurant updated successfully'
      };
    },
    [updateRestaurantFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        success: false,
        error
      };
    },
    [getRestaurant](state) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Getting restaurant info...',
        error: null
      };
    },
    [getRestaurantSucceed](
      state,
      {
        payload: { restaurant }
      }
    ) {
      return {
        ...state,
        loading: false,
        message: '',
        currentRestaurant: restaurant
      };
    },
    [getRestaurantsFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        success: false,
        message: 'Getting restaurant info failed',
        error,
        currentRestaurant: null
      };
    },
    [updateCurrentRestaurant](
      state,
      {
        payload: { restaurant }
      }
    ) {
      return {
        ...state,
        currentRestaurant: restaurant
      };
    }
  },
  defaultState
);

export default reducer;
