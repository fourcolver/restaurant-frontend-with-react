import { handleActions } from 'redux-actions';

import {
  getCities,
  getCitiesSucceed,
  getCitiesFailed,
  addCity,
  addCitySucceed,
  addCityFailed,
  addCities,
  addCitiesSucceed,
  addCitiesFailed,
  deleteCity,
  deleteCitySucceed,
  deleteCityFailed,
  updateCity,
  updateCitySucceed,
  updateCityFailed,
  getCity,
  getCityFailed,
  getCitySucceed,
  updateCurrentCity
} from './cityActions';

const defaultState = {
  cities: null,
  error: null,
  loading: false,
  message: '',
  success: false,
  currentCity: null
};

const reducer = handleActions(
  {
    [getCities](state) {
      return {
        ...state,
        error: null,
        loading: true,
        message: 'Generating cities listing...'
      };
    },
    [getCitiesFailed](state, { payload: error }) {
      console.log('error here');
      console.log(error);
      return {
        ...state,
        error,
        loading: false
      };
    },
    [getCitiesSucceed](
      state,
      {
        payload: { cities }
      }
    ) {
      return {
        ...state,
        loading: false,
        cities
      };
    },
    [addCity](state) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Adding City...'
      };
    },
    [addCitySucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'City added successfully'
      };
    },
    [addCityFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error,
        success: false
      };
    },
    [addCities](state) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Adding Cities...'
      };
    },
    [addCitiesSucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'Cities added successfully'
      };
    },
    [addCitiesFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error,
        success: false
      };
    },
    [deleteCity](
      state,
      {
        payload: { id }
      }
    ) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Deleting City...'
      };
    },
    [deleteCitySucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'City deleted successfully'
      };
    },
    [deleteCityFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error,
        success: false
      };
    },
    [updateCity](state) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Updating city...'
      };
    },
    [updateCitySucceed](state) {
      return {
        ...state,
        loading: false,
        success: true,
        message: 'City updated successfully'
      };
    },
    [updateCityFailed](
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
    [getCity](
      state,
      {
        payload: { id }
      }
    ) {
      return {
        ...state,
        loading: true,
        success: false,
        message: 'Getting city info...'
      };
    },
    [getCitySucceed](
      state,
      {
        payload: { city }
      }
    ) {
      return {
        ...state,
        loading: false,
        message: '',
        currentCity: city
      };
    },
    [getCityFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        success: false,
        message: 'Getting city info failed',
        currentCity: null
      };
    },
    [updateCurrentCity](
      state,
      {
        payload: { city }
      }
    ) {
      return {
        ...state,
        currentCity: city
      };
    }
  },
  defaultState
);

export default reducer;
