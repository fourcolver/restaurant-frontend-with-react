import { wrapRequest, xapi, getBase64 } from '../utils';

const getCategories = wrapRequest(async params =>
  xapi().get('/api/categories', {
    params
  })
);

const addCategory = wrapRequest(async category => {
  let file = null;
  if (category.file) {
    file = await getBase64(category.file);
  }
  return xapi().post('/api/categories/', {
    ...category,
    file
  });
});

const deleteCategory = wrapRequest(async id =>
  xapi().delete(`/api/categories/${id}`)
);

const updateCategory = wrapRequest(async (id, category) => {
  let file = null;

  if (category.file) {
    file = await getBase64(category.file);
  }
  return xapi().put(`/api/categories/${id}`, {
    ...category,
    file
  });
});

const getCategory = wrapRequest(async id =>
  xapi().get(`/api/categories/${id}`)
);

export {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getCategory
};
