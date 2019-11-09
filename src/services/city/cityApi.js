import { wrapRequest, xapi, getBase64 } from '../utils';

const getCities = wrapRequest(async params =>
  xapi().get('/api/cities', {
    params
  })
);

const addCity = wrapRequest(async city => {
  let file = null;

  if (city.file) {
    file = await getBase64(city.file);
  }

  return xapi().post('/api/cities/', {
    ...city,
    file
  });
});

const addCities = wrapRequest(async data =>
  xapi().post('/api/cities/insertmany', { data })
);

const deleteCity = wrapRequest(async id => xapi().delete(`/api/cities/${id}`));

const updateCity = wrapRequest(async (id, city) => {
  let file = null;

  if (city.file) {
    file = await getBase64(city.file);
  }

  return xapi().put(`/api/cities/${id}`, {
    ...city,
    file
  });
});

const getCityWithId = wrapRequest(async id => xapi().get(`/api/cities/${id}`));

export { getCities, addCity, deleteCity, updateCity, getCityWithId, addCities };
