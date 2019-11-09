import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

/** Import components */
import TopNav from './components/TopNav/TopNav';
import Sidebar from './components/Sidebar/Sidebar';

/** Import scenes */
import Categories from './scenes/Categories';
import Cities from './scenes/Cities';
import Menu from './scenes/Menu';
import MenuItems from './scenes/MenuItems';
import Restaurants from './scenes/Restaurants';

// selectors
import { getCurrentUser } from 'services/auth/select';

/** Import assets */
import './home.css';

class Home extends React.Component {
  render() {
    /** If not signed in redirect to '/login' page */
    if (!this.props.auth.currentUser) {
      return (
        <Redirect
          to={{
            pathname: '/login'
          }}
        />
      );
    }

    /** if '/' redirect to cities page */
    if (this.props.location.pathname === '/') {
      window.location.href = '/cities';
    }

    return (
      <div id="home" className="home-container">
        <TopNav />
        <Sidebar
          {...this.props}
          pageWrapId="page-wrap"
          outerContainerId="home"
        />
        <div className="container-fluid scenes-container">
          <Switch>
            <Route path="/cities" render={props => <Cities {...props} />} />
            <Route
              path="/categories"
              render={props => <Categories {...props} />}
            />
            <Route path="/menus" render={props => <Menu {...props} />} />
            <Route path="/items" render={props => <MenuItems {...props} />} />
            <Route
              path="/restaurants"
              render={props => <Restaurants {...props} />}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    error: PropTypes.shape({}),
    loading: PropTypes.bool
  }).isRequired
};
export default connect(
  state => ({
    auth: getCurrentUser(state)
  }),
  null
)(Home);
