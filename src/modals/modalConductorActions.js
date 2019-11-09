import { createActions } from 'redux-actions';

const { showModal, hideModal } = createActions({
  SHOW_MODAL: (modalType, params = null) => ({ modalType, params }),
  HIDE_MODAL: () => ({})
});

export { showModal, hideModal };
