import { handleActions } from 'redux-actions';

import {
  getMenus,
  getMenusSucceed,
  getMenusFailed,
  deleteMenu,
  deleteMenuSucceed,
  deleteMenuFailed,
  updateMenu,
  updateMenuSucceed,
  updateMenuFailed,
  addMenu,
  addMenuSucceed,
  addMenuFailed,
  getMenu,
  getMenuSucceed,
  getMenuFailed,
  updateCurrentMenu
} from './menuActions';

const defaultState = {
  menus: null,
  error: null,
  loading: false,
  message: '',
  success: false,
  currentMenu: null
};

const reducer = handleActions({
  [getMenus](state) {
    return {
      ...state,
      error: null,
      loading: true,
      message: 'Generating menu lists...'
    }
  },
  [getMenusFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      loading: false
    }
  },
  [getMenusSucceed](state, { payload: { menus } }) {
    return {
      ...state,
      loading: false,
      menus
    }
  },
  [addMenu](state) {
    return {
      ...state,
      loading: true,
      success: false,
      message: 'Adding Menu...',
      error: null
    }
  },
  [addMenuSucceed](state) {
    return {
      ...state,
      loading: false,
      success: true,
      message: 'Menu added successfully',
    }
  },
  [addMenuFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      success: false,
      error
    }
  },
  [deleteMenu](state) {
    return {
      ...state,
      loading: true,
      success: false,
      message: 'Delete menu...',
      error: null
    }
  },
  [deleteMenuSucceed](state) {
    return {
      ...state,
      loading: false,
      success: true,
      message: 'Menu deleted successfully'
    }
  },
  [deleteMenuFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      success: false,
      error
    }
  },
  [updateMenu](state) {
    return {
      ...state,
      loading: true,
      success: false,
      message: 'Updating menu...',
      error: null
    }
  },
  [updateMenuSucceed](state) {
    return {
      ...state,
      loading: false,
      success: true,
      message: 'Menu updated successfully'
    }
  },
  [updateMenuFailed](state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      success: false,
      error
    }
  },
  [getMenu] (state) {
    return {
      ...state,
      loading: true,
      success: false,
      message: 'Getting menu info...',
      error: null
    }
  },
  [getMenuSucceed](state, { payload: { menu } }) {
    return {
      ...state,
      loading: false,
      message: '',
      currentMenu: menu
    }
  },
  [getMenuFailed] (state, { payload: { error } }) {
    return {
      ...state,
      loading: false,
      success: false,
      message: 'Getting menu info failed',
      error,
      currentMenu: null
    }
  },
  [updateCurrentMenu]( state, { payload: { menu }} ) {
    return {
      ...state,
      currentMenu: menu
    }
  }
}, defaultState);

export default reducer;