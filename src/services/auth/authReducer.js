import { handleActions } from 'redux-actions';

import {
  login,
  loginFailed,
  loginSucceed,
  getStoredUser,
  getUserFromApi,
  getUserFromApiFailed,
  getUserFromApiSucceed,
  logout
} from './authActions';

import {
  storeCurrentUser,
  getStoredUser as getLocalStorageUser,
  storeCurrentToken,
  getStoredToken,
  removeCurrentToken,
  removeCurrentUser
} from './services';

const defaultState = {
  currentUser: null,
  error: null,
  loading: false,
  token: {
    token_type: null,
    expires_in: null,
    access_token: null,
    refresh_token: null
  }
};

const reducer = handleActions(
  {
    [login](state) {
      return {
        ...state,
        error: null,
        loading: true
      };
    },
    [loginFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        ...error,
        currentUser: null,
        loading: false
      };
    },
    [loginSucceed](
      state,
      {
        payload: { token }
      }
    ) {
      storeCurrentToken(token);

      return {
        ...state,
        token: token,
        error: null,
        loading: false
      };
    },
    [getStoredUser](state) {
      return {
        ...state,
        currentUser: getLocalStorageUser(),
        token: getStoredToken()
      };
    },
    [getUserFromApi](state) {
      return {
        ...state,
        error: null,
        loading: true
      };
    },
    [getUserFromApiFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        error,
        loading: false
      };
    },
    [getUserFromApiSucceed](
      state,
      {
        payload: { user }
      }
    ) {
      storeCurrentUser(user);
      return {
        ...state,
        error: null,
        loading: false,
        currentUser: user
      };
    },
    [logout](state) {
      console.error('logout dispatched reducer');
      removeCurrentToken();
      removeCurrentUser();
      return {
        ...state,
        currentUser: null
      };
    }
  },
  defaultState
);

export default reducer;
