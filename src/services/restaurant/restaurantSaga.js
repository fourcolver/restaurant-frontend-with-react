import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
  getRestaurantFailed,
  getRestaurantSucceed,
  getRestaurantsFailed,
  getRestaurantsSucceed,
  addRestaurantFailed,
  addRestaurantSucceed,
  deleteRestaurantFailed,
  deleteRestaurantSucceed,
  getRestaurants as getRestaurantsAction,
  updateRestaurantFailed,
  updateRestaurantSucceed
} from './restaurantActions';

// Import API
import * as restaurantApi from './restaurantApi';

export function* restaurantSubscriber() {
  yield all([takeEvery('GET_RESTAURANTS', getRestaurants)]);
  yield all([takeEvery('ADD_RESTAURANT', addRestaurant)]);
  yield all([takeEvery('DELETE_RESTAURANT', deleteRestaurant)]);
  yield all([takeEvery('UPDATE_RESTAURANT', updateRestaurant)]);
  yield all([takeEvery('GET_RESTAURANT', getRestaurant)]);
}

export function* getRestaurants({ payload: { params } }) {
  try {
    const restaurants = yield call(restaurantApi.getRestaurants, params);
    yield put(getRestaurantsSucceed(restaurants));
  } catch (error) {
    console.error(error);
    yield put(getRestaurantsFailed(error));
  }
}

export function* addRestaurant({ payload: { restaurant, params } }) {
  try {
    yield call(restaurantApi.addRestaurant, restaurant);
    yield put(addRestaurantSucceed());
    yield put(getRestaurantsAction(params));
  } catch (error) {
    console.error(error);
    yield put(addRestaurantFailed(error));
  }
}

export function* deleteRestaurant({ payload: { id, params } }) {
  try {
    yield call(restaurantApi.deleteRestaurant, id);
    yield put(deleteRestaurantSucceed());
    yield put(getRestaurantsAction(params));
  } catch (error) {
    console.error(error);
    yield put(deleteRestaurantFailed(error));
  }
}

export function* updateRestaurant({ payload: { id, restaurant, params } }) {
  try {
    yield call(restaurantApi.updateRestaurant, id, restaurant);
    yield put(updateRestaurantSucceed());
    yield put(getRestaurantsAction(params));
  } catch (error) {
    console.error(error);
    yield put(updateRestaurantFailed(error));
  }
}

export function* getRestaurant({ payload: { id } }) {
  try {
    const response = yield call(restaurantApi.getRestaurant, id);
    const restaurant = response.data;
    yield put(getRestaurantSucceed(restaurant));
  } catch (error) {
    console.error(error);
    yield put(getRestaurantFailed(error));
  }
}
