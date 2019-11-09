import React from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import { Redirect } from 'react-router-dom';

// Import Componetns
import LoginForm from './components/LoginForm/LoginForm';

// Import utility functiosn
import { errorMsg } from 'services/utils';

// Import Assets
import './login.css';

class Login extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error && this.props.error !== null) {
      let msg = errorMsg(this.props.error);
      toastr.error(msg.title, msg.message);
    }
  }

  render() {
    if (this.props.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Logging in...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }

    if (this.props.currentUser) {
      return (
        <Redirect
          to={{
            pathname: '/'
          }}
        />
      );
    }
    return (
      <div className="login-scene">
        <LoginForm />
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.default.services.auth
  }),
  null
)(Login);
