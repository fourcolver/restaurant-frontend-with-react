import { handleActions } from 'redux-actions';

import { showModal, hideModal } from './modalConductorActions';

const defaultState = {
  modalType: null,
  params: null
};

const reducer = handleActions(
  {
    [showModal](
      state,
      {
        payload: { modalType, params }
      }
    ) {
      return {
        ...state,
        modalType,
        params
      };
    },
    [hideModal](state) {
      return {
        ...state,
        modalType: null
      };
    }
  },
  defaultState
);

export default reducer;
