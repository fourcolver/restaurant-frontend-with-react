import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
  getCategoriesFailed,
  getCategoriesSucceed,
  addCategoryFailed,
  addCategorySucceed,
  deleteCategoryFailed,
  deleteCategorySucceed,
  getCategories as getCategoriesAction,
  updateCategoryFailed,
  updateCategorySucceed,
  getCategoryFailed,
  getCategorySucceed
} from './categoryActions';

// Import API
import * as categoryApi from './categoryApi';

export function* categorySubscriber() {
  yield all([takeEvery('GET_CATEGORIES', getCategories)]);
  yield all([takeEvery('ADD_CATEGORY', addCategory)]);
  yield all([takeEvery('DELETE_CATEGORY', deleteCategory)]);
  yield all([takeEvery('UPDATE_CATEGORY', updateCategory)]);
  yield all([takeEvery('GET_CATEGORY', getCategory)]);
}

export function* getCategories({ payload: { params } }) {
  try {
    const categories = yield call(categoryApi.getCategories, params);
    yield put(getCategoriesSucceed(categories));
  } catch (error) {
    console.error(error);
    yield put(getCategoriesFailed(error));
  }
}

export function* addCategory({ payload: { category, params } }) {
  try {
    yield call(categoryApi.addCategory, category);
    yield put(addCategorySucceed());
    yield put(getCategoriesAction(params));
  } catch (error) {
    console.error(error);
    yield put(addCategoryFailed(error));
  }
}

export function* deleteCategory({ payload: { id } }) {
  try {
    yield call(categoryApi.deleteCategory, id);
    yield put(deleteCategorySucceed());
    yield put(getCategoriesAction({ page: 1 }));
  } catch (error) {
    console.error(error);
    yield put(deleteCategoryFailed(error));
  }
}

export function* updateCategory({ payload: { id, category, params } }) {
  try {
    yield call(categoryApi.updateCategory, id, category);
    yield put(updateCategorySucceed());
    yield put(getCategoriesAction(params));
  } catch (error) {
    console.error(error);
    yield put(updateCategoryFailed(error));
  }
}

export function* getCategory({ payload: { id } }) {
  try {
    const response = yield call(categoryApi.getCategory, id);
    const category = response.data;
    yield put(getCategorySucceed(category));
  } catch (error) {
    console.error(error);
    yield put(getCategoryFailed(error));
  }
}
