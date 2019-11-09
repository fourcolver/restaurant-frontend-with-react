import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

/** Import components */
import {
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

/** Import assets */
import logo from 'assets/images/logo.jpg';
import './topNav.css';

class TopNav extends React.Component {
  render() {
    const { name } = this.props.currentUser;
    return (
      <div className="top-nav">
        <Navbar light expand className="shadow-sm bg-white p-0 h-100">
          <NavbarBrand href="/">
            <img src={logo} alt="ChatMatic" className="top-nav-logo" />
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {name}
              </DropdownToggle>

              <DropdownMenu right>
                <DropdownItem>
                  <Link to="/logout">Log out</Link>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default connect(
  state => ({
    currentUser: state.default.services.auth.currentUser
  }),
  null
)(TopNav);
