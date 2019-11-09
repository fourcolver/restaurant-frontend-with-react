import { getBase64, wrapRequest, xapi } from '../utils';

const getItems = wrapRequest(async params =>
  xapi().get('/api/items', {
    params
  })
);

const addItem = wrapRequest(async item => {
  let file = null;
  if (item.file) {
    file = await getBase64(item.file);
  }

  return xapi().post('/api/items/', {
    ...item,
    file
  });
});

const deleteItem = wrapRequest(async id => xapi().delete(`/api/items/${id}`));

const updateItem = wrapRequest(async (id, item) => {
  let file = null;
  if (item.file) {
    file = await getBase64(item.file);
  }

  return xapi().put(`/api/items/${id}`, {
    ...item,
    file
  });
});

const getItem = wrapRequest(async id => xapi().get(`/api/items/${id}`));

export { getItems, addItem, deleteItem, updateItem, getItem };
