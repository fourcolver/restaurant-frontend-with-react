import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Import scenes
import List from './scenes/List';

class Cities extends React.Component {
  render() {
    const { path } = this.props.match;
    return (
      <div>
        <Switch>
          <Route path={`${path}/`} render={props => <List {...props} />} />
        </Switch>
      </div>
    );
  }
}

export default Cities;
