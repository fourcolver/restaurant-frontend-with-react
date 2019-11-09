import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Import scenes
import Add from './scenes/Add';
import Edit from './scenes/Edit';
import List from './scenes/List';

class MenuItems extends React.Component {
  render() {
    const { path } = this.props.match;
    return (
      <div>
        <Switch>
          <Route
            path={`${path}/add`}
            render={props => <Add {...props}/>}
          />
          <Route
            path={`${path}/:id/edit`}
            render={props => <Edit {...props}/>}
          />
          <Route
            path={`${path}/`}
            render={props => <List {...props}/> }
          />
        </Switch>
      </div>
    );
  }
}

export default MenuItems;