import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Import actions
import { hideModal } from '../modalConductorActions';

class ModalWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.hideModal = this.hideModal.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  hideModal() {
    this.props.modalActions.hideModal();
  }

  onOk() {
    this.props.onOk();
    // this.hideModal();
  }

  onCancel() {
    this.props.onCancel();
    this.hideModal();
  }

  render() {
    return (
      <Modal
        isOpen={true}
        toggle={this.hideModal}
        className="modal-dialog-centered"
      >
        <ModalHeader> {this.props.title} </ModalHeader>

        <ModalBody>{this.props.children}</ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={this.onOk}>
            {this.props.okText}
          </Button>
          <Button color="secondary" onClick={this.onCancel}>
            {this.props.cancelText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ModalWrapper.defaultProps = {
  okText: 'Yes',
  cancelText: 'Cancel',
  title: 'Modal Title',
  onOk: () => {},
  onCancel: () => {}
};

ModalWrapper.propTypes = {
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  title: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.element
  ])
};

export default connect(
  null,
  dispatch => ({
    modalActions: bindActionCreators({ hideModal }, dispatch)
  })
)(ModalWrapper);
