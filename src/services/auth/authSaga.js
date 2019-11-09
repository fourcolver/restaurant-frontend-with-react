import { put, takeEvery, call, all } from 'redux-saga/effects';

/** Import actions */
import {
  loginFailed,
  loginSucceed,
  getUserFromApi as getUserFromApiAction,
  getUserFromApiFailed,
  getUserFromApiSucceed
} from './authActions';

/** Import api */
import * as authApi from './authApi';

export function* authSubscriber() {
  yield all([takeEvery('LOGIN', login)]);
  yield all([takeEvery('GET_USER_FROM_API', getUserFromApi)]);
}

export function* login({ payload: { username, password } }) {
  try {
    const token = yield call(authApi.login, username, password);
    yield put(loginSucceed(token));
    yield put(getUserFromApiAction());
  } catch (error) {
    yield put(loginFailed(error));
  }
}

export function* getUserFromApi() {
  try {
    const user = yield call(authApi.getUser);
    yield put(getUserFromApiSucceed(user));
  } catch (error) {
    yield put(getUserFromApiFailed(error));
  }
}
