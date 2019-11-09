import { getBase64, wrapRequest, xapi } from '../utils';

const getMenus = wrapRequest(async params =>
  xapi().get('/api/menus', {
    params
  })
);

const addMenu = wrapRequest(async menu => {
  let file = null;
  if (menu.file) {
    file = await getBase64(menu.file);
  }
  return xapi().post('/api/menus/', {
    ...menu,
    file
  });
});

const deleteMenu = wrapRequest(async id => xapi().delete(`/api/menus/${id}`));

const updateMenu = wrapRequest(async (id, menu) => {
  console.log(menu);
  let file = null;
  if (menu.file) {
    file = await getBase64(menu.file);
  }
  return xapi().put(`/api/menus/${id}`, {
    ...menu,
    file
  });
});

const getMenuWithId = wrapRequest(async id => xapi().get(`/api/menus/${id}`));

export { getMenus, addMenu, deleteMenu, updateMenu, getMenuWithId };
