import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
  getMenuSucceed,
  getMenuFailed,
  addMenuSucceed,
  addMenuFailed,
  deleteMenuSucceed,
  deleteMenuFailed,
  getMenus as getMenusAction,
  updateMenuSucceed,
  updateMenuFailed,
  getMenusSucceed,
  getMenusFailed
} from './menuActions';

// Import API
import * as menuApi from './menuApi';

export function* menuSubscriber() {
  yield all([takeEvery('GET_MENUS', getMenus)]);
  yield all([takeEvery('ADD_MENU', addMenu)]);
  yield all([takeEvery('DELETE_MENU', deleteMenu)]);
  yield all([takeEvery('UPDATE_MENU', updateMenu)]);
  yield all([takeEvery('GET_MENU', getMenu)]);
}

export function* getMenus({ payload: { params } }) {
  try {
    const menus = yield call(menuApi.getMenus, params);
    yield put(getMenusSucceed(menus));
  } catch (error) {
    console.error(error);
    yield put(getMenusFailed(error));
  }
}

export function* addMenu({ payload: { menu, params } }) {
  try {
    yield call(menuApi.addMenu, menu);
    yield put(addMenuSucceed());
    yield put(getMenusAction(params));
  } catch (error) {
    console.error(error);
    yield put(addMenuFailed(error));
  }
}

export function* deleteMenu({ payload: { id, params } }) {
  try {
    yield call(menuApi.deleteMenu, id);
    yield put(deleteMenuSucceed());
    yield put(getMenusAction(params));
  } catch (error) {
    console.error(error);
    yield put(deleteMenuFailed(error));
  }
}

export function* updateMenu({ payload: { id, menu, params } }) {
  try {
    yield call(menuApi.updateMenu, id, menu);
    yield put(updateMenuSucceed());
    yield put(getMenusAction(params));
  } catch (error) {
    console.error(error);
    yield put(updateMenuFailed(error));
  }
}

export function* getMenu({ payload: { id } }) {
  try {
    const response = yield call(menuApi.getMenuWithId, id);
    const menu = response.data;
    yield put(getMenuSucceed(menu));
  } catch (error) {
    console.error(error);
    yield put(getMenuFailed(error));
  }
}
