import { wrapRequest, xapi } from '../utils';
import { oAuth2 } from 'config/settings';

const login = wrapRequest(async (username, password) =>
  xapi().post('/oauth/token', {
    ...oAuth2,
    username,
    password
  })
);

const getUser = wrapRequest(async () => xapi().get('/api/user'));

export { login, getUser };
