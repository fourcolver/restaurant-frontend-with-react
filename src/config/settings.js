let settings;

settings = {
  BASE_URL: process.env.REACT_APP_API_ENDPOINT,
  INTEGER_PRECISION: 100
};

export const oAuth2 = {
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  client_id: process.env.REACT_APP_OAUTH2_CLIENT_ID,
  grant_type: 'password'
};

export default settings;
