import { getBase64, wrapRequest, xapi } from '../utils';

const getRestaurants = wrapRequest(async params =>
  xapi().get('/api/restaurants', {
    params
  })
);

const addRestaurant = wrapRequest(async restaurant => {
  let file = null;
  if (restaurant.file) {
    file = await getBase64(restaurant.file);
  }

  return xapi().post('/api/restaurants/', {
    ...restaurant,
    file
  });
});

const deleteRestaurant = wrapRequest(async id =>
  xapi().delete(`/api/restaurants/${id}`)
);

const updateRestaurant = wrapRequest(async (id, restaurant) => {
  let file = null;
  if (restaurant.file) {
    file = await getBase64(restaurant.file);
  }
  return xapi().put(`/api/restaurants/${id}`, {
    ...restaurant,
    file
  });
});

const getRestaurant = wrapRequest(async id =>
  xapi().get(`/api/restaurants/${id}`)
);

export {
  getRestaurants,
  addRestaurant,
  deleteRestaurant,
  updateRestaurant,
  getRestaurant
};
