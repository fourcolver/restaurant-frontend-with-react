import { createSelector } from 'reselect';

const getAllCities = state => state.default.services.city.cities;

export const getCityWithId = createSelector(
  [getAllCities, (state, props) => {
    return props.match.params.id
  }],
  (cities, id) => {
    if (cities !== null) {
      return cities.data.filter(t => t.id === id)  
    } else {
      return []
    }
  }
)