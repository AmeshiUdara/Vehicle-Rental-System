import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';

import './index.css';
import App from './App';
import './assets/fonts/icomoon/style.css';
import './assets/css/aos.css';
import './assets/css/bootstrap.min.css';
import './assets/css/bootstrap-datepicker.css';
import './assets/css/owl.theme.default.min.css';
import './assets/fonts/flaticon/font/flaticon.css';
import './assets/css/jquery.fancybox.min.css';
import './assets/css/aos.css';
import './assets/css/style.css';
import './assets/css/owl.carousel.min.css';

import './assets/css/hover-min.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
