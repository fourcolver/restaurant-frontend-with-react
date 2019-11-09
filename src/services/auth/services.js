export const getStoredUser = () =>
  JSON.parse(localStorage.getItem('currentUser'));

export const storeCurrentUser = currentUser => {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
};

export const getStoredToken = () => JSON.parse(localStorage.getItem('token'));

export const storeCurrentToken = token => {
  localStorage.setItem('token', JSON.stringify(token));
};

export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

export const removeCurrentToken = () => {
  localStorage.removeItem('token');
};
