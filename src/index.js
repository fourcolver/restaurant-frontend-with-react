import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// Import {history} and store
import store, { history } from './store';

// Import root scene
import App from './scenes/App';

// Import assets
import './assets/fonts/font-awesome/css/font-awesome.css';
import 'aos/dist/aos.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-toggle-switch/dist/css/switch.min.css';
import 'assets/scss/restaurant_admin.css';
import 'global.css';

// Import register service worker
import registerServiceWorker from './registerServiceWorker';

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  target
);
registerServiceWorker();
