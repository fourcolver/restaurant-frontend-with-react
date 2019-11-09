import { put, takeEvery, call, all } from 'redux-saga/effects';

import {
  getItemsFailed,
  getItemsSucceed,
  getItemFailed,
  getItemSucceed,
  addItemFailed,
  addItemSucceed,
  deleteItemFailed,
  deleteItemSucceed,
  getItems as getItemsAction,
  updateItemFailed,
  updateItemSucceed,
  addItemsFailed,
  addItemsSucceed
} from './itemActions';

// Import API
import * as itemApi from './itemApi';
import { getMenus } from '../menu/menuActions';

export function* itemSubscriber() {
  yield all([takeEvery('GET_ITEMS', getItems)]);
  yield all([takeEvery('ADD_ITEM', addItem)]);
  yield all([takeEvery('DELETE_ITEM', deleteItem)]);
  yield all([takeEvery('UPDATE_ITEM', updateItem)]);
  yield all([takeEvery('GET_ITEM', getItem)]);
  yield all([takeEvery('ADD_ITEMS', addItems)]);
}

export function* getItems({ payload: { params } }) {
  try {
    const items = yield call(itemApi.getItems, params);
    yield put(getItemsSucceed(items));
  } catch (error) {
    console.error(error);
    yield put(getItemsFailed(error));
  }
}

export function* addItem({ payload: { item, params } }) {
  try {
    yield call(itemApi.addItem, item);
    yield put(addItemSucceed());
    yield put(getMenus(params));
  } catch (error) {
    console.error(error);
    yield put(addItemFailed(error));
  }
}

export function* addItems({ payload: { items, params } }) {
  try {
    if (items == null || items.length < 0) {
      console.error('Empty (Null) items submitted');
      const error = 'Empty (Null) items submitted';
      yield put(addItemsFailed({ error }));
    }

    console.log('items here');
    console.log(items);
    for (let index = 0; index < items.length; index++) {
      yield call(itemApi.addItem, items[index]);
    }

    yield put(addItemsSucceed());
    yield put(getMenus(params));
  } catch (error) {
    console.error(error);
    yield put(addItemsFailed(error));
  }
}

export function* deleteItem({ payload: { id, params } }) {
  try {
    yield call(itemApi.deleteItem, id);
    yield put(deleteItemSucceed());
    yield put(getItemsAction({ page: 1 }));
    yield put(getMenus(params));
  } catch (error) {
    console.error(error);
    yield put(deleteItemFailed(error));
  }
}

export function* updateItem({ payload: { id, item, params } }) {
  try {
    yield call(itemApi.updateItem, id, item);
    yield put(updateItemSucceed());
    yield put(getMenus(params));
  } catch (error) {
    console.error(error);
    yield put(updateItemFailed(error));
  }
}

export function* getItem({ payload: { id } }) {
  try {
    const response = yield call(itemApi.getItem, id);
    const item = response.data;
    yield put(getItemSucceed(item));
  } catch (error) {
    console.error(error);
    yield put(getItemFailed(error));
  }
}
