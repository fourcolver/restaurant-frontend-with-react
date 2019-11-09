import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

// Import components
import { Button, Input, FormGroup, Label } from 'reactstrap';

// Import actions
import { login } from 'services/auth/authActions';
import { bindActionCreators } from 'redux';

// Import assets
import './login-form.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.change = this.change.bind(this);
  }

  /** fb login btn clicked */
  handleLoginClick() {
    const { username, password } = this.state;

    if (username === null || username === '') {
      toastr.error('User name is missing', 'You must provide your user name');
      return;
    }

    this.props.authActions.login(username, password);
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    return (
      <div className="login-form d-flex flex-column align-items-center">
        <div className="h3">Please sign in</div>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="username" name="username" onChange={this.change} />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            onChange={this.change}
          />
        </FormGroup>

        <Button
          color="primary"
          className="text-center"
          onClick={this.handleLoginClick}
        >
          Sign in
        </Button>
      </div>
    );
  }
}

LoginForm = withRouter(LoginForm);

export default connect(
  state => ({
    ...state.default.auth
  }),
  dispatch => ({
    authActions: bindActionCreators({ login }, dispatch)
  })
)(LoginForm);
