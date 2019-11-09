import axios from 'axios';

// Import Settings
import settings from 'config/settings.js';
import store from '../store';

// Import Logout action
import { logout } from './auth/authActions';
import queryString from 'query-string';

export const wrapRequest = func => {
  return async (...args) => {
    const res = await func(...args);
    if (
      res &&
      res.status &&
      res.status !== 200 &&
      res.status !== 201 &&
      res.status !== 204
    ) {
      throw res;
    } else {
      return res.data;
    }
  };
};

export const xapi = () => {
  let token = null;
  let tokenType = null;
  if (store.getState().default.services.auth.token) {
    token = store.getState().default.services.auth.token.access_token;
    tokenType = store.getState().default.services.auth.token.token_type;
  }

  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    charset: 'UTF-8'
  };

  if (token) {
    headers = {
      ...headers,
      Authorization: `${tokenType} ${token}`
    };
  }

  let xapi = axios.create({
    baseURL: settings.BASE_URL,
    headers: headers
  });

  // Check expired token
  xapi.interceptors.response.use(undefined, function(err) {
    if (err.response && err.response.status === 401) {
      store.dispatch(logout());
    }

    if (typeof err.response === 'undefined') {
      throw err;
    }

    if (err.response && err.response.status !== 200) {
      throw err.response;
    }
  });

  return xapi;
};

export const errorMsg = error => {
  let errorMsg = {
    title: null,
    message: ''
  };

  if (typeof error === 'object' && error !== null) {
    if (error.data && error.data.message) {
      errorMsg.title = error.data.message;
      let errors = error.data.errors;
      if (errors) {
        for (let key in errors) {
          /* eslint-disable-next-line  */
          if (errors[key]) {
            /* eslint-disable-next-line  */
            errors[key].map(msg => {
              errorMsg.message += msg + '\n';
            });
          }
        }
      }
    }
  } else {
    errorMsg.title = error;
  }

  return errorMsg;
};

export const getBase64 = file => {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const csv2array = (data, delimeter) => {
  // Retrieve the delimeter
  if (delimeter == undefined) delimeter = ',';
  if (delimeter && delimeter.length > 1) delimeter = ',';

  // initialize variables
  var newline = '\n';
  var eof = '';
  var i = 0;
  var c = data.charAt(i);
  var row = 0;
  var col = 0;
  var array = new Array();

  while (c != eof) {
    // skip whitespaces
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i); // read next char
    }

    // get value
    var value = '';
    if (c == '"') {
      // value enclosed by double-quotes
      c = data.charAt(++i);

      do {
        if (c != '"') {
          // read a regular character and go to the next character
          value += c;
          c = data.charAt(++i);
        }

        if (c == '"') {
          // check for escaped double-quote
          var cnext = data.charAt(i + 1);
          if (cnext == '"') {
            // this is an escaped double-quote.
            // Add a double-quote to the value, and move two characters ahead.
            value += '"';
            i += 2;
            c = data.charAt(i);
          }
        }
      } while (c != eof && c != '"');

      if (c == eof) {
        throw 'Unexpected end of data, double-quote expected';
      }

      c = data.charAt(++i);
    } else {
      // value without quotes
      while (
        c != eof &&
        c != delimeter &&
        c != newline &&
        c != ' ' &&
        c != '\t' &&
        c != '\r'
      ) {
        value += c;
        c = data.charAt(++i);
      }
    }

    // add the value to the array
    if (array.length <= row) array.push(new Array());
    array[row].push(value);

    // skip whitespaces
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i);
    }

    // go to the next row or column
    if (c == delimeter) {
      // to the next column
      col++;
    } else if (c == newline) {
      // to the next row
      col = 0;
      row++;
    } else if (c != eof) {
      // unexpected character
      throw 'Delimiter expected after character ' + i;
    }

    // go to the next character
    c = data.charAt(++i);
  }

  return array;
};

export const updateSearchQueryInUrl = instance => {
  let values = queryString.parse(instance.props.location.search);
  values = {
    ...values,
    ...instance.filter
  };
  const searchQuery = queryString.stringify(values);
  instance.props.history.push({
    pathname: instance.props.location.pathname,
    search: `?${searchQuery}`
  });
};
