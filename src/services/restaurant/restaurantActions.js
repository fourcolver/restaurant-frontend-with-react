import { createActions } from 'redux-actions';

const {
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
  getRestaurantFailed,
  updateCurrentRestaurant
} = createActions({
  GET_RESTAURANTS: params => ({ params }),
  GET_RESTAURANTS_SUCCEED: restaurants => ({ restaurants }),
  GET_RESTAURANTS_FAILED: error => ({ error }),
  DELETE_RESTAURANT: (id, params = null) => ({ id, params }),
  DELETE_RESTAURANT_SUCCEED: () => ({}),
  DELETE_RESTAURANT_FAILED: error => ({ error }),
  UPDATE_RESTAURANT: (id, restaurant, params = null) => ({
    id,
    restaurant,
    params
  }),
  UPDATE_RESTAURANT_SUCCEED: () => ({}),
  UPDATE_RESTAURANT_FAILED: error => ({ error }),
  ADD_RESTAURANT: (restaurant, params = null) => ({ restaurant, params }),
  ADD_RESTAURANT_SUCCEED: () => ({}),
  ADD_RESTAURANT_FAILED: error => ({ error }),
  GET_RESTAURANT: id => ({ id }),
  GET_RESTAURANT_SUCCEED: restaurant => ({ restaurant }),
  GET_RESTAURANT_FAILED: error => ({ error }),
  UPDATE_CURRENT_RESTAURANT: restaurant => ({ restaurant })
});

export {
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
  getRestaurantFailed,
  updateCurrentRestaurant
};
